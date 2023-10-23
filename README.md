# EXCEL to FHIR

A typescript package to convert spreadsheet (EXCEL) to FHIR resources in JSON.

The workflow is as follows:

- convert format: read the spreadsheet and convert it to JSON
- transform schema: transform the JSON using JSONATA to FHIR resources (JSON)

We use [JSONATA](https://jsonata.org/) to transform schemas with mapping rules
defined in a `.jsonata` file.

This package aims to transform GameBus Excel to FHIR R4 (ConceptMap) resources,
for which the mapping rules have been defined in [this folder](jsonata). If
there are changes on GameBus Excel schema (e.g. changes on sheets and colomns),
the mapping rules must be updated accordingly. An example of the GameBus Excel
file is provided as [gamebus.xlsx](gamebus.xlsx).

## Requirements

- [Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

If you have deno installed, it's a good practice to update it to lastest version
using the command: `deno upgrade`.

## Usage

### Run the typescript package directly:

```shell
# run conversion
deno run --allow-read --allow-write https://raw.githubusercontent.com/nwo-strap/excel-to-fhir/main/excel-to-fhir.ts -f example-excel.xlsx -s sheetname1 sheetname2 -j mapping1.jsonata mapping2.jsonata

# show help
deno run --allow-read --allow-write https://raw.githubusercontent.com/nwo-strap/excel-to-fhir/main/excel-to-fhir.ts -h
```

### Run the typescript package as a command line tool

If you want to install the package as CLI tool and run:

```shell
# install
deno install --allow-read --allow-write https://raw.githubusercontent.com/nwo-strap/excel-to-fhir/main/excel-to-fhir.ts

# run conversion
excel-to-fhir -f example-excel.xlsx -s sheetname1 sheetname2 -j mapping1.jsonata mapping2.jsonata

# show help
excel-to-fhir --help
```

### Use Deno tasks in repo

You can define
[Deno tasks](https://docs.deno.com/runtime/manual/tools/task_runner) in the
[deno.json](deno.json) file with specific inputs and options.

In the file you can find the task `transform`, which is defined to convert
[gamebus.xlsx](gamebus.xlsx) file to FHIR resources with all valid sheets (with
all corresponding jsonata files). You can run the conversion with the following
command:

```shell
# clone the repo
git clone https://github.com/nwo-strap/excel-to-fhir.git
cd excel-to-fhir

# run the task
deno task transform
```

## Development

To run unit tests, use the following command:

```shell
deno test --allow-read --allow-write
```

To watch file changes and check output during development, use the following
command:

```shell
deno task dev
```
