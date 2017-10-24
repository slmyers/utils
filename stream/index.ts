import Downloader from "../download"
import { Client } from "elasticsearch"
import Seeder from "../seed"

export default class Stream {

    constructor(
        private downloader: Downloader,
        private target: string
    ) {
        if (target.includes("youcanbenefit")) {
            throw new Error("SEEDING LIVE ENDPOINT");
        }

    }

    execute() {
        return this.downloader.execute()
            .catch(_ => this.genError("ERROR DOWNLOADING"))
            .then((result: {[key: string]: Object}) => {
                console.log("DOWNLOAD COMPLETE");
                console.log("STARTING UPLOAD");

                const client = new Client({host: this.target, log: 'trace'});
                const { programs, queries, screener } = result;
                const { programMappings, queryMappings, screenerMappings } = result;
                return new Seeder(client, { programs, queries, screener}, {programMappings,queryMappings, screenerMappings}).execute()
            })
            .catch(_ => this.genError("ERROR SEEDING"))
    }

    private genError(msg) {
        console.error("\x1b[31m", msg);
        throw new Error(msg)
    }
}