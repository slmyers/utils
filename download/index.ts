import { Schema } from "../schema"

export class YcbDownloader {
    // dataset is small no pagination when retrieving data
    private readonly PAGE_SIZE = 10000;

    constructor(private client: Elasticsearch.Client) {}

    async execute(): Promise<Object> {
        const requests = [
            this.client.search({
                index: Schema.programs.index,
                type: Schema.programs.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }).catch(err => this.exitOnError('ERROR: downloading programs', err)),

            this.client.indices.getMapping({
                index: Schema.programs.index,
                type: Schema.programs.type
            }).catch(err => this.exitOnError('ERROR: mapping programs index', err)),


            this.client.search({
                index: Schema.queries.index,
                type: Schema.queries.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }).catch(err => this.exitOnError('ERROR: downloading queries', err)),

            this.client.indices.getMapping({
                index: Schema.queries.index,
                type: Schema.queries.type
            }).catch(err => this.exitOnError('ERROR: mapping programs index', err)),

            this.client.search( {
                index: Schema.master_screener.index,
                type: Schema.master_screener.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }).catch(err => this.exitOnError('ERROR: downloading screeners', err)),

            this.client.indices.getMapping({
                index: Schema.master_screener.index,
                type: Schema.master_screener.type
            }).catch(err => this.exitOnError('ERROR: mapping programs index', err)),
        ];

        const [
            programs,
            programMappings,
            queries,
            queryMappings,
            master_screener,
            screenerMappings
        ] = await Promise.all(requests);

        return {
            programs: this.filterSource(programs),
            queries:  this.filterSource(queries),
            screener: this.getRecentScreener(this.filterSource(master_screener)),
            programMappings,
            queryMappings,
            screenerMappings
        };
    }

    private filterSource(result: Elasticsearch.SearchResponse<any> | any /*process should exit on error...*/): any[] {
        return result.hits.hits.map(h => h._source);
    }

    private getRecentScreener(results: any[]): any {
        const max = Math.max.apply(Math, results.map(o => o.created));
        return results.find(r => r.created  === max) || {}
    }

    private exitOnError(msg: string, err: Error): Error {
        console.log("\x1b[31m", msg);
        console.log(err);
        process.exit(202);
        return err;
    }
}