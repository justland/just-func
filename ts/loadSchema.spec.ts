import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { loadSchema } from './loadSchema'

const created: string[] = []

function writeSchema(filename: string, content: string) {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'just-func-'))
	created.push(dir)
	const filepath = path.join(dir, filename)
	fs.writeFileSync(filepath, content, 'utf8')
	return filepath
}

afterEach(() => {
	for (const dir of created.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

it('parses a jsonc schema, comments and all', () => {
	const filepath = writeSchema('commented.jsonc', '{\n\t// the id\n\t"$id": "explicit"\n}')

	expect(loadSchema(filepath)).toEqual({ $id: 'explicit' })
})

it('falls back to the filename when the schema declares no $id', () => {
	const filepath = writeSchema('fallback.jsonc', '{ "type": "object" }')

	expect(loadSchema(filepath)).toEqual({ $id: 'fallback.jsonc', type: 'object' })
})

it('keeps an $id the schema already declares', () => {
	const filepath = writeSchema('ignored.jsonc', '{ "$id": "https://just-func.org/schema" }')

	expect(loadSchema(filepath).$id).toEqual('https://just-func.org/schema')
})
