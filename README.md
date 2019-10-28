[![npm version](https://badge.fury.io/js/jsonbox-node.svg)](https://badge.fury.io/js/jsonbox-node)

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
    
    // Read with overridden AxiosConfig and no config
    await jbn.read(BOX_ID, "users", undefined, { maxContentLength: 2000 });
}
```
