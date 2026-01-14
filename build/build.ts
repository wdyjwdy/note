import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import handlebars from 'handlebars'
import markdownit from 'markdown-it'
import markdownitAnchor from 'markdown-it-anchor'
import markdownitTOC from 'markdown-it-table-of-contents'
import markdownitPlugin from './plugin'

const mdit = markdownit()
	.use(markdownitAnchor)
	.use(markdownitTOC, { includeLevel: [2, 3] })
	.use(markdownitPlugin)
const template = await Bun.file('build/template.html').text()
const hdbs = handlebars.compile(template)

async function parseContentFile(path: string) {
	const text = await Bun.file(path).text()
	const match = text.match(/^---(.*?)---/s)
	const folder = path.split('/')[1]

	const frontmatter = {
		...(Bun.YAML.parse(match![1]) as any),
		folder,
	}
	const markdown = text.slice(match![0].length)
	return { frontmatter, markdown }
}

async function getFileNames(path: string) {
	const paths = await readdir(path, {
		recursive: true,
		withFileTypes: true,
	})
	return paths
		.filter((path) => path.isFile())
		.map((path) => join(path.parentPath, path.name))
}

async function buildContentFile(path: string) {
	if (path.endsWith('.html')) {
		await Bun.write('.site/index.html', Bun.file(path))
		return
	}

	// build
	let { frontmatter, markdown } = await parseContentFile(path)
	if (frontmatter.toc) markdown = '[[toc]]\n' + markdown
	let html = mdit.render(markdown)
	html = hdbs({ content: html, ...frontmatter })

	// write
	const outputPath = path.replace('content/', '.site/').replace('.md', '.html')
	await Bun.write(outputPath, html)
}

async function buildStaticFile(path: string) {
	const file = Bun.file(path)
	const outputPath = join('.site', path)
	await Bun.write(outputPath, file)
}

async function build() {
	const contentPaths = await getFileNames('content')
	await Promise.all(contentPaths.map((path) => buildContentFile(path)))

	const staticPaths = await getFileNames('static')
	await Promise.all(staticPaths.map((path) => buildStaticFile(path)))
}

async function buildWithTiming() {
	const start = Bun.nanoseconds()
	await build()
	const end = Bun.nanoseconds()
	const time = ((end - start) / 1_000_000).toFixed()
	console.log(`\x1b[32m[note]\x1b[0m build in \x1b[32m${time}ms\x1b[0m`)
}

buildWithTiming()

export { buildContentFile, buildStaticFile }
