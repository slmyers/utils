import Schema from "../schema"
import Uploader from "../upload"

export default class Seeder {
    private uploader: Uploader;

    constructor(
        private client: Elasticsearch.Client,
        private data: {[key: string]: Object},
        private mappings: {[key: string]: Object},
        private overwrite: boolean = true
    ) {
        this.uploader = new Uploader(client, overwrite, data)
    }

    async execute() {
        const results = [
            await this.createIndex(Schema.programs.index, this.mappings.programMapping),
            await this.createIndex(Schema.master_screener.index, this.mappings.screenerMapping),
            await this.createIndex(Schema.queries.index, this.mappings.queryMapping)
        ];

        console.log(results);


        return await this.uploader.execute();
    }

    async createIndex(index: string, body?: {[key: string]: any}): Promise<any> {
        const indexExists = await this.client.indices.exists({ index });

        if (indexExists && this.overwrite) {
            await this.client.indices.delete({ index })
        } else if (indexExists && !this.overwrite) {
            return false
        }

        return this.client.indices.create({ index, body: body || null })
            .catch(err => {
                console.log("\x1b[31m", err);
                process.exit(69);
                return Error(err)
            })
    }
}