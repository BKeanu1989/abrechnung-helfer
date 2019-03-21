#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const program = require('commander')
const Json2csvParser = require('json2csv').Parser;

program
    .arguments('<file> [options]')
    .option('')
    .action(function(file, options) {
        input = file
        options = options
    })
    .parse(process.argv)

const inputFile = path.resolve(process.cwd(), input)
const artistData_string = fs.readFileSync(inputFile, 'utf8')

const {name} = path.parse(inputFile)

const artistData = JSON.parse(artistData_string)

const products = artistData.products

const json2csvParser = new Json2csvParser()
const csv = json2csvParser.parse(products)
const writer = fs.writeFileSync(`./${name}-products.csv`, csv)