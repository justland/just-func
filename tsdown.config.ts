import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['ts/bin.ts', 'ts/index.ts'],
	outDir: 'esm',
	format: 'esm',
	platform: 'node',
	dts: true,
	clean: true,
	outExtensions: () => ({ js: '.js', dts: '.d.ts' })
})
