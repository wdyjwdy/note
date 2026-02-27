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
const dateMap = new Map<string, string>()

async function parseContentFile(path: string) {
	const text = await Bun.file(path).text()
	const match = text.match(/^---(.*?)---/s)
	const folder = path.split('/')[1]
	const mtime = dateMap.get(path)

	const frontmatter = {
		...(Bun.YAML.parse(match![1]) as any),
		folder,
		mtime,
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

async function buildFileDates() {
	const data =
		await Bun.$`git log --name-only --format="%ad" --date=short`.text()
	const lines = data.split('\n').filter((x) => x)
	let lastdate = ''
	for (let line of lines) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
			lastdate = line
		} else {
			if (dateMap.has(line)) continue
			dateMap.set(line, lastdate)
		}
	}
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
	const pages: any[] = []
	for (let path of paths) {
		const { frontmatter } = await parseContentFile(path)
		path = path.slice(8, -3)
		pages.push({ path, ...frontmatter })
	}
	pages.sort((a, b) => (a.group < b.group ? -1 : 1))
	return pages
}

async function build() {
	await buildFileDates()

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
