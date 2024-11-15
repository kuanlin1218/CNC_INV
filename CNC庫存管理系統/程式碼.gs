function doGet() {
  //return HtmlService.createHtmlOutputFromFile('index');
  var html = HtmlService.createTemplateFromFile("index");
  var check = html.evaluate();
  var show = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return show;
}

// 抓取下拉式選單與顯示所需的資料
function fetchData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('盤點表');
  const data = sheet.getDataRange().getValues();
  const backgrounds = sheet.getDataRange().getBackgrounds(); // 取得每個儲存格的背景色

  const result = data.slice(1).map((row, index) => ({
    id: row[0],
    category: row[1],
    productName: row[2],
    specification: row[3],
    brand: row[4],
    quantity: row[5],
    background: backgrounds[index + 1][0] // 假設顏色設在編號欄位
  }));

  return result;
}

// 更新庫存數量至 Google 試算表
function updateStock(itemID, newQuantity) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('盤點表');
  const data = sheet.getDataRange().getValues();

  try {
    newQuantity = Number(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      throw new Error("請輸入有效的數量");
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == itemID) {
        sheet.getRange(i + 1, 6).setValue(newQuantity);
        sheet.getRange(i + 1, 1, 1, 6).setBackground('#FFFF00');
        return { success: true, updatedRow: [...data[i].slice(0, 5), newQuantity] };
      }
    }

    throw new Error("未找到匹配的資料");
  } catch (error) {
    return { success: false, message: error.message };
  }
}


