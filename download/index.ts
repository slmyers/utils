import Schema from "../schema"

export default class YcbDownloader {
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
            }),
            this.client.search({
                index: Schema.queries.index,
                type: Schema.queries.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }),
            this.client.search( {
                index: Schema.master_screener.index,
                type: Schema.master_screener.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            })
        ];

        const [programs, queries, master_screener] = await Promise.all(requests);

        return {
            programs: this.filterSource(programs),
            queries:  this.filterSource(queries),
            screener: this.getRecentScreener(this.filterSource(master_screener))
        };
    }

    private filterSource(result: Elasticsearch.SearchResponse<any>): any[] {
        return result.hits.hits.map(h => h._source);
    }

    private getRecentScreener(results: any[]): any {
        const max = Math.max.apply(Math, results.map(o => o.created));
        return results.find(r => r.created  === max) || {}
    }
}