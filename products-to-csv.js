#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const program = require('commander')
const Json2csvParser = require('json2csv').Parser;

let input
let options 

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

const artistData = JSON.parse(artistData_string)

const products = artistData.products

const json2csvParser = new Json2csvParser()
const csv = json2csvParser.parse(products)