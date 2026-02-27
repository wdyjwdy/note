import { seqSVG } from './seq'

export default function plugin(md: any) {
	const defaultFence = md.renderer.rules.fence

	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const { content, info } = tokens[idx]
		const escapeContent = md.utils.escapeHtml(content)

		switch (info) {
			case 'example':
				return example(escapeContent)
			case 'color':
				return color(escapeContent)
			case 'seq':
				return seq(content)
			case 'diff':
				return diff(escapeContent)
			case 'sql':
				return sql(escapeContent)
			case 'js':
				return js(escapeContent)
			default:
				return defaultFence(tokens, idx, options, env, self)
		}
	}

	// add table wrapper
	md.renderer.rules.table_open = () => {
		return '<div class="table-wrapper"><table>'
	}
	md.renderer.rules.table_close = () => {
		return '</table></div>'
	}
}

function example(code: string) {
	const tmp = code.replace(
		/([^#]+)(#)(.+)/g,
		`<span class="text">$1</span><span class="comment">$3</span>`,
	)
	return `<pre><code class="example">${tmp}</code></pre>`
}

function color(code: string) {
	const tmp = code
		.replace(/@\[([-\w]+)\]\{([^}]*)\}/g, `<span class="$1">$2</span>`)
		.replace(/(#.*)/g, `<span class="comment">$1</span>`)
	return `<pre><code class="color">${tmp}</code></pre>`
}

function seq(rawCode: string) {
	const tmp = seqSVG(rawCode)
	return `<pre><code class="seq">${tmp}</code></pre>`
}

function diff(code: string) {
	const tmp = code
		.replace(/(\+.*)/g, `<span class="add">$1</span>`)
		.replace(/(\-.*)/g, `<span class="del">$1</span>`)
	return `<pre><code class="diff">${tmp}</code></pre>`
}

function sql(code: string) {
	const tmp = code.replace(/(--.*)/g, `<span class="comment">$1</span>`)
	return `<pre><code class="sql">${tmp}</code></pre>`
}

function js(code: string) {
	const tmp = code.replace(/(\/\/.*)/g, `<span class="comment">$1</span>`)
	return `<pre><code class="js">${tmp}</code></pre>`
}
