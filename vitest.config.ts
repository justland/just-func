import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['ts/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			include: ['ts/**/*.ts'],
			// the CLI wiring and its commands are exercised end to end by
			// `pnpm validate:specs`, which runs the built binary against the
			// repo's own schema specs as part of `verify`.
			exclude: ['ts/**/*.spec.ts', 'ts/bin.ts', 'ts/cli.ts', 'ts/commands/**'],
			reporter: ['text', 'lcov'],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100
			}
		}
	}
})
