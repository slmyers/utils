# utils
Contains utilities for the database and data-transfer.

The `run.ts` files in the sub-folders depend on a `config.json`
existing in the root directory.

Use `config.sample.json` as a reference.

#exports

* `Stream`
* `Schema`
* `YcbDownloader`
* `Seeder`

`elastic-search.d.ts` is a file copied from th `api-server`.


The sub-folders have `README` files.

# notes

I only use these utils via `terminal`. With some tests I think they
could be used more programmatically and integrated with the `api-server`.