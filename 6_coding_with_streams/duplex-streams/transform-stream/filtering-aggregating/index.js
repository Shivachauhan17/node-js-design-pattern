import { createReadStream } from 'node:fs'
import { Parser } from 'csv-parse' // v5.6.0
import { FilterByCountry } from './filter-by-country.js'
import { SumProfit } from './sum-profit.js'
const csvParser = new Parser({ columns: true })
createReadStream('data.csv.gz') 
  .pipe(csvParser) //Transform stream
  .pipe(new FilterByCountry('Italy')) //Transform subclass
  .pipe(new SumProfit()) //transform subclass
  .pipe(process.stdout) //writable