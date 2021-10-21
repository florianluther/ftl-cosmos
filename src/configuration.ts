import { config } from 'dotenv'

export interface IConfiguration {
    cosmosDbConnectionString: string
}

export class AppSettings {
    private static _instance: IConfiguration

    static get instance(): IConfiguration {
        if (!!this._instance) {
            return this._instance
        }

        this._instance = this.getAppSettings()

        return this._instance
    }

    private constructor() {}

    private static getAppSettings(): IConfiguration {
        config()
        const cosmosDbConnectionString = process.env['CosmosDbConnectionString']

        if (!cosmosDbConnectionString) {
            throw new Error(`The connection string must not be empty.`)
        }

        return {
            cosmosDbConnectionString,
        }
    }
}
