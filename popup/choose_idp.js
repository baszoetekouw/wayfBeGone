function handleError(error) {
	console.log("CS: handleError: ");
	console.log(error);
}

function handleResponse(message) {
	console.log("CS: handleResponse: ");
	console.log(message);
}

function notifyBackgroundPage(msg) {
	console.log("CS: sending message");
	console.log(msg);
	var sending = browser.runtime.sendMessage(msg);
	sending.then(handleResponse, handleError);
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
	document.addEventListener("click", (e) => {

		function selected_idp(idp) {
			console.log("CS: Selected IdP "+idp);
			notifyBackgroundPage({type: "select_idp", idp: idp});
		}

		function reset_idp() {
			console.log("CS: Selected reset");
			notifyBackgroundPage({type: "reset"});
		}

		if (e.target.classList.contains("idp")) {
			selected_idp(e.target.innerText);
		}
		else if (e.target.classList.contains("reset")) {
			reset_idp();
		}
	});
}

listenForClicks();
