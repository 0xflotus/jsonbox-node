import axios, { AxiosRequestConfig } from 'axios';

interface JsonBoxConfig {
    sort?: string;
    skip?: number;
    limit?: number;
    query?: string;
}

export class JsonBox {
    private static RECORD_ID_KEY: string = "_id";

    constructor(private readonly jsonboxhost: string = "https://jsonbox.io",
        private readonly axiosConfig?: AxiosRequestConfig) { }

    private getUrl(boxId: string, collection?: string, config: JsonBoxConfig = {
        sort: '-_createdOn', skip: 0, limit: 20
    }): string {
        let url = `${this.jsonboxhost}/${boxId}`;
        const { sort, skip, limit, query } = config;

        if (collection) {
            url = `${url}/${collection}`;
        }

        let parameters = new Map<string, string | number>();
        if (sort) {
            parameters.set("sort", sort);
        }
        if (skip) {
            parameters.set("skip", skip);
        }
        if (limit) {
            parameters.set("limit", limit);
        }
        if (query) {
            parameters.set("q", query);
        }

        if (parameters.size > 0) {
            url = `${url}?${[...parameters.keys()].map(key => `${key}=${parameters.get(key)}`).join('&')}`;
        }

        return url;
    }

    public getRecordId(data: any): string | string[] {
        return Array.isArray(data) ? data.map(record => record[JsonBox.RECORD_ID_KEY]) : data[JsonBox.RECORD_ID_KEY];
    }

    public async read(boxId: string, collection?: string, config?: JsonBoxConfig) {
        const response = await axios.get(this.getUrl(boxId, collection, config), this.axiosConfig);
        return response.status === 200 ? response.data : false;
    }

    public async create(data: any, boxId: string, collection?: string) {
        const response = await axios.post(this.getUrl(boxId, collection), data, this.axiosConfig);
        return response.status === 200 ? response.data : false;
    }

    public async update(data: any, boxId: string, recordId: string) {
        const response = await axios.put(this.getUrl(boxId, recordId), data, this.axiosConfig);
        return response.status === 200 ? response.data : false;
    }

    public async delete(boxId: string, recordId: string) {
        const response = await axios.delete(this.getUrl(boxId, recordId), this.axiosConfig);
        return response.status === 200 ? response.data : false;
    }

    public async deleteMany(boxId: string, recordIds: string[]) {
        return recordIds.map(id => this.delete(boxId, id));
    }
} 
