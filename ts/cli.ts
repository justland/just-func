import { cli } from 'clibuilder'
import { validateSpecsCommand } from './commands'
import { getVersion } from './version'

export default cli({ name: 'jf', version: getVersion() })
	.command({
		name: 'test',
		description: 'validate a target against a schema',
		arguments: [
			{ name: 'schema', description: 'path to the schema' },
			{ name: 'target', description: 'target to validate against' }
		],
		run() {
			this.ui.info('working on it...')
		}
	})
	.command(validateSpecsCommand)
