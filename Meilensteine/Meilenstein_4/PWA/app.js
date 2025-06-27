// ====== "SETTINGS" ======
const HISTORY_MAX_ENTRIES = 10;
// ========================

const OFFLINE = 0, READY = 1, ERROR = 2, CONNECTING = 3;
let state = OFFLINE; // 0 = offline, 1 = ready, 2 = error (details with bs-alert)
let url, userToken;
let tempTicket; // current Ticket token (container to transfer token between functions)
let modal; // last displayed (currently visible) result modal object

/**
 * FIXME: use Offline for recoverable error state, transform ERROR to FATAL (-error) state
 * TODO: implement new FATAL ERROR states for cases such as window.fetch == false etc.
 * essentially: catch unsupported environments: no cam, no fetch API, no ...
 */

/**
 * Sets the global state and changes all affected HTML Elements to match it.
 * @param {STATE} newState 
 */
function displayState(newState) {
	state = newState;
	// change html accordingly:
	switch (state) {
		case OFFLINE:
			document.getElementById("statusBadge").className = "badge text-bg-secondary";
			document.getElementById("statusBadge").innerHTML = "Nicht Verbunden";
			document.getElementById("ticket-scan").disabled = true;
			document.getElementById("uiConnect").classList.remove(["visually-hidden"]);
			document.getElementById("uiScan").classList.add(["visually-hidden"]);
			url, token = "";
			break;
		case READY:
			document.getElementById("statusBadge").className = "badge text-bg-success";
			document.getElementById("statusBadge").innerHTML = "Bereit";
			document.getElementById("ticket-scan").disabled = false;
			document.getElementById("uiConnect").classList.add(["visually-hidden"]);
			document.getElementById("uiScan").classList.remove(["visually-hidden"]);
			break;
		case CONNECTING:
			document.getElementById("statusBadge").className = "badge text-bg-warning";
			document.getElementById("statusBadge").innerHTML = "Verbindet...";
			document.getElementById("ticket-scan").disabled = true;
			document.getElementById("uiConnect").classList.remove(["visually-hidden"]);
			document.getElementById("uiScan").classList.add(["visually-hidden"]);
			break;
		default:
		case ERROR:
			document.getElementById("statusBadge").className = "badge text-bg-danger";
			document.getElementById("statusBadge").innerHTML = "Fehler";
			document.getElementById("ticket-scan").disabled = true;
			document.getElementById("uiConnect").classList.remove(["visually-hidden"]);
			document.getElementById("uiScan").classList.add(["visually-hidden"]);
			url, token = "";
			break;
	}
}

/**
 * Adds a bootstrap alert component to the page.
 * @param {String} type The alert type as defined in bootstrap.
 * @param {String} message The content of the alert.
 */
function addAlert(type, message) {
	let alertPlaceholder = document.getElementById('liveAlertPlaceholder');
	const wrapper = document.createElement('div');
	wrapper.innerHTML = [
		`<div class="text-start d-inline-block alert alert-${type} alert-dismissible" role="alert">`,
		`	<div>${message}</div>`,
		'	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
		'</div>'
	].join('');
	alertPlaceholder.append(wrapper);
}

/**
 * Displays the scanner window, starts the scanner.
 * @param {*} callbackFunction The function to be called when something is decoded.
 */
function scan(callbackFunction) {
	const QRScannerModal = new bootstrap.Modal(document.getElementById("QrCodeScanner")); // fetch modal from HTML into JS
	QRScannerModal.show();

	const html5QrCode = new Html5Qrcode(/* element id */ "reader"); // init scanner
	const qrCodeSuccessCallback = (decodedText, decodedResult) => {
		html5QrCode.stop().then((ignore) => {
			// QR Code scanning is stopped.
			QRScannerModal.hide();
			callbackFunction(decodedText); // call the passed function when something was found
		}).catch((err) => {
			// Stop failed, handle it.
		});
	}

	// listen for a click on close-btn of the scan-modal and abort the scan
	document.getElementById("btnScanClose").addEventListener("click", (e) => {
		html5QrCode.stop().then((ignore) => {
			// QR Code scanning is stopped.
			QRScannerModal.hide();
		}).catch((err) => {
			// Stop failed, handle it.
		});
	});

	const config = { fps: 10, qrbox: { width: 250, height: 250 } };
	html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
	.catch((err) => {
		// Start failed, handle it.
		QRScannerModal.hide();
		addAlert("danger", "<b>Fehler:</b> QR-Code-Scanner konnte nicht gestartet werden. Siehe Konsole für weitere Details.");
		console.error(err);
	});
}

/**
 * Decodes content of scanned QR Code as a URL. Ensures ONLY the correct syntax of that URL, not the content.
 * If successful, apiConnect() will be called.
 * @param {*} decodedText The scan result as string.
 */
