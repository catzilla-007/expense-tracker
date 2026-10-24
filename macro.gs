function doGet(request) {
  var date = request.parameter.date;
  var price = request.parameter.price;
  var name = request.parameter.name;
  var description = request.parameter.description;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('expense');
  sheet.appendRow([date, price, name, description]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success', data: 'expense added' })
  ).setMimeType(ContentService.MimeType.JSON);
}
