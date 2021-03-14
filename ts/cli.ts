import { cli } from 'clibuilder'

export default cli({ name: 'jf' }).command({
  name: 'test',
  arguments: [{
    name: 'schema',
    description: 'path to the schema'
  }, {
    name: 'target',
    description: 'target to validate against'
  }],
  run() {
    console.info('working on it...')
  }
})
