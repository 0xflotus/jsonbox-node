import fetch, { Response, BodyInit } from 'node-fetch';

interface JsonBoxConfig {
    sort?: string
    skip?: string | number
    limit?: string | number
    query?: string
}

export class JsonBox {
    private static RECORD_ID_KEY: string = '_id';
    private jsonboxhost: string;

    constructor(jsonboxhost: string = 'https://jsonbox.io') {
        this.jsonboxhost = jsonboxhost;
    }

    private getUrl(boxId: string, collection?: string, config?: JsonBoxConfig): string {
        let url = `${this.jsonboxhost}/${boxId}`;
        const { sort, skip, limit, query } = config;

        if (collection) {
            url = `${url}/${collection}`;
        }

        const parameters = {
            ...(sort && { sort }),
            ...(skip && { skip }),
            ...(limit && { limit }),
            ...(query && { q: query })
        };

        if (Object.keys(parameters).length >= 1) {
            const queryParams = Object.entries(parameters).map(([key, value]) => `${key}=${value}`);
            url = `${url}?${queryParams.join('&')}`;
        }

        return url;
    }

    private processResponse(response: Response) {
        return response.json();
    }

    public getRecordId(data: { [key: string]: string }[] | { [key: string]: string }): string | string[] {
        return Array.isArray(data) ? data.map(record => record[JsonBox.RECORD_ID_KEY]) : data[JsonBox.RECORD_ID_KEY];
    }

    public async read<T = unknown>(boxId: string, collection?: string, config?: JsonBoxConfig): Promise<T> {
        return fetch(this.getUrl(boxId, collection, config), { method: 'GET' }).then(this.processResponse);
    }

    public async create<T = unknown>(body: Partial<T>, boxId: string, collection?: string): Promise<T> {
        return fetch(this.getUrl(boxId, collection), { method: 'POST', body: JSON.stringify(body) }).then(this.processResponse);
    }

    public async update<T = unknown>(body: Partial<T>, boxId: string, recordId: string): Promise<T> {
        return fetch(this.getUrl(boxId, recordId), { method: 'PUT', body: JSON.stringify(body) }).then(this.processResponse);
    }

    public async delete(boxId: string, recordId: string) {
        await fetch(this.getUrl(boxId, recordId), { method: 'DELETE' }).then(this.processResponse);
    }

    public async deleteMany(boxId: string, recordIds: string[]) {
        await Promise.all(recordIds.map(id => this.delete(boxId, id)));
    }
} 