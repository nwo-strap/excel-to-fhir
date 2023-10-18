# EXCEL to FHIR

A typescript module to convert spreadsheet (EXCEL) to FHIR resources in JSON.

The workflow is as follows:

- convert format: read the spreadsheet and convert it to JSON
- transform schema: transform the JSON using JSONATA to FHIR resources (JSON)

We use [JSONATA](https://jsonata.org/) to transform schemas with mapping rules
defined in a `.jsonata` file.

This module aims to transform GameBus Excel to FHIR R4 (ConceptMap) resources,
for which the mapping rules have been defined in [this folder](jsonata). If
there are changes on GameBus Excel schema (e.g. changes on sheets and colomns),
the mapping rules must be updated accordingly. An example of the GameBus Excel
file is provided as [gamebus.xlsx](gamebus.xlsx).

## Requirements

- [Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

If you have deno installed, it's a good practice to update it to lastest version
using the command: `deno upgrade`.

## Usage

### Run the typescript module directly:

```shell
> # run conversion
> deno run --allow-read --allow-write XXX/excel-to-fhir.ts -f example-excel.xlsx -s sheetname1 sheetname2
>
> # show help
> deno run --allow-read --allow-write XXX/excel-to-fhir.ts -h
```

### Run the typescript module as a command line tool

If you want to install the module as CLI tool and run:

```shell
> # install
> deno install --allow-read --allow-write XXX/excel-to-fhir.ts
>
> # run conversion
> excel-to-fhir -f example-excel.xlsx -s sheetname1 sheetname2
>
> # show help
> excel-to-fhir --help
```