function decodeApi(decodedText) {
	let decodedUrl, _url, _userToken;
	// console.log(`SUCCESS: Decoded QR Code, decodedText: ${decodedText}, decodedResult: ${decodedResult}`);
	// verify that decodedText is URL
	try {
		decodedUrl = new URL(decodedText); // success => valid URL (NOT if that URL is useful)
		// make exception for rickroll?
	} catch (error) {
		addAlert("warning", `<i class="bi bi-exclamation-triangle-fill"></i> <b>Fehler:</b> QR-Code codiert keine URL.`);
	}
	_url = decodedUrl.origin;
	_userToken = decodedUrl.pathname.replace("/", ""); // trim forward-slash from path to extract pure token
	apiConnect(_url, _userToken);
}

/**
 * Decodes content of scanned QR Code as a ticket-token. Calls apiCheck() to verify that ticket.
 * Opens the respective modal for the result.
 * @param {*} decodedText scan result as string
 */
async function decodeTicket(decodedText) {
	// check if we're even able to check a ticket
	if (state != READY || !url || !userToken) {
		// how did we even get here?
		addAlert("danger", `<i class="bi bi-exclamation-triangle-fill"></i> <b>Fehler:</b> Scanner nicht initialisiert.`);
		return;
	}

	// FIXME: validate decodedText!
	/*
	Why? Because scanning any code with random nonsense will send that random nonsense directly to the API, which then returns 401 Unauthorized.
	This effectively kicks you from the API whenever you (accidentaly) scan something other than a ticket.
	I think that it is sufficiently unlikely to scan something other than a ticket in the environments I can envision.
	However, according to Murphy's Law, we *should* be catching that as well.
	OR
	Make the API return something other than 401 Unauthorized when the submitted ticketToken is not a valid format.
	Which we could then handle in a way that does not "disconnect" the user.
	*/
	
	// display interim modal while fetching result
	let waitModal = new bootstrap.Modal(document.getElementById("srd:loading"));
	waitModal.show();

	let result = await apiTicketCheck(decodedText);

	waitModal.hide();

	if (result == 1) {
		displayResult("valid");
	} else if (result == 0) {
		displayResult("invalid");
	}
}

/**
 * Displays a modal with the ticket scan result. Type is either "valid" or "invalid".
 * @param {*} type The (type of) result modal to be displayed.
 */
function displayResult(type) {
	let _modal = new bootstrap.Modal(document.getElementById(`srd:${type}`)); // fetch modal from HTML into JS
	
	// create a modified token, using the same formatting (trim and emphasis) as historyAdd()
	let _token;
	if (window.innerWidth < 768) {
		// Screen is too small, shorten the token to the last 4 digits.
		_token = "..." + tempTicket.slice(-4);
	} else {
		// add a little emphasis to the last 4 digits when in desktop
		_token = tempTicket.slice(0,-4) + "<b>" + tempTicket.slice(-4) + "</b>";
	}

	// fill the field in the modal with the modified token
	document.getElementById(`srd:${type}:ticketToken`).innerHTML = _token;

	_modal.show();

	modal = _modal; // transfer the modal object to the global variable, for later use (closing)
}

/**
 * Check if the API exists, is reachable, and the token is valid.
 * Also sets the state accordingly.
 * @param {URL} url 
 * @param {String} token 
 */
async function apiConnect(_url, _userToken) {
	displayState(CONNECTING);

	let request = new Request(_url + "/active/", {
		method: "GET",
		headers: {
			"UserToken": _userToken
		},
		mode: "cors",
		cache: "no-store"
	});

	let response = await fetch(request).catch((error) => {
		apiError(1000);
		console.error(error.message);
	});

	if (!response) {
		// response is undefined? --> abort
		return;
		// prevents another TypeError upon reading response.status below when fetch() failed
	}
	
	if (response.status == 200) {
		// success -> assign global variables
		url = _url;
		userToken = _userToken;
		displayState(READY);
	} else {
		apiError(response.status);
	}

}

/**
 * Takes a ticketToken as parameter and contacts the api to check the validity of that token.
 * If valid, the global tempToken will be set to that token.
 * API must be initialized via apiConnect().
 * @param {String} ticketToken The ticket-token to be checked.
 * @returns 1 = valid, 0 = invalid, -1 = error
 */
async function apiTicketCheck(ticketToken) {
	let request = new Request(url + "/Ticket_verify/", {
		method: "GET",
		headers: {
			"UserToken": userToken,
			"TicketToken": ticketToken
		},
		mode: "cors",
		cache: "no-store"
	});

	let	response = await fetch(request).catch((error) => {
		apiError(1000);
		console.error(error.message);
	});

	if(!response) {
		// response is undefined? --> error
		return -1;
		// prevents another TypeError upon reading response.status below when fetch() failed
	}
	
	if (response.ok) {
		tempTicket = ticketToken; // put the current token into the container for later use
	} else {
		tempTicket = "";
		apiError(response.status);
	}

	switch (response.status) {
		case 200:
			// valid
			return 1;
		case 205:
			// invalid
			return 0;
		default:
			// error / undefined
			return -1;
	}
}

