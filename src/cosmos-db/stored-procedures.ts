import { CosmosClient, StoredProcedureDefinition } from '@azure/cosmos'
import { AppSettings } from '../configuration'

export async function getNames(databaseName: string, containerName: string): Promise<string[]> {
    const settings = AppSettings.instance
    const client: CosmosClient = new CosmosClient(settings.cosmosDbConnectionString)

    const database = client.database(databaseName)
    const container = database.container(containerName)
    const result = await container.scripts.storedProcedures.readAll().fetchAll()

    return result.resources.map((sp) => sp.id)
}

export async function create(databaseName: string, containerName: string, id: string, body: string): Promise<number> {
    const settings = AppSettings.instance
    const client: CosmosClient = new CosmosClient(settings.cosmosDbConnectionString)

    const database = client.database(databaseName)
    const container = database.container(containerName)

    const definition: StoredProcedureDefinition = {
        id,
        body,
    }

    const result = await container.scripts.storedProcedures.create(definition)

    return result.statusCode
}
