import fs from 'fs'
import { jsonc } from 'jsonc'
import path from 'path'

export function loadSchema(filepath: string) {
  const content = fs.readFileSync(filepath, 'utf8')
  const schema = jsonc.parse(content)
  if (!schema['$id']) schema['$id'] = path.basename(filepath)
  return schema
}
