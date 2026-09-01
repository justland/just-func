import fs from 'node:fs'
import path from 'node:path'
import { jsonc } from 'jsonc'

export function loadSchema(filepath: string) {
	const content = fs.readFileSync(filepath, 'utf8')
	const schema = jsonc.parse(content)
	if (!schema['$id']) schema['$id'] = path.basename(filepath)
	return schema
}
