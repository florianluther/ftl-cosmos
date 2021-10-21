import { ConsoleLogger } from '@florianluther/ftl-logger'

export async function run(): Promise<void> {
    const logger = new ConsoleLogger()
    logger.log('OK', 'blue')
}

run()
