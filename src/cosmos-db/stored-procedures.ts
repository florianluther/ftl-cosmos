import { Container, CosmosClient, StoredProcedureDefinition, StoredProcedureResponse } from '@azure/cosmos'
import { AppSettings } from '../configuration'

export async function getNames(databaseName: string, containerName: string): Promise<string[]> {
    const container = getCosmosDbContainer(databaseName, containerName)
    return await fetchNames(container)
}

export async function create(databaseName: string, containerName: string, id: string, body: string): Promise<number> {
    const container = getCosmosDbContainer(databaseName, containerName)
    const definition: StoredProcedureDefinition = {
        id,
        body,
    }

    const isExisting = await exists(container, id)

    let result: StoredProcedureResponse
    if (!isExisting) {
        // 201 Created
        result = await container.scripts.storedProcedures.create(definition)
    } else {
        // 200 OK
        result = await container.scripts.storedProcedure(id).replace(definition)
    }

    return result.statusCode
}

export async function remove(databaseName: string, containerName: string, id: string): Promise<number> {
    const container = getCosmosDbContainer(databaseName, containerName)

    const isExisting = await exists(container, id)
    if (!isExisting) {
        return 404
    }

    // 204 No Content
    const result = await container.scripts.storedProcedure(id).delete()

    return result.statusCode
}

async function fetchNames(container: Container): Promise<string[]> {
    const result = await container.scripts.storedProcedures.readAll().fetchAll()
    return result.resources.map((sp) => sp.id)
}

async function exists(container: Container, id: string): Promise<boolean> {
    const names = await fetchNames(container)
    return names.includes(id)
}

function getCosmosDbContainer(databaseName: string, containerName: string): Container {
    const settings = AppSettings.instance
    const client: CosmosClient = new CosmosClient(settings.cosmosDbConnectionString)

    const database = client.database(databaseName)
    const container = database.container(containerName)

    return container
}
