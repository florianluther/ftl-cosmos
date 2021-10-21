import { ConsoleLogger } from '@florianluther/ftl-logger'
import { AppSettings } from './configuration'
import { create, getNames } from './cosmos-db/stored-procedures'

export async function run(): Promise<void> {
    const settings = AppSettings.instance
    const logger = new ConsoleLogger()

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

    const result = await create(
        settings.database,
        settings.container,
        'test-stored-procedure',
        `function testStoredProcedure() { console.log('test stored procedure') }`
    )
    logger.log(`Result: ${result}`)
}

run()
