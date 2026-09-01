import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['ts/bin.ts', 'ts/index.ts'],
	outDir: 'cjs',
	format: 'cjs',
	platform: 'node',
	dts: true,
	clean: true,
	outExtensions: () => ({ js: '.js', dts: '.d.ts' })
})
