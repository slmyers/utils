import { YcbDownloader } from "../download"
import { Seeder } from "../seed"

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
                const { programs, queries, screener } = result;
                const { programMappings, queryMappings, screenerMappings } = result;
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