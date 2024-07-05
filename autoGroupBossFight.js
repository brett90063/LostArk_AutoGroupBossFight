/**
 * Auto Group Boss Fight Script
 * 
 * Date: 2024/07/04
 * Version: 1.0
 * Author: 阿派
 * Description: This script automatically groups players for boss fights in Lost Ark (日月鹿, 普牛, 普魅).
 *              It reads player data from a Google Sheets document, filters candidates,
 *              and groups them into balanced teams based on their roles and willingness
 *              to participate in specific boss fights.
 * 
 * Important Info:
 * - This script requires the Google Sheets API.
 * - Ensure the file ID and sheet names are correctly set.
 * - Make sure the sheet already includes a pivot table.
 * - The file should be a Google Sheet; Excel files are not supported.
 * 
 * Changelog:
 * Version 1.0 (2024/07/04)
 * - Initial release.
 * 
 * Note: Please replace the file ID and sheet name with your own.
 *
 * Game: Lost Ark
 * Server: 阿曼
 * Dedicated to the guild 阿曼我來就你了.
 * 
 * The row of this code is by:
 * Index, 裝分, 玩家, 職業, 順位, 日月鹿, 普牛, 普魅
 * (you can generate by pivot table)
 */
function autoGroupBossFight() {
  var fileId = '1-pfdTSkJlukMOgrHm0BmCLNk1tdKPA-rb6CZUhJIAO0'; // !!! Replace with your file ID !!!
  var sheetname = '班表';                                       // !!! Replace with your sheet Name !!!

  try {
    Logger.log('Trying to open file with ID: ' + fileId);
    var spreadsheet = SpreadsheetApp.openById(fileId);
    Logger.log('File opened successfully');

    var sheet = spreadsheet.getSheetByName(sheetname);
    if (!sheet) {
      Logger.log('未找到工作表。請檢查工作表名稱。或洽詢派派:D');
      return;
    }
    Logger.log('Sheet found');

    var bossFightGrouper = new BossFightGrouper(sheet, spreadsheet);
    bossFightGrouper.processGrouping();

  } catch (e) {
    Logger.log('cant open file：' + e.message);
  }
}

class BossFightGrouper {
  constructor(sheet, spreadsheet) {
    this.sheet = sheet;
    this.spreadsheet = spreadsheet;
    this.supportClasses = ["畫家", "詩人", "聖騎", "超可愛畫家"]; // Support class list
    this.bosses = ['日月鹿', '普牛', '普魅'];
    this.bossColumns = [5, 6, 7]; // Column indices for the bosses
    this.data = this.sheet.getDataRange().getValues();
  }

