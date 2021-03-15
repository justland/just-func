import Ajv from 'ajv'
import { command, UI } from 'clibuilder'
import fs from 'fs'
import { jsonc } from 'jsonc'
import path from 'path'
import { loadSchema } from '../loadSchema'

export const validateSpecsCommand = command({
  name: 'validate-specs',
  description: 'validate if specs are written according to the spec format',
  run() {
    fs.readdirSync('./schema-specs')
      .map(d => path.join('schema-specs', d))
      .filter(d => fs.statSync(d).isDirectory())
      .forEach(d => validateModuleSpecs(this, d))
  }
})

function validateModuleSpecs({ ui }: { ui: UI }, specDir: string) {
  const dirs = fs.readdirSync(specDir)
    .map(p => path.join(specDir, p))
    .filter(p => fs.statSync(p).isDirectory())
  if (dirs.some(p => path.basename(p) === 'specs')) {
    const specsDir = path.join(specDir, 'specs')
    dirs
      .filter(p => path.basename(p) !== 'specs')
      .forEach(s => validateModuleSpecsPerSchema({ ui }, s, specsDir))
  }
  else {
    ui.info(`No specs under ${specDir}, skipping...`)
  }
}

function validateModuleSpecsPerSchema({ ui }: { ui: UI }, schemaDir: string, specsDir: string) {
  const specPath = path.join(schemaDir, 'spec.jsonc')
  const validate = createValidate({ ui },
    specPath,
    './schema/draft-07/schema.jsonc',
    './schema/draft-07/error-schema.jsonc'
  )
  fs.readdirSync(specsDir)
    .filter(e => path.extname(e) === '.jsonc')
    .map(e => path.join(specsDir, e))
    .filter(e => fs.statSync(e).isFile())
    .forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      const specName = path.basename(file, '.jsonc')
      const specs = jsonc.parse(content) as Array<any>
      specs.forEach(spec => {
        const description = spec.description || 'missing description'
        if (validate(spec)) {
          ui.info(`'${specName}: ${description}' passed`)
        }
        else {
          ui.error(`${specName}: ${description} failed. First few errors`)
          ui.error(JSON.stringify(validate.errors![0], null, 2))
        }
      })
    })
}

function createValidate({ ui }: { ui: UI }, schemaPath: string, ...dependSchemaPaths: string[]) {
  ui.debug(`loading schema ${schemaPath}`)
  const ajv = new Ajv({ allowUnionTypes: true, strictTuples: false })
  const schema = loadSchema(schemaPath)
  if (dependSchemaPaths.length > 0) {
    const depSchemas = dependSchemaPaths.map(loadSchema)
    return ajv.addSchema(depSchemas).compile(schema)
  }
  return ajv.compile(schema)
}
