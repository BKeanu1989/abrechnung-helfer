#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const Json2csvParser = require('json2csv').Parser;

const {baseUrl, urlEnding} = require('./config.json')

program
    .arguments('<file> [options]')
    .option('')
    .action(function(file, options) {
        input = file
        options = options
    })
    .parse(process.argv)

let errors = []

const inputFile = path.resolve(process.cwd(), input)
const artistData_string = fs.readFileSync(inputFile, 'utf8')

const {name} = path.parse(inputFile)

const artistData = JSON.parse(artistData_string)

const {start, end} = artistData.timeFrame
const products = artistData.products

const json2csvParser = new Json2csvParser()
const valid_csv = json2csvParser.parse(products)
const writer = fs.writeFileSync(`./${name}-products-${start}-${end}.csv`, valid_csv)

products.forEach((product) => {
    let valid = (product['_qty']) ? true : false
    product.order_url = `${baseUrl}${product['order_id']}${urlEnding}`
    if (!valid) {
        errors.push(product)
    }
})

const error_csv = json2csvParser.parse(errors)
fs.writeFileSync(`./${name}-products-errors-${start}-${end}.csv`, error_csv)
