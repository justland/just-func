import fs from 'fs'

export function validateSpecs() {
  const specDirs = fs.readdirSync('./specs')
  console.info(specDirs)
}
