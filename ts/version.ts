import fs from 'node:fs'
import path from 'node:path'

/**
 * Reads the package version at runtime.
 *
 * The build emits to `esm/`, so the package manifest is always one level up
 * from the emitted file. Reading it keeps the CLI version from drifting away
 * from `package.json`.
 */
export function getVersion() {
	const manifest = path.join(import.meta.dirname, '..', 'package.json')
	return JSON.parse(fs.readFileSync(manifest, 'utf8')).version as string
}
