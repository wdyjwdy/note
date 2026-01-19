import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import markdownit from 'markdown-it'
import markdownitAnchor from 'markdown-it-anchor'
import markdownitTOC from 'markdown-it-table-of-contents'
import markdownitPlugin from './plugin'

const mdit = markdownit()
	.use(markdownitAnchor)
	.use(markdownitTOC, { includeLevel: [2, 3] })
	.use(markdownitPlugin)
const template = await Bun.file('build/template.html').text()

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
		.filter((path) => path.isFile() && !path.name.endsWith('index.html'))
		.map((path) => join(path.parentPath, path.name))
}

function addPrefix(html: string) {
	html = html.replace(/(?<=img src=")(.+?)(?=")/g, '/static/imgs/$1.svg')
	if (process.env.env === 'prod') {
		html = html.replace(/\/static\//g, '/note/static/')
	}
	return html
}

function addTemplate(html: string, data: object) {
	data['content'] = html
	return template.replace(/{{(.*?)}}/g, (_, v) => data[v] ?? '')
}

async function buildIndexFile(pages: object[]) {
	let html = await Bun.file('content/index.html').text()
	html = addPrefix(html)
	html = html.replace("'@pages'", JSON.stringify(pages))
	await Bun.write('.site/index.html', html)
}

async function buildContentFile(path: string) {
	let { frontmatter, markdown } = await parseContentFile(path)
	if (frontmatter.toc) markdown = '[[toc]]\n' + markdown
	let html = mdit.render(markdown)
	html = addTemplate(html, frontmatter)
	html = addPrefix(html)
	const outputPath = path.replace('content/', '.site/').replace('.md', '.html')
	await Bun.write(outputPath, html)
}

async function buildStaticFile(path: string) {
	const file = Bun.file(path)
	const outputPath = join('.site', path)
	await Bun.write(outputPath, file)
}

async function buildSearchFile(paths: string[]) {
	const pages: object[] = []
	for (let path of paths) {
		const { frontmatter } = await parseContentFile(path)
		path = path.slice(8, -3)
		pages.push({ path, ...frontmatter })
	}
	return pages
}

async function build() {
	const contentPaths = await getFileNames('content')
	await Promise.all(contentPaths.map((path) => buildContentFile(path)))

	const staticPaths = await getFileNames('static')
	await Promise.all(staticPaths.map((path) => buildStaticFile(path)))

	const pages = await buildSearchFile(contentPaths)
	await buildIndexFile(pages)
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
