import Streamer from "./index"
import Downloader from "../download"
import { Client } from "elasticsearch"
import * as fs from "fs"
import * as path from "path"


main();

function main() {
    const target = "http://localhost:9200";


    const downloadClient = buildDownloadClient();
    const streamer = new Streamer(new Downloader(downloadClient), target);

    return streamer.execute()
        .catch(console.error)
        .then(_ => console.log('stream complete!'))
}

function buildDownloadClient() {
    const host = JSON.parse(fs.readFileSync(path.resolve('..', 'config.json')).toString()).host;
    return new Client({host});
}