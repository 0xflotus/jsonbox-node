import axios from 'axios';

export class JsonBox {
    private static RECORD_ID_KEY: string = "_id";
    private jsonboxhost: string;

    constructor(jsonboxhost: string = "https://jsonbox.io") {
        this.jsonboxhost = jsonboxhost;
    }

    private getUrl(boxId: string, collection?: string, sort?: string, skip?: string, limit?: string, query?: string): string {
        let url = `${this.jsonboxhost}/${boxId}`;

        if (collection) {
            url = `${url}/${collection}`;
        }

        let parameters = {};
        if (sort) {
            parameters["sort"] = sort;
        }
        if (skip) {
            parameters["skip"] = skip;
        }
        if (limit) {
            parameters["limit"] = limit;
        }
        if (query) {
            parameters["query"] = query;
        }

        if (Object.keys(parameters).length > 0) {
            url = `${url}?${Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&')}`;
        }

        return url;
    }

    public getRecordId(data: any): string | string[] {
        return Array.isArray(data) ? data.map(record => record[JsonBox.RECORD_ID_KEY]) : data[JsonBox.RECORD_ID_KEY];
    }

    public async read(boxId: string, collection?: string, sort?: string, skip?: string, limit?: string, query?: string) {
        const response = await axios.get(this.getUrl(boxId, collection, sort, skip, limit, query));
        return response.status === 200 ? response.data : false;
    }

    public async create(data: any, boxId: string, collection?: string) {
        const response = await axios.post(this.getUrl(boxId, collection), data);
        return response.status === 200 ? response.data : false;
    }

    public async update(data: any, boxId: string, recordId: string) {
        const response = await axios.put(this.getUrl(boxId, recordId), data);
        return response.status === 200 ? response.data : false;
    }

    public async delete(boxId: string, recordId: string) {
        const response = await axios.delete(this.getUrl(boxId, recordId));
        return response.status === 200 ? response.data : false;
    }

    public async deleteMany(boxId: string, recordIds: string[]) {
        return recordIds.map(id => this.delete(boxId, id));
    }
} 