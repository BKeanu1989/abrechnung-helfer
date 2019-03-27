#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const program = require('commander')
const Json2csvParser = require('json2csv').Parser;

let input
let options
let fileName 

program
    .arguments('<file> [options]')
    .option('-f, --fields', 'Add Fields')
    .action(function (file, options) {
        input = file
        options = options
    })
    .parse(process.argv)

let errors = []

const inputFile = path.resolve(process.cwd(), input)
const artistData_string = fs.readFileSync(inputFile, 'utf8')
const {name} = path.parse(inputFile) 
fileName = name

const artistData = JSON.parse(artistData_string)

const products = artistData.products
const {start, end} = artistData.timeFrame

let names = products.map((x) => x.order_item_name)
let uniqueNames = [...new Set(names)]

let counter = {}

uniqueNames.forEach((uniqueName) => {
    counter[uniqueName] = 0
})

products.forEach((product) => {
    // if shop system throws an error -> set qty to 1 not very accurate, but better than no result
    let valid = (product['_qty']) ? true : false
    if (!valid) { 
        errors.push(product)
    }

    counter[product['order_item_name']] += product['_qty'] ? parseInt(product['_qty']) : 1
})

let rows = []

for (productName in counter) {
    let obj = {}
    obj.name = productName
    obj.count = counter[productName]
    rows.push(obj)
}

const json2csvParser = new Json2csvParser({fields: ['name', 'count']})
const csv = json2csvParser.parse(rows)

const writer = fs.writeFileSync(`./${fileName}-counts-${start}-${end}.csv`, csv)
console.log("---- following products dont have a quantity ----")
console.log(errors)
// not possible for me (<= node 10)
// console.table(errors)
console.log("----- end")