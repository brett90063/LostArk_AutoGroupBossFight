function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function getSheetData(sheetName) {
  var fileId = '1W_jJ9HpF95pJf2I8F2L-pB3bwXb5jiPlHVcs5c1lIoM'; // !!! Replace with your file ID !!!
  try {
    Logger.log('Trying to open file with ID: ' + fileId);
    var spreadsheet = SpreadsheetApp.openById(fileId);
    Logger.log('File opened successfully');

    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log('未找到工作表。請檢查工作表名稱。或洽詢派派:D');
      return {data: [], backgroundColors: [], fontColors: []};
    }
    Logger.log('Sheet found');

    var dataRange = sheet.getDataRange();
    var data = dataRange.getValues();
    var backgroundColors = dataRange.getBackgrounds();
    var fontColors = dataRange.getFontColors();

    return {data: data, backgroundColors: backgroundColors, fontColors: fontColors};

  } catch (e) {
    Logger.log('Cannot open file: ' + e.message);
    return {data: [], backgroundColors: [], fontColors: []};
  }
}