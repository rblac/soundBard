const socket = io();

function test() {
}
function upload() {
	const ifUpload = document.getElementById('ifUpload');
	if(ifUpload.files.length != 1) {
		alert("select exactly 1 file.");
		return;
	}

}
