import { config } from 'dotenv'

export interface IConfiguration {
    container: string
    cosmosDbConnectionString: string
    database: string
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
        const database = process.env['CosmosDbDatabase']
        const container = process.env['CosmosDbContainer']

        if (!cosmosDbConnectionString) {
            throw new Error(`The connection string must not be empty.`)
        }

        if (!database) {
            throw new Error(`The database name must not be empty.`)
        }

        if (!container) {
            throw new Error(`The container name must not be empty.`)
        }

        return {
            container,
            cosmosDbConnectionString,
            database,
        }
    }
}
