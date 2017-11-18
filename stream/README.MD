`Stream` from './index.ts' Will download data using `YcbDownloader` from a remote host and
then will `seed` the localhost:9200 elasticsearch using `Seeder`

`ts-node run.ts` will using the `../config.json` file to download the
data from `target` property and seed `localhost:9200`.