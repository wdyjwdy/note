import katex from 'katex'

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
			case 'pre':
				return pre(content)
			case 'math':
				return math(content)
			default:
				return defaultFence(tokens, idx, options, env, self)
		}
	}

	md.inline.ruler.after('escape', 'inline_math', (state, silent) => {
		const src = state.src
		const pos = state.pos

		if (src[pos] !== '$') return false

		let start = pos + 1
		let end = start
		while (end < src.length && src[end] !== '$') end++
		if (end >= src.length) return false

		if (!silent) {
			const token = state.push('inline_math', '', 0)
			token.content = src.slice(start, end)
		}

		state.pos = end + 1
		return true
	})

	md.renderer.rules.inline_math = (tokens, idx) => {
		return katex.renderToString(tokens[idx].content, {
			output: 'mathml',
			displayMode: false,
		})
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
	const tmp = code.replace(
		/@\[(\w+)\]\{([^}]*)\}/g,
		`<span style="color: $1">$2</span>`,
	)
	return `<pre><code class="language-color">${tmp}</code></pre>`
}
function pre(rawCode: string) {
	return `
		<div class="html-preview">
			<template shadowrootmode="open">${rawCode}</template>
		</div>
	`
}

function math(code: string) {
	return katex.renderToString(code, { output: 'mathml' })
}
