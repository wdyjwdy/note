//      0         1         2         X
//    0 +---------+---------+---------+
//      |         |         |         |
//      | [ ### ] |         | [ ### ] |
//      |         |         |         |
//    1 +---------+---------+---------+
//      |         |         |         |
//      |         |         |         |
//      |         |         |         |
//    2 +---------+---------+---------+
//      |         |         |         |
//      | [ ### ] |         | [ ### ] |baseY
//      |         |         |  actor  |
//    Y +---------+---------+---------+
//                             baseX

const config = {
	baseX: 300,
	baseY: 50,
	actorWidth: 100,
	actorHeight: 50,
	borderWidth: 1,
	notePadding: 10,
}

function parse(text: string) {
	const actors: string[] = []
	const signals: { type: string; text: string; x1: number; x2: number }[] = []

	const lines = text.split('\n').filter((x) => x)
	for (let line of lines) {
		if (line.startsWith('Note: ')) {
			signals.push({ type: 'note', text: line.slice(6), x1: 0, x2: 0 })
			continue
		}

		const [_, A1, A2, text] = line.match(/^(.+) -> (.+?): (.+)$/)!
		if (!actors.includes(A1)) actors.push(A1)
		if (!actors.includes(A2)) actors.push(A2)
		const x1 = actors.findIndex((v) => v === A1)
		const x2 = actors.findIndex((v) => v === A2)
		signals.push({ type: 'arrow', text, x1, x2 })
	}

	for (let singal of signals) {
		if (singal.type === 'note') singal.x2 = actors.length - 1
	}

	return { actors, signals }
}

function render(text: string) {
	const { actors, signals } = parse(text)
	const [X, Y] = [actors.length, signals.length + 2]
	const { actorWidth: aw, borderWidth: bw, baseX: bx, baseY: by } = config
	const viewBox = [-bw, -bw, (X - 1) * bx + 2 * bw + aw, Y * by + 2 * bw]

	const actorsSVG = actors
		.map((text, i) => renderActor(i, Y - 1, text))
		.join('')

	const singalsSVG = signals
		.map((signal, i) => {
			if (signal.type === 'note') {
				return renderNote(signal.x2, i + 1, signal.text)
			} else if (signal.type === 'arrow') {
				return renderArrow([signal.x1, i + 1, signal.x2, i + 1], signal.text)
			}
		})
		.join('')

	const defs = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>`

	const content = defs + actorsSVG + singalsSVG
	return `<svg viewBox="${viewBox.join(' ')}" style="max-width: ${viewBox[2]};">${content}</svg>`
}

function renderNoteText(X: number, Y: number, text: string) {
	const x = transformX(X) / 2 + config.actorWidth / 2
	const y = transformY(Y) + config.actorHeight / 2
	return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New" font-size="20">${text}</text>`
}

function renderNoteRect(X: number, Y: number) {
	const x = transformX(0)
	const y = transformY(Y) + config.notePadding
	const w = transformX(X) + config.actorWidth
	const h = transformY(1) - 2 * config.notePadding
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="yellow" stroke="black" />`
}
function renderNote(X: number, Y: number, text: string) {
	const content = renderNoteRect(X, Y) + renderNoteText(X, Y, text)
	return `<g class="note">${content}</g>`
}

function renderArrowLine(coords: number[]) {
	const [X1, Y1, X2, Y2] = coords
	const x1 = transformX(X1) + config.actorWidth / 2
	const y1 = transformY(Y1) + config.baseY / 2
	const x2 = transformX(X2) + config.actorWidth / 2
	const y2 = transformY(Y2) + config.baseY / 2
	return `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" stroke="black" marker-end="url(#arrow)"/>`
}

function renderArrowText(coords: number[], text: string) {
	const [X1, Y1, X2] = coords
	const x = (transformX(X1) + transformX(X2)) / 2 + config.actorWidth / 2
	const y = transformY(Y1) + config.actorHeight / 4
	return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New" font-size="20">${text}</text>`
}

function renderArrow(coords: number[], text: string) {
	const content = renderArrowLine(coords) + renderArrowText(coords, text)
	return `<g class="arrow">${content}</g>`
}

function renderActorLine(X: number, Y: number) {
	const x1 = transformX(X) + config.actorWidth / 2
	const y1 = transformY(1)
	const x2 = x1
	const y2 = transformY(Y)
	return `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" stroke="black"/>`
}

function renderActorText(X: number, Y: number, text: string) {
	const x = transformX(X) + config.actorWidth / 2
	const y = transformY(Y) + config.actorHeight / 2
	return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New" font-size="20">${text}</text>`
}

function renderActorRect(X: number, Y: number) {
	const x = transformX(X)
	const y = transformY(Y)
	const w = config.actorWidth
	const h = config.actorHeight
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="black" />`
}

function renderActor(X: number, Y: number, text: string) {
	const content =
		renderActorRect(X, 0) +
		renderActorText(X, 0, text) +
		renderActorLine(X, Y) +
		renderActorRect(X, Y) +
		renderActorText(X, Y, text)
	return `<g class="actor">${content}</g>`
}

function transformX(x: number) {
	return x * config.baseX
}

function transformY(y: number) {
	return y * config.baseY
}

function seqSVG(code: string): string {
	return render(code)
}

export { seqSVG }
