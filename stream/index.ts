import { YcbDownloader } from "../download"
import { Client } from "elasticsearch"
import { Seeder } from "../seed"
import * as fs from "fs"
import * as path from "path"


export class Stream {

    constructor(
        private downloader: YcbDownloader,
        private target: string
    ) {
        if (target.includes("youcanbenefit")) {
            throw new Error("SEEDING LIVE ENDPOINT");
        }

    }

    execute() {
        return this.downloader.execute()
            .catch(_ => this.genError("ERROR DOWNLOADING", _))
            .then((result: {[key: string]: any}) => {
                console.log("DOWNLOAD COMPLETE");
                console.log("STARTING UPLOAD");
                console.log(result);
                const { programs, queries, screener } = result;
                const { programMappings, queryMappings, screenerMappings } = result;
                console.log("here");
                fs.writeFileSync(path.resolve(__dirname, "result.json"), JSON.stringify(result));

                return new Seeder({ queryMappings, programs, queries, screener}, {programMappings, queryMappings, screenerMappings}).execute()
            })
            .catch(error => this.genError("ERROR SEEDING", error))
    }

    private genError(msg, error) {
        console.error("\x1b[31m", msg);
        console.error(error);
        throw new Error(msg)
    }
}