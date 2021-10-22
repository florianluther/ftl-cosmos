import { ConsoleLogger, ILogger } from '@florianluther/ftl-logger'
import { AppSettings, IConfiguration } from './configuration'
import { create, getNames, remove as del } from './cosmos-db/stored-procedures'

const StoredProcedureId = 'my-test-stored-procedure'

export async function run(): Promise<void> {
    const settings = AppSettings.instance
    const logger = new ConsoleLogger()

    logger.log('##### READ #####', 'green')
    await read(settings, logger)

    logger.log('##### WRITE #####', 'orange')
    await write(settings, logger)

    logger.log('##### DELETE #####', 'red')
    await remove(settings, logger)
}

async function read(settings: IConfiguration, logger: ILogger): Promise<void> {
    logger.log(
        `Loading all stored procedures of the database '${settings.database}' and the container '${settings.container}'...`
    )

    const names = await getNames(settings.database, settings.container)

    if (!names.length) {
        logger.error(
            new Error(`There were no stored procedures found for '${settings.database}' and '${settings.container}'.`)
        )
    } else {
        logger.log(names)
    }
}

async function write(settings: IConfiguration, logger: ILogger): Promise<void> {
    const body = `function myTestStoredProcedure() { console.log('${StoredProcedureId}') }`
    logger.log(`Creating or updating stored procedure '${StoredProcedureId}'...`)

    const result = await create(settings.database, settings.container, StoredProcedureId, body)
    logger.log(`Status code result: ${result}`)
}

async function remove(settings: IConfiguration, logger: ConsoleLogger) {
    logger.log(`Deleting the stored procedure '${StoredProcedureId}'...`)
    const result = await del(settings.database, settings.container, StoredProcedureId)
    logger.log(`Status code result: ${result}`)
}

run()
