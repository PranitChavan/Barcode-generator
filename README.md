# PDAC Barcode Generator

This project generates CODE128 barcodes for careOn wards using data from Excel (XLSX) files. It reads ward/unit data from Excel files in a source folder, generates barcode images for each entry, and saves them as PNG files in organized output folders.

## Features

- Reads data from multiple XLSX files in a source directory
- Generates CODE128 barcodes using `jsbarcode` and `canvas`
- Saves barcodes as PNG images in per-hospital/unit folders
- Cleans and recreates output folders on each run
- TypeScript-based, with easy development and debugging setup

## Project Structure

```
Barcode-generator/
├── src/
│   └── index.ts           # Main application logic
├── Source files/          # Place your XLSX files here (input data)
├── barcodes/              # Output directory for generated barcodes (auto-created)
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript configuration
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── ...
```

## Getting Started

1. **Clone the repository:**

   ```
   git clone https://github.com/PranitChavan/Barcode-generator.git
   cd Barcode-generator
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Add your Excel files:**

   - Place your `.xlsx` files in the `Source files` directory. Each file should have ward/unit names in the first column of the first sheet.

4. **Build the project:**

   ```
   npm run build
   ```

5. **Run the application:**
   ```
   npm start
   ```
   This will compile the TypeScript and run the barcode generator. Output images will be saved in the `barcodes` directory, organized by hospital/unit.

## Development (Live Reload)

For live development (auto-compile and restart on save), you can use tools like `nodemon` and `concurrently`. Add these to your `devDependencies` and use a script like:

```
"dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\""
```

Then run:

```
npm run dev
```

## Debugging

This project is ready for debugging in VS Code:

- Open the project in VS Code.
- Set breakpoints in `src/index.ts`.
- Use the provided launch configuration in `.vscode/launch.json`.
- Press F5 to start debugging.

## Scripts

- `npm run build`: Compiles the TypeScript files to `dist/`.
- `npm start`: Compiles and runs the application.
- `npm run dev`: (If configured) Runs TypeScript in watch mode and restarts on changes.

## License

MIT License