/**
 * Contacts the API to devalue tickets after the user pressed the corresponding button.
 * Also calls historyAdd() with corresponding parameters.
 * @param {String} action A predefined string of what action the user has taken.
 */
async function apiTicketAction(action) {
	if (action == "valid:consume") {
		let buttonConsume = document.getElementById("srd:valid:consume");

		// communicate "please wait"
		buttonConsume.disabled = true;
		buttonConsume.innerHTML = [
			'<span class="spinner-border spinner-border-sm" aria-hidden="true">',
			'</span><span role="status"> in Arbeit...</span>'
		].join("");
				
		let request = new Request(url + "/Ticket_devaluate/", {
			method: "GET",
			headers: {
				"UserToken": userToken,
				"TicketToken": tempTicket
			},
			mode: "cors",
			cache: "no-store"
		});
	
		let response = await fetch(request);

		// remove "please wait" indication
		buttonConsume.disabled = false;
		buttonConsume.innerHTML = "Entwerten";

		if (response.ok) {
			historyAdd(tempTicket, action);
		} else {
			apiError(response.status);
			historyAdd(tempTicket, "valid:cancel"); // error --> ticket still valid, add corresponding entry to history
		}

		tempTicket = ""; // consume tempTicket

		modal.hide(); // hide the currently active modal, set by displayResult()

		if (response.ok) {
			// continue with scanning if all was fine
			scan(decodeTicket);
		}

	} else if (action == "valid:cancel") {
		historyAdd(tempTicket, action);
		tempTicket = "";
		modal.hide();

		scan(decodeTicket);
	} else if (action == "invalid:confirm") {
		historyAdd(tempTicket, action);
		tempTicket = "";
		modal.hide();

		scan(decodeTicket);

	} else {
		// this *should* be unreachable
		addAlert("info", "You broke the HTML, please reload/reinstall.");
	}
}

/**
 * Sets the display to Error and adds an error alert.
 * Currently handled: 401 Unauthorized, 404 Not Found and 500 Internal Error.
 * @param {*} errorCode A HTTP or Custom Status Code.
 */
function apiError(errorCode) {
	displayState(ERROR);
	let errorMessage;
	switch (errorCode) {
		case 401:
			errorMessage = "Zugangsschlüssel ungültig. Code auf korrektheit prüfen und / oder neu scannen.";
			break;
		case 404:
			errorMessage = "HTTP Fehler 404: Seite nicht gefunden. Stimmt die URL?";
			break;
		case 500:
			errorMessage = "Interner Datenbankfehler. Bitte Administrator kontaktieren.";
			break;
		case 1000:
			errorMessage = "Netzwerkfehler. Siehe Konsole für weitere Details.";
			break;
		default:
			errorMessage = "Unbekannter Fehler. Siehe Konsole für weitere Details."
			break;
	}
	addAlert("danger", '<i class="bi bi-exclamation-triangle-fill"></i> <b>Fehler:</b> ' + errorMessage);
}

/**
 * Adds a new row, with data from parameters, to the History table.
 * Deletes the HISTORY_MAX_ENTRIES + 1 element upon creating another, limiting the entries to that value.
 * @param {String} token the ticket Token just used
 * @param {String} action the action that was just taken, same as apiTicketAction
 * @returns nothing
 */
function historyAdd(token, action) {
	let table = document.getElementById("history");
	// translate action into HTML:
	let actionHTML;
	switch (action) {
		case "valid:consume":
			actionHTML = '<td class="text-bg-success"><i class="bi bi-check-circle"></i> Entwertet</td>';
			break;
		case "valid:cancel":
			actionHTML = '<td class="text-bg-warning"><i class="bi bi-exclamation-triangle"></i> Nicht Entwertet</td>';
			break;
		case "invalid:confirm":
			actionHTML = '<td class="text-bg-danger"><i class="bi bi-x-octagon"></i> Ungültig</td>';
			break;
		default:
			// this *should* be unreachable
			addAlert("info", "You broke the HTML, please reload/reinstall.");
			return;
	}
	if (window.innerWidth < 768) {
		// Screen is too small, shorten the token to the last 4 digits.
		token = "..." + token.slice(-4);
	} else {
		// add a little emphasis to the last 4 digits when in desktop
		token = token.slice(0,-4) + "<b>" + token.slice(-4) + "</b>";
	}
	let time = new Date(Date.now());
	let newEntry = [
		`<td>${time.toLocaleTimeString()}</td>`,
		`<td>${token}</td>`,
		actionHTML,
	].join("");
	let row = table.insertRow(0);
	row.innerHTML = newEntry;

	// Delete 11th element upon creation, restricting table to 10 entries.
	if (table.rows.length == HISTORY_MAX_ENTRIES + 1) {
		table.deleteRow(HISTORY_MAX_ENTRIES); // counts from zero -> addresses MAX + 1 by default
	}
}

/**
 * Calls apiConnect() with form fields.
 */
function processManualInput() {
	apiConnect(document.getElementById("mi:url").value, document.getElementById("mi:userToken").value);
}