const qs = (query, p) => (p || document).querySelector(query);
const qsa = (query, p) => [].slice.call((p || document).querySelectorAll(query));

const main = () => {
	const channelName = (el) => el.getAttribute('title')

	// スタイルを追加
	const stylesheet = document.createElement('style')
	document.body.appendChild(stylesheet)
	const s = stylesheet.sheet
	s.insertRule('#contents { display: flex; }')
	s.insertRule('ytd-rich-grid-row { display: contents; }')
	s.insertRule('ytd-rich-grid-row > #contents.ytd-rich-grid-row { display: contents; }')
	s.insertRule('#contents ytd-rich-item-renderer { display: none; }')
	s.insertRule('#contents ytd-rich-item-renderer.subscribed { display: block; }')

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

	const observer = new MutationObserver(run)
	observer.observe(qs('#contents'), {
		childList: true
	})

	run()
}

const loader = () => {
	if (location.pathname !== '/') {
		return
	}
	if (!qs('#contents') || !qs('#items #endpoint[href^="/c/"], #items #endpoint[href^="/@"]')) {
		setTimeout(loader, 100)
		return
	}
	main()
}

loader()
