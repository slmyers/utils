#download

`YcbDownloader` from `index.ts`

Takes a [Elasticsearch.Client](https://github.com/elastic/elasticsearch-js) as a dependency.

`YcbDownloader#execute: Promise<Object> `

Returns the documents in Program and Query Documents in Arrays.

Returns the latest Screener as an Object.

Returns the raw mappings from the indices documented in `../schema/index`


`ts-node run.ts`

set the `host` property in `../config.json` file to the desired endpoint.

will write a folder called data in this folder that contains serialized data
from the `host` endpoint.




