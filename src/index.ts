import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import path from 'path';
import { readdir, rm, mkdir } from 'fs/promises';

const BASE_SOURCE_FILES_PATH = path.join(__dirname, '../Source files/');
const OUTPUT_DIR = path.join(__dirname, './barcodes');
const hospitalUnitWardsMap: Map<string, string[]> = new Map();

async function getAllSourceFiles(directoryPath: string): Promise<string[]> {
  try {
    const files: string[] = await readdir(directoryPath);
    return files;
  } catch (error: unknown) {
    console.error(`Error fetching source files: ${error}`);
    return [];
  }
}

function readDataFromExcel(filePath: string): string[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const extractedData = (data as any[]).map((row) => `${row[0]}_${row[1]}`.trim()).filter(Boolean);

  return extractedData;
}

async function generateBarcode(wards: string[], folderName: string) {
  const outputFolder = `${OUTPUT_DIR}/${folderName}`;

  await removeOrCreateFolder(outputFolder);

  wards.forEach((ward) => {
    const canvas = createCanvas(200, 100);

    JsBarcode(canvas, ward, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 18,
    });

    const buffer = canvas.toBuffer('image/png');
    try {
      console.log(`Generating barcode for: ${ward}...`);
      fs.writeFile(`${outputFolder}/${ward}_BARCODE.png`, buffer, (error) => {
        if (error) {
          throw error;
        }
      });
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  });

  console.log(`Barcode generation complete for ${folderName}`);
}

async function removeOrCreateFolder(folderPath: string): Promise<void> {
  try {
    if (fs.existsSync(folderPath)) {
      await rm(folderPath, { recursive: true, force: true });
    }
    await mkdir(folderPath, { recursive: true });
  } catch (error) {
    console.error('Error removing or creating folder:', error);
  }
}

async function init() {
  await removeOrCreateFolder(OUTPUT_DIR);

  if (!fs.existsSync(BASE_SOURCE_FILES_PATH)) {
    console.error('Source files to generated barcodes does not exists');
    return;
  }

  const filesNames: string[] = await getAllSourceFiles(BASE_SOURCE_FILES_PATH);

  filesNames.forEach((fileName: string) => {
    const excelData = readDataFromExcel(`${BASE_SOURCE_FILES_PATH}${fileName}`);
    excelData.shift();

    const hospitalUnit = excelData[0].split('_')[1];

    hospitalUnitWardsMap.set(hospitalUnit, []);

    if (hospitalUnitWardsMap.has(hospitalUnit)) {
      hospitalUnitWardsMap.get(hospitalUnit)?.push(...excelData);
    }
  });

  hospitalUnitWardsMap.forEach((wards: string[], hospitalUnit: string) => {
    generateBarcode(wards, hospitalUnit);
  });
}

init();
