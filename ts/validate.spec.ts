import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import { validateSpecs } from './validate'

const cwd = process.cwd()

afterEach(() => {
	process.chdir(cwd)
	vi.restoreAllMocks()
})

it('lists the spec files in the current working directory', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'just-func-'))
	fs.mkdirSync(path.join(dir, 'specs'))
	fs.writeFileSync(path.join(dir, 'specs', 'if.jsonc'), '[]', 'utf8')
	process.chdir(dir)
	const info = vi.spyOn(console, 'info').mockImplementation(() => {})

	validateSpecs()

	expect(info).toHaveBeenCalledWith(['if.jsonc'])
})
