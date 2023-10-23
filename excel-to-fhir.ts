/**
 * Contains functions {@linkcode convertSheetsToJSON} and {@linkcode convertJSONToFHIR} for converting Gamebus Excel to FHIR resources.
 *
 * This module can also be used as a cli. If you want to run directly:
 *
 * ```shell
 * > # run conversion
 * > deno run --allow-read --allow-write XXX/excel-to-fhir.ts -f example-excel.xlsx -s sheetname1 sheetname2 -j mapping1.jsonata mapping2.jsonata
 * > # show help
 * > deno run --allow-read --allow-write XXX/excel-to-fhir.ts -h
 * ```
 *
 * If you want to install and run:
 *
 * ```shell
 * > # install
 * > deno install --allow-read --allow-write XXX/excel-to-fhir.ts
 * > # run conversion
 * > excel-to-fhir -f example-excel.xlsx -s sheetname1 sheetname2 -j mapping1.jsonata mapping2.jsonata
 * > # show help
 * > excel-to-fhir --help
 * ```
 *
 * @module
 */

import jsonata from "npm:jsonata@2.0.3";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";
import { ensureDir } from "https://deno.land/std@0.203.0/fs/mod.ts";
import { join, parse } from "https://deno.land/std@0.203.0/path/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

/**
 * The version of this module.
 */
export const VERSION = "0.0.1";

/**
 * Converts an Excel spreadsheet to JSON.
 *
 * @param filePath The path to the Excel spreadsheet file.
 * @param sheetNames The names of the sheets to convert.
 * @returns A record of sheet names to JSON data.
 */
export function convertSheetsToJSON(
  filePath: string,
  sheetNames: string[],
): Record<string, object[]> {
  const workbook = XLSX.readFile(filePath);
  const result: Record<string, object[]> = {};

  for (const sheetName of sheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`Sheet ${sheetName} not found`);

    const data = XLSX.utils.sheet_to_json(sheet);
    result[sheetName] = data;
  }

  return result;
}

/**
 * Converts JSON data to FHIR resources using a JSONata expression.
 * @param data The JSON data to convert.
 * @param jsonataExpression The JSONata expression to use.
 * @returns The converted FHIR resources.
 */
export async function convertJSONToFHIR(
  data: Record<string, object[]>,
  jsonataExpression: string,
): Promise<object[]> {
  const expression = jsonata(jsonataExpression);
  const transformedData = await expression.evaluate(data);
  return transformedData;
}

async function main() {
  // get arguments from command line
  const { options } = await new Command()
    .name("excel-to-fhir")
    .version(VERSION)
    .description("Transform Excel spreadsheet to FHIR resournces")
    .option("-f, --file <file:string>", "EXCEL file path.", { required: true })
    .option(
      "-s, --sheets [sheetNames...:string]",
      "List of sheet names. Must provide at least one name.",
      {
        depends: ["file"],
        required: true,
      },
    )
    .option(
      "-j, --jsonata [jsonata...:string]",
      "List of paths to JSONata expression files. Must provide at least one path.",
      {
        depends: ["sheets"],
        required: true,
      },
    )
    .example(
      "One sheet one jsonata",
      "excel-to-fhir -f gamebus.xlsx -s descriptor -j descriptor-to-fhirResourceType.jsonata",
    )
    .example(
      "Multiple jsonata",
      "excel-to-fhir -f gamebus.xlsx -s descriptor -j descriptor-to-fhirResourceType.jsonata descriptor-to-observationCategory.jsonata",
    )
    .example(
      "Multiple sheets",
      "excel-to-fhir -f gamebus.xlsx -s descriptor unit -j descriptor-to-fhirResourceType.jsonata unit-to-ucumUnit.jsonata",
    )
    .parse(Deno.args);

  const filePath = options.file;
  const sheetNames = options.sheets;
  const jsonataPaths = options.jsonata;

  // create output directory
  const outputDirName = "output";
  ensureDir(outputDirName);
  console.log("Set up output directory to 'output'");

  // convert the spreadsheet to JSON
  const data = convertSheetsToJSON(filePath, sheetNames);

  // convert the JSON data to FHIR resources
  for (const item of jsonataPaths) {
    const jsonataExpression = await Deno.readTextFile(item);
    const fhirData = await convertJSONToFHIR(data, jsonataExpression);

    const fileName = parse(item).name;
    await Deno.writeTextFile(
      join(outputDirName, `${fileName}.harmonization.json`),
      JSON.stringify(fhirData, null, 2),
    );
    console.log(`Wrote ${fileName}.harmonization.json`);
  }

  console.log("Transformation done!");
}

if (import.meta.main) {
  main();
}
