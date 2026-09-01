import fs from 'node:fs'

export function validateSpecs() {
	const specDirs = fs.readdirSync('./specs')
	console.info(specDirs)
}
