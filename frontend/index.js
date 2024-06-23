function test() {
	const inUrl = document.getElementById('iuServerUrl')
	fetch(new Request(inUrl.value, { method: 'GET' })).then(alert(`sent to ${inUrl.value}`))
}
