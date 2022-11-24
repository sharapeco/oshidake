const qs = (query, p) => (p || document).querySelector(query);
const qsa = (query, p) => [].slice.call((p || document).querySelectorAll(query));

let stylesAdded = false
const addStyles = () => {
	if (stylesAdded) return
	stylesAdded = true

	const stylesheet = document.createElement('style')
	document.body.appendChild(stylesheet)
	const s = stylesheet.sheet
	s.insertRule('#contents.ytd-rich-grid-renderer { display: flex; }')
	s.insertRule('#contents.ytd-rich-grid-renderer ytd-rich-grid-row { display: contents; }')
	s.insertRule('#contents.ytd-rich-grid-renderer ytd-rich-grid-row > #contents.ytd-rich-grid-row { display: contents; }')
	s.insertRule('#contents.ytd-rich-grid-renderer ytd-rich-item-renderer { display: none; }')
	s.insertRule('#contents.ytd-rich-grid-renderer ytd-rich-item-renderer.subscribed { display: block; }')
}

let container = null
let observer = null
const main = () => {
	const channelName = (el) => el.getAttribute('title')

	// すべての登録チャンネルを表示
	const expander = qsa('#expander-item')[1]
	if (expander) {
		expander.click()
	}

	// 登録チャンネル名のリスト
	const subscriptions = qsa('#items #endpoint[href^="/c/"], #items #endpoint[href^="/@"]')
		.map(channelName)

	const run = () => {
		qsa('ytd-rich-grid-media').forEach((el) => {
			const ch = channelName(qs('#avatar-link', el))
			el.parentNode.parentNode.classList[subscriptions.includes(ch) ? 'add' : 'remove']('subscribed')
		})
	}

	observer = new MutationObserver(run)
	observer.observe(container, {
		childList: true
	})

	run()
}

let path = null
const loader = () => {
	if (path === location.pathname) {
		return
	}

	if (observer) {
		observer.disconnect()
		observer = null
	}

	if (location.pathname !== '/') {
		path = location.pathname
		return
	}

	container = qs('#contents.ytd-rich-grid-renderer')
	if (!container) {
		return
	}
	if (!qs('#items #endpoint[href^="/c/"], #items #endpoint[href^="/@"]')) {
		return
	}
	main()
	path = location.pathname
}

addStyles()
setInterval(loader, 100)
