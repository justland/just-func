import { command, UI } from 'clibuilder'
import Ajv from 'ajv'
import fs from 'fs'
import path from 'path'
import { loadSchema } from '../loadSchema'
import { jsonc } from 'jsonc'

export const validateSpecsCommand = command({
  name: 'validate-specs',
  run() {
    const specDirs = fs.readdirSync('./schema-specs')
    specDirs
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
    const schemaDirs = dirs.filter(p => path.basename(p) !== 'specs')
    schemaDirs.forEach(s => validateModuleSpecsPerSchema({ ui }, s, path.join(specDir, 'specs')))
  }
  else {
    ui.info(`No specs under ${specDir}, skipping...`)
  }
}

function validateModuleSpecsPerSchema({ ui }: { ui: UI }, schemaDir: string, specsDir: string) {
  const specPath = path.join(schemaDir, 'spec.jsonc')
  const validate = createValidate({ ui }, specPath, './schema/draft-07/schema.jsonc')
  const specFiles = fs.readdirSync(specsDir)
    .map(f => path.join(specsDir, f))
    .filter(f => fs.statSync(f).isFile() && path.extname(f) === '.jsonc')

  specFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8')
    const specs = jsonc.parse(content) as Array<any>
    const specName = path.basename(f, '.jsonc')
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
