var sUrl = '';

function updateUrl() {
	sUrl = document.getElementById('iuServerUrl').value
	document.getElementById('pCurrentUrl').innerText = `current URL: ${sUrl}`;
}
setTimeout(updateUrl, 5)

function test() {
	fetch(new Request(sUrl+'/test', { method: 'GET' }))
		.catch(err => console.error(err));
}
function upload() {
	const inUrl = document.getElementById('iuServerUrl')+'/upload'
	fetch(new Request(inUrl, { method: 'GET' }))
		.catch(err => console.error(err));
}

function updateList() {
	const listDiv = document.getElementById('dSoundList')
	fetch(new Request(sUrl+'/list'))
		.then((resp) => {
			resp.json().then((data) => {
				var list = "<ul>";
				for(let s in data)
					list += `<li>${data[s].path} &mdash; ${data[s].author}</li>`
				list += "</ul>";
				listDiv.innerHTML = list;
			})
		})
		.catch(err => console.error(err));
}
setInterval(updateList, 200)
