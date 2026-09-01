import { expect, it } from 'vitest'
import { getVersion } from './version'

it('reads the version from the package manifest', () => {
	expect(getVersion()).toMatch(/^\d+\.\d+\.\d+/)
})
