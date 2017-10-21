import * as fs from "fs"
import * as path from "path"

const programs = fs.readFileSync(path.resolve(__dirname, 'programs.json')).toString();
const queries = fs.readFileSync(path.resolve(__dirname, 'queries.json')).toString();
const screener = fs.readFileSync(path.resolve(__dirname, 'screener.json')).toString();

console.log(JSON.parse(programs).length);
console.log(JSON.parse(queries).length);
console.log(JSON.parse(screener));
