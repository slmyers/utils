import { Client } from 'elasticsearch'
import { YcbDownloader } from "./index"
import * as path from "path"
import * as fs from "fs"


main();


function main() {
    let folder;

    buildOutputFolder()
        .then(outputFolder => folder = outputFolder)
        .then(executeDownload)
        .catch(downloadFailure)
        .then(data => writeDataToFile(data, folder))
        .catch(writeFileError)
        .then(_ => console.log("Download complete."))
}

function executeDownload(): Promise<any> {
    const args = process.argv.slice(2);
    const host = JSON.parse(fs.readFileSync(path.resolve('..', 'config.json')).toString()).host  || args[0];

    return new YcbDownloader(new Client({ host })).execute()
}

function downloadFailure(err) {
    console.log("Could not download");
    console.error(err);
    process.exit(1);
}

function writeFileError(err) {
    console.log("Could not write file");
    console.error(err);
    process.exit(2);
}

function writeDataToFile({programs, programMappings,  queries, queryMappings, screener, screenerMappings}, folder: string) {
    const programPath = path.resolve(folder, 'programs.json');
    const programMappingPath = path.resolve(folder, 'program_mapping.json');
    const queriesPath = path.resolve(folder, 'queries.json');
    const queryMappingPath = path.resolve(folder, 'query_mapping.json');
    const screenerPath = path.resolve(folder, 'screener.json');
    const screenerMappingPath = path.resolve(folder, 'screener_mapping.json');

    const programWrite = writeToFilePromise(programPath, programs);
    const programMappingWrite = writeToFilePromise(programMappingPath, programMappings);
    const queryWrite = writeToFilePromise(queriesPath, queries);
    const queryMappingWrite = writeToFilePromise(queryMappingPath, queryMappings);
    const screenerWrite = writeToFilePromise(screenerPath, screener);
    const screenerMappingWrite = writeToFilePromise(screenerMappingPath, screenerMappings);

    return Promise.all([
        programWrite,
        programMappingWrite,
        queryWrite,
        queryMappingWrite,
        screenerWrite,
        screenerMappingWrite
    ])
}

function buildOutputFolder(): Promise<string> {
    const args = process.argv.slice(2);

    const folder = args[0] ? path.resolve( __dirname, '..', args[0]) : path.resolve(__dirname, 'data');

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }

    return Promise.resolve(folder)
}

function writeToFilePromise(path, data): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data), err => {
            if (err) reject(err);

            resolve(true)
        })
    });
}