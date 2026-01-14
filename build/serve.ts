import { buildContentFile, buildStaticFile } from './build.ts'
import { join } from 'node:path'
import { watch } from 'fs'

watch('content', { recursive: true }, async (_, filename) => {
	if (!/(html|md)$/.test(filename!)) return
	await buildContentFile(join('content', filename!))
})

watch('static', { recursive: true }, async (_, filename) => {
	await buildStaticFile(join('static', filename!))
})
