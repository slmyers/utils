import { Client } from 'elasticsearch'
import Seeder from "./index"
import * as path from "path"
import * as fs from "fs"

main();

function main() {
    readData()
        .catch(readDataError)
        .then(executeSeed)
        .catch(executeSeedError)
        .then(_ => console.log("Seed is completed."))
}

function readData(folder?: string): Promise<{[key: string] : Object}[]> {
    const concreteFolder = folder || path.resolve(__dirname, 'data');

    const programs = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'programs.json')).toString()
    );

    const queries = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'queries.json')).toString()
    );

    const screener = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'screener.json')).toString()
    );

    const programMapping = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'program_mapping.json')).toString()
    ).programs;

    const queryMapping = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'query_mapping.json')).toString()
    ).master_screener;

    const screenerMapping = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'screener_mapping.json')).toString()
    ).questions;


    return Promise.resolve([
        {
            programs,
            queries,
            screener
        },
        {
            programMapping,
            queryMapping,
            screenerMapping
        }
    ])
}

function readDataError(err) {
    console.log("Could read local data.");
    console.error(err);
    process.exit(3);
}

function executeSeed(_data: {[key: string]: Object}[]): Promise<Object> {
    // const args = process.argv.slice(2);
    //const target = JSON.parse(fs.readFileSync(path.resolve('..', 'config.json')).toString()).target  || args[0];
    const target = "http://localhost:9200";

    const [data, mappings] = _data;


    if (target.includes("youcanbenefit")) {
        return Promise.reject(new Error("ACCIDENTAL SEED"))
    }

    return new Seeder(new Client({host: target, log: 'trace'}), data, mappings).execute()
}

function executeSeedError(err) {
    if (err.message === "ACCIDENTAL SEED") {
        console.log("SEEDING A LIVE ENDPOINT");
        console.log("STOPPING SEED TO SAVE YOUR ASS");
        process.exit(4);
    }


    console.log("Could not seed data.");
    console.error(err);
    process.exit(3);
}