  processGrouping() {
    for (var bossIndex = 0; bossIndex < this.bosses.length; bossIndex++) {
      var boss = this.bosses[bossIndex];
      var columnIndex = this.bossColumns[bossIndex];
      var allGroups = [];

      // Add header row (skip the index column by starting from column 1)
      allGroups.push(this.data[0].slice(1, 1).concat("裝等", "玩家", "職業", "打手平均裝分", "")); // 平均裝分 only calculate in damage classes
      var emptyRow = new Array(5).fill('');
      allGroups.push(emptyRow);

      // Store players willing to join the boss fight
      var candidates = this.getCandidates(columnIndex);

      // Sort candidates by gear(裝分) (assuming 裝分 is in the 2nd column, index 1)
      candidates.sort(function(a, b) {
        return b[1] - a[1]; // Sort from high to low
      });

      var groupcount = 0;
      // Group players
      while (candidates.length > 0) {
        var supportCount = 0;
        var damageCount = 0;
        var group = [];
        var checkdup = [];
        var skipgroup = false;

        while (group.length < 8 && candidates.length > 0 && !skipgroup) {
          var current_front = 0;
          var current_end = candidates.length - 1;
          var breakcase = false;
          var candidate;
          if (group.length % 2 === 0) {
            candidate = candidates[current_front];
          } else {
            candidate = candidates[current_end];
          }

          if (supportCount < 2) {
            while (checkdup.includes(candidate[2]) || !this.isSupport(candidate)) {
              if (group.length % 2 === 0) {
                current_front++;
                if (current_front >= candidates.length) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_front];
              } else {
                current_end--;
                if (current_end < 0) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_end];
              }
            }
            if (breakcase) {
              if (group.length % 2 === 0) {
                current_front--;
              } else {
                current_end++;
              }
            }
            if (group.length % 2 === 0) {
              candidates.splice(current_front, 1);
            } else {
              candidates.splice(current_end, 1);
            }
            group.push(candidate);
            checkdup.push(candidate[2]);
            supportCount++;
          } else if (damageCount < 6) {
            while (checkdup.includes(candidate[2]) || this.isSupport(candidate)) {
              if (group.length % 2 === 0) {
                current_front++;
                if (current_front >= candidates.length) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_front];
              } else {
                current_end--;
                if (current_end < 0) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_end];
              }
            }
            if (breakcase) {
              skipgroup = true;
              break;
            }
            if (group.length % 2 === 0) {
              candidates.splice(current_front, 1);
            } else {
              candidates.splice(current_end, 1);
            }
            group.push(candidate);
            checkdup.push(candidate[2]);
            damageCount++;
          }
        }
        if(skipgroup){
          if (group.length + candidates.length <= 8){
            while(candidates.length > 0){
              group.push(candidates.shift());
            }
          }
        }
        if (skipgroup || group.length < 8) {
          var emptyRow = ['煞', '氣', 'a', '孤', '兒'];
          allGroups.push(emptyRow);
        }

        groupcount++;
        if (group.length === 8) {
          var letter = String.fromCharCode(65 + (groupcount - 1)); // Convert groupcount to corresponding letter (A, B, C, ...)
          var emptyRow = ['隊伍' + letter, '', '', '', ''];
          allGroups.push(emptyRow);
        }

        // If group is complete, calculate average DPS 裝分
        if (group.length > 0) {
          var dpsSum = 0;
          var dpsCount = 0;

          for (var i = 0; i < group.length; i++) {
            if (!this.isSupport(group[i])) {
              dpsSum += parseInt(group[i][1], 10); // Assuming 裝分 is in the 2nd column, index 1
              dpsCount++;
            }
          }

          var dpsAverage = dpsSum / dpsCount;
          for (var i = 0; i < group.length; i++) {
            var row = group[i].slice(1, 4); // Skip the index column
            if (i === group.length - 1) {
              row.push(dpsAverage.toFixed(2));
            } else {
              row.push('');
            }
            row.push("");
            allGroups.push(row);
          }

          // Add an empty row to separate different groups
          var emptyRow = new Array(5).fill('');
          allGroups.push(emptyRow);

          Logger.log('Group for ' + boss + ' formed with average DPS 裝分: ' + dpsAverage.toFixed(2));
        }
      }

      this.writeResultsToSheet(boss, allGroups);
    }
  }

  getCandidates(columnIndex) {
    var candidates = [];
    for (var i = 2; i < this.data.length; i++) {
      var willingToJoin = this.data[i][columnIndex] === 'Y';
      if (willingToJoin) {
        candidates.push(this.data[i]);
      }
    }
    return candidates;
  }

  writeResultsToSheet(boss, allGroups) {
    var groupSheetName = "result" + boss;
    var groupSheet = this.spreadsheet.getSheetByName(groupSheetName);
    if (!groupSheet) {
      groupSheet = this.spreadsheet.insertSheet(groupSheetName);
    } else {
      groupSheet.clear(); // Clear previous results
    }
    var range = groupSheet.getRange(1, 1, allGroups.length, allGroups[0].length);
    range.setValues(allGroups);
    range.setHorizontalAlignment("center");

    Logger.log('Marking the special color...Please wait.');
    for (var rowIndex = 2; rowIndex <= allGroups.length; rowIndex++) {
      var profession = groupSheet.getRange(rowIndex, 3).getValue().trim(); // Update to 3rd column after skipping index
      var columnValues = [
        groupSheet.getRange(rowIndex, 1).getValue(),
        groupSheet.getRange(rowIndex, 2).getValue(),
        groupSheet.getRange(rowIndex, 3).getValue(),
        groupSheet.getRange(rowIndex, 4).getValue(),
        groupSheet.getRange(rowIndex, 5).getValue()
      ];

      if (this.supportClasses.includes(profession)) {
        groupSheet.getRange(rowIndex, 3).setFontColor("red"); // Update to 3rd column after skipping index
      } else if (['煞', '氣', 'a', '孤', '兒'].some(value => columnValues.includes(value))) {
        groupSheet.getRange(rowIndex, 1).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 2).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 3).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 4).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 5).setBackground("#D3D3D3D3");
      } else if (typeof columnValues[0] === 'string' && columnValues[0].indexOf("隊伍") === 0) {
        groupSheet.getRange(rowIndex, 1).setBackground("#D3D3D3D3");
      }
    }

    Logger.log('Group result for ' + boss + ' written, centered, and profession highlighted successfully');
  }

  isSupport(candidate) {
    return this.supportClasses.includes(candidate[3].trim());
  }
}