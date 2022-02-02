[![npm version](https://badge.fury.io/js/jsonbox-node.svg)](https://badge.fury.io/js/jsonbox-node)

# !WARNING

There was some issues with the cloud instance of https://jsonbox.io/. So this repository will be archived. 

You can find the source code of jsonbox.io [here](https://github.com/vasanthv/jsonbox).

# JsonBox for Node

A Node Wrapper for https://jsonbox.io/ 

## Install

`npm install --save jsonbox-node` or `yarn add jsonbox-node`

## Usage

```javascript
const { JsonBox } = require('jsonbox-node');

async function() {
    // this will use jsonbox.io as backend,  
    // you can put your custom jsonbox instance link here 
    // or you can pass a customized AxiosRequestConfig as second parameter
    const jbn = new JsonBox(); 

    // Create a record
    await jbn.create({
        name: "Test",
        age: 42
    }, BOX_ID);

    // Create a record in a collection
    await jbn.create({
        name: "Foobar",
        level: 1337
    }, BOX_ID, "workers");

    // Read records
    await jbn.read(BOX_ID);

    // read records in collection with filters
    await jbn.read(BOX_ID, "users", { sort: "age", query: "age:>23", limit: 1, skip: 2 })

    // Update a record
    await jbn.update({ age: 43 }, BOX_ID, recordId);

    // Delete a record
    await jbn.delete(BOX_ID, recordId)

    // Delete a record set
    await jbn.deleteMany(BOX_ID, recordIds);
}
```


## Stargazers over time

[![Stargazers over time](https://starchart.cc/0xflotus/jsonbox-node.svg)](https://starchart.cc/0xflotus/jsonbox-node)
