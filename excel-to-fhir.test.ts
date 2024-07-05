import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.203.0/assert/mod.ts";
import { convertJSONToFHIR, convertSheetsToJSON } from "./excel-to-fhir.ts";

/**
 * Test convertSheetsToJSON
 */
Deno.test("convertSheetsToJSON test valid sheets", () => {
  const filePath = "testdata/example.xlsx";
  const sheetNames = ["property", "unit"];
  const expected = {
    property: [
      {
        game_property: "STEPS",
        LOINC_code: 100,
        LOINC_display: "Steps_L",
        LOINC_equivalence: "equivalent",
        SNOMED_code: 100,
        SNOMED_display: "Steps_S",
        SNOMED_equivalence: "equivalent",
      },
      {
        game_property: "DISTANCE",
        LOINC_code: "L002",
        LOINC_display: "Distance_L",
        LOINC_equivalence: "equivalent",
        SNOMED_code: "S002",
        SNOMED_display: "Distance_S",
        SNOMED_equivalence: "equivalent",
      },
    ],
    unit: [
      {
        unit: "meters",
        UCUM_code: "m",
        UCUM_display: "meter",
        UCUM_equivalence: "equal",
      },
      {
        unit: "seconds",
        UCUM_code: "s",
        UCUM_display: "second",
        UCUM_equivalence: "equivalent",
      },
    ],
  };

  const result = convertSheetsToJSON(filePath, sheetNames);

  assertEquals(result, expected);
});

Deno.test("convertSheetsToJSON test non-existent sheets", () => {
  const filePath = "testdata/example.xlsx";
  const sheetNames = ["sheet1"];

  assertThrows(
    () => convertSheetsToJSON(filePath, sheetNames),
    Error,
    "Sheet sheet1 not found",
  );
});

/**
 * Test convertJSONToFHIR
 */
Deno.test("convertJSONToFHIR test valid input", async () => {
  const data = {
    people: [{ name: "John", age: 30 }],
  };
  const jsonataExpression = "people.name";
  const expected = "John";

  const result = await convertJSONToFHIR(data, jsonataExpression);

  assertEquals(result, expected);
});

Deno.test("convertJSONToFHIR test empty input", async () => {
  const data = {};
  const jsonataExpression = "people.name";
  const expected = undefined;

  const result = await convertJSONToFHIR(data, jsonataExpression);

  assertEquals(result, expected);
});
