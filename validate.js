const fs = require('fs')
const path = require('path')
const jsonc = require('jsonc')
const Ajv = require('ajv/dist/2019').default

function loadSchema(filepath) {
  const content = fs.readFileSync(filepath, 'utf8')

  // adjust relative paths
  const adjusted = content.split('\n').map(l => {
    const match = l.match(/"\$ref": "([.a-z].+)[#"]/)
    if (!match) return l
    const relative = match[1]
    const adjustedPath = path.basename(relative)
    return l.replace(relative, adjustedPath)
  }).join('\n')
  const schema = jsonc.parse(adjusted)
  // delete meta schema in `$schema` or else `ajv` will fail
  delete schema['$schema']
  if (!schema['$id']) schema['$id'] = path.basename(filepath)
  return schema
}

function createValidate(schemaPath, ...dependSchemaPaths) {
  const ajv = new Ajv({ allowUnionTypes: true, strictTuples: false })
  const schema = loadSchema(schemaPath)
  const depSchemas = dependSchemaPaths.map(loadSchema)
  return ajv.addSchema(depSchemas).compile(schema)
}

// const validate = createValidate(
//   './spec/draft-2019-09/schema/my-app-spec.jsonc',
//   './json-schema/draft-2019-09/just-func.jsonc',
//   './spec/draft-2019-09/schema/my-just-func.jsonc'
// )

const validate = createValidate(
  './spec/draft-2020-12/schema/my-app-spec.jsonc',
  './json-schema/draft-2020-12/just-func.jsonc',
  './spec/draft-2020-12/schema/my-just-func.jsonc'
)

console.info('validate result:', validate({
  "test": ["eq", "welcome to just-func, ", ["param/get", "name"]]
}))
