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
            const urlEncodedParams = Object.keys(parameters).map(key => key + '=' + parameters[key]).join('&');
            url = `${url}?${urlEncodedParams}`;
        }

        return url;
    }

    public getRecordId(data: any): string | string[] {
        if (Array.isArray(data)) {
            const array = [];
            data.forEach(record => {
                array.push(record[JsonBox.RECORD_ID_KEY]);
            });
            return array;
        } else {
            return data[JsonBox.RECORD_ID_KEY];
        }
    }

    public async read(boxId: string, collection?: string, sort?: string, skip?: string, limit?: string, query?: string) {
        const url = this.getUrl(boxId, collection, sort, skip, limit, query);

        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        }
        else {
            return false;
        }
    }

    public async create(data: any, boxId: string, collection?: string) {
        const url = this.getUrl(boxId, collection);
        const response = await axios.post(url, data);
        if (response.status === 200) {
            return response.data;
        }
        else {
            return false;
        }
    }

    public async update(data: any, boxId: string, recordId: string) {
        const url = this.getUrl(boxId, recordId);
        const response = await axios.put(url, data);
        if (response.status === 200) {
            return response.data;
        }
        else {
            return false;
        }
    }

    public async delete(boxId: string, recordId: string) {
        const url = this.getUrl(boxId, recordId);
        const response = await axios.delete(url);
        if (response.status === 200) {
            return response.data;
        }
        else {
            return false;
        }
    }

    public async deleteMany(boxId: string, recordIds: string[]) {
        const array = [];
        recordIds.forEach(id => {
            array.push(this.delete(boxId, id));
        });
        return array;
    }
} 