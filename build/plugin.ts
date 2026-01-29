import { generateSequenceDiagramSvg } from './sequence-diagram'

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
			case 'seq':
				return seq(content)
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

function seq(rawCode: string) {
	const tmp = generateSequenceDiagramSvg(rawCode)
	return `<pre><code class="seq">${tmp}</code></pre>`
}
