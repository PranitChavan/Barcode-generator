import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import path from 'path';

const EXCEL_FILE_PATH = path.join(__dirname, '../Barcode images data source/MILPARK_WARDS.xlsx'); // Relative path to the Excel file
const OUTPUT_DIR = path.join(__dirname, './barcodes');

function generateBarcode(data: string, filename: string) {
  const canvas = createCanvas(200, 100);
  JsBarcode(canvas, data, {
    format: 'CODE128',
    displayValue: true,
    fontSize: 18,
  });

  const buffer = canvas.toBuffer('image/png');
  try {
    fs.writeFileSync(`${OUTPUT_DIR}/${filename}.png`, buffer);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}

function readDataFromExcel(filePath: string): string[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const extractedData = (data as any[]).map((row) => row[0]).filter(Boolean);

  return extractedData;
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('Output directory does not exist. Creating...');
    fs.mkdirSync(OUTPUT_DIR);
  } else {
    console.log('Output directory already exists.');
  }

  const data = readDataFromExcel(EXCEL_FILE_PATH);

  data.forEach((item, index) => {
    if (index === 0) return;
    generateBarcode(item, `barcode_${index}`);
    console.log(`Generated barcode for: ${item}`);
  });

  console.log('Barcode generation complete!');
}

main();

// MILPARK_C23W1015_BARCODE
