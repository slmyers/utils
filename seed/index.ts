import { Schema } from "../schema"
import { Uploader } from "../upload"
import { Client } from "elasticsearch"
import * as I from "../interfaces"
import * as fs from "fs"
import * as path from "path"


export class Seeder {
    private uploader: Uploader;
    private client: Elasticsearch.Client;

    constructor(
        private data: I.Data,
        private mappings: I.Mapping,
        private overwrite: boolean = true
    ) {
        this.client = new Client({host: "http://localhost:9200", log: 'trace'});
        this.uploader = new Uploader(this.client, overwrite, data);
        console.log("NEW UPLOAD CLIENT")
    }

    async execute() {
        console.log(this.mappings.programMappings);
        fs.writeFileSync(path.resolve(__dirname, "mappings.json"), JSON.stringify(this.mappings));
        fs.writeFileSync(path.resolve(__dirname, "data.json"), JSON.stringify(this.data));
        console.log("*");


        await Promise.all([
            await this.createIndex(
                Schema.queries.index,
                Schema.queries.type,
                this.mappings.queryMappings[Schema.queries.index]['mappings'][Schema.queries.type]['properties']
            ),
            await this.createIndex(
                Schema.programs.index,
                Schema.programs.type,
                this.mappings.programMappings[Schema.programs.index]['mappings'][Schema.programs.type]['properties']
            ),
            await this.createIndex(
                Schema.master_screener.index,
                Schema.master_screener.type,
                this.mappings.screenerMappings[Schema.master_screener.index]['mappings'][Schema.master_screener.type]['properties']
            ),

        ]).catch(e => {
            console.error(e);
            console.log("HERHEHRE");
            process.exit(1);
        });

        console.log("*");

        return await this.uploader.execute();
    }

    async createIndex(index: string, type: string,  properties: {[key: string]: any}): Promise<any> {
        const indexExists = await this.client.indices.exists({ index });


        if (indexExists && this.overwrite) {
            await this.client.indices.delete({ index })
        } else if (indexExists && !this.overwrite) {
            return false
        }

        return this.client.indices.create({
            index,
        })
            .catch(err => {
                console.log("bebrebrbe")
                console.log("\x1b[31m", err);
                process.exit(69);
                return Error(err)
            })
            .then( () => this.client.indices.putMapping({
                index,
                type,
                body: {
                    properties
                }
            }))
    }
}