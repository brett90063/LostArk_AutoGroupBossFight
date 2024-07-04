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
 */
function autoGroupBossFight() {
  var fileId = '1-pfdTSkJlukMOgrHm0BmCLNk1tdKPA-rb6CZUhJIAO0'; // !!! Replace with your file ID !!!
  var sheetname = '班表'; // !!! Replace with your sheet Name (must include pivot table) !!!

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

      // Add header row
      allGroups.push(this.data[0].slice(0, 4).concat("平均裝分"));

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
          // Logger.log('==========');
          // Logger.log('Processing ' + group.length);
          // Logger.log('current checkdup:' + checkdup.join(','));
          var current_front = 0;
          var current_end = candidates.length - 1;
          var breakcase = false;
          // Alternate between highest and lowest candidates
          var candidate;
          if (group.length % 2 === 0) {
            candidate = candidates[current_front];
            // Logger.log('finding ' + current_front + ' ' + candidate.join(','));
          } else {
            candidate = candidates[current_end];
            // Logger.log('finding ' + current_end + ' ' + candidate.join(','));
          }

          // Logger.log('current count ' + supportCount + ' ' + damageCount);
          if (supportCount < 2) {
            // Logger.log('in support chain ' + candidate[3].trim());
            while (checkdup.includes(candidate[2]) || !this.supportClasses.includes(candidate[3].trim())) {
              if (group.length % 2 === 0) {
                current_front++;
                if (current_front >= candidates.length) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_front];
                // Logger.log('finding ' + current_front + ' ' + candidate.join(','));
              } else {
                current_end--;
                if (current_end < 0) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_end];
                // Logger.log('finding ' + current_end + ' ' + candidate.join(','));
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
            // Logger.log('Added to support ' + (breakcase ? '(break) ' : '') + supportCount + ' for ' + boss + ': ' + candidate[2] + ' ' + candidate[3] + ' ' + candidate[1] + ' ' + group.length);
          } else if (damageCount < 6) {
            // Logger.log('in damage chain ' + candidate[3].trim());
            while (checkdup.includes(candidate[2]) || this.supportClasses.includes(candidate[3].trim())) {
              if (group.length % 2 === 0) {
                current_front++;
                if (current_front >= candidates.length) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_front];
                // Logger.log('finding ' + current_front + ' ' + candidate.join(','));
              } else {
                current_end--;
                if (current_end < 0) {
                  breakcase = true;
                  break;
                }
                candidate = candidates[current_end];
                // Logger.log('finding ' + current_end + ' ' + candidate.join(','));
              }
            }
            if (breakcase) {
              skipgroup = true;
              break;
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
            damageCount++;
            // Logger.log('Added to damage ' + (breakcase ? '(break) ' : '') + damageCount + ' for ' + boss + ': ' + candidate[2] + ' ' + candidate[3] + ' ' + candidate[1] + ' ' + group.length);
          }
        }
        if(skipgroup){
          // Logger.log('rest candidates ' + candidates.length);
          // Logger.log('current group ' + group.length);
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
          var emptyRow = ['隊伍', letter, '', '', ''];
          allGroups.push(emptyRow);
        }

        // If group is complete, calculate average DPS 裝分
        if (group.length > 0) {
          var dpsSum = 0;
          var dpsCount = 0;

          for (var i = 0; i < group.length; i++) {
            var profession = group[i][3].trim();
            if (!this.supportClasses.includes(profession)) {
              dpsSum += parseInt(group[i][1], 10); // Assuming 裝分 is in the 2nd column, index 1
              dpsCount++;
            }
          }

          var dpsAverage = dpsSum / dpsCount;
          for (var i = 0; i < group.length; i++) {
            var row = group[i].slice(0, 4);
            if (i === group.length - 1) {
              row.push(dpsAverage.toFixed(2));
            } else {
              row.push('');
            }
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
      var profession = this.data[i][3].trim();
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
      var profession = groupSheet.getRange(rowIndex, 4).getValue().trim();
      var columnValues = [
        groupSheet.getRange(rowIndex, 1).getValue(),
        groupSheet.getRange(rowIndex, 2).getValue(),
        groupSheet.getRange(rowIndex, 3).getValue(),
        groupSheet.getRange(rowIndex, 4).getValue(),
        groupSheet.getRange(rowIndex, 5).getValue()
      ];

      if (this.supportClasses.includes(profession)) {
        groupSheet.getRange(rowIndex, 4).setBackground("yellow");
      } else if (['煞', '氣', 'a', '孤', '兒'].some(value => columnValues.includes(value))) {
        groupSheet.getRange(rowIndex, 1).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 2).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 3).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 4).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 5).setBackground("#D3D3D3D3");
      } else if (["隊伍"].some(value => columnValues.includes(value))) {
        groupSheet.getRange(rowIndex, 1).setBackground("#D3D3D3D3");
        groupSheet.getRange(rowIndex, 2).setBackground("#D3D3D3D3");
      }
    }

    Logger.log('Group result for ' + boss + ' written, centered, and profession highlighted successfully');
  }
}

