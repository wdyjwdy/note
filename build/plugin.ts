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
			default:
				return defaultFence(tokens, idx, options, env, self)
		}
	}
}

function example(code: string) {
	const tmp = code.replace(
		/([^#]+)(#)(.+)/g,
		`<span class="text">$1</span><span class="comment">$3</span>`,
	)
	return `<pre><code class="language-example">${tmp}</code></pre>`
}

function color(code: string) {
	const tmp = code
		.replace(/@\[([-\w]+)\]\{([^}]*)\}/g, `<span class="$1">$2</span>`)
		.replace(/(#.*)/g, `<span class="gray">$1</span>`)
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
