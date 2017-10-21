import Schema from "../schema"

export default class Uploader {

    constructor(
        private client: Elasticsearch.Client,
        private overwrite: boolean,
        private screener?: any,
        private programs?: any[],
        private queries?: any[]
    ) {}

    async execute() {
        let screenerRes, programRes, queryRes;
        const returnNull = _ => null;


        if (this.screener) {
            screenerRes = this.uploadScreener().catch(returnNull)
        }

        if (this.programs) {
            programRes = this.uploadPrograms().catch(returnNull)
        }

        if (this.queries) {
            queryRes = this.uploadQueries().catch(returnNull)
        }

        return {
            screenerRes,
            programRes,
            queryRes
        }
    }

    private uploadScreener(): Promise<any> {
        return this.client.index({
            index: Schema.master_screener.index,
            type: Schema.master_screener.type,
            body: this.screener
        })
    }

    private uploadPrograms(): Promise<any> {
        return Promise.all(this.uploadProgramsWithOverwrite())
    }

    private uploadProgramsWithOverwrite(): Promise<any>[] {
        return this.programs.map(program => this.client.index({
            index: Schema.programs.index,
            type: Schema.programs.type,
            id: program.guid,
            body: program
        }))
    }

    private uploadQueries(): Promise<any> {
        return Promise.all(this.uploadQueriesWithOverwrite())
    }

    private uploadQueriesWithOverwrite(): Promise<any>[] {
        return this.queries.map(query => this.client.index( {
            index: Schema.queries.index,
            type: Schema.queries.type,
            body: query
        }))
    }
}