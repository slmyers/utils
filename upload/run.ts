import { Client } from 'elasticsearch'
import { Uploader } from "./index"
import * as path from "path"
import * as fs from "fs"

main();

function main() {
    readData()
        .catch(readDataError)
        .then(executeUpload)
        .catch(uploadError)
        .then(_ => console.log("Upload complete"))
}

function readData(folder?: string): Promise<{[key: string] : Object}> {
    const concreteFolder = folder || path.resolve(__dirname, '..', 'data');

    const programs = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'programs.json')).toString()
    );

    const queries = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'queries.json')).toString()
    );

    const screener = JSON.parse(
        fs.readFileSync(path.resolve(concreteFolder, 'screener.json')).toString()
    );

    return Promise.resolve({
        programs,
        queries,
        screener
    })
}

function readDataError(err) {
    console.log("Could read local data.");
    console.error(err);
    process.exit(3);
}

function executeUpload(data: {[key: string] : Object}): Promise<Object> {
    const args = process.argv.slice(2);
    const target = JSON.parse(fs.readFileSync(path.resolve('..', 'config.json')).toString()).target  || args[0];


    if (target.includes("youcanbenefit")) {
        return Promise.reject(new Error("ACCIDENTAL UPLOAD"))
    }

    return new Uploader(new Client({host: target}), true, data).execute()
}

function uploadError(err) {
    if (err.message === "ACCIDENTAL UPLOAD") {
        console.log("UPLOADING DATA TO LIVE ENDPOINT");
        console.log("STOPPING UPLOAD TO SAVE YOUR ASS");
        process.exit(4);
    }

    console.log("Could not upload data.");
    console.error(err);
    process.exit(5)
}