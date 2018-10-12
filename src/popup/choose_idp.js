
const metadata_source1 = "https://engine.surfconext.nl/authentication/proxy/idps-metadata";
const metadata_source2 = "https://engine.surfconext.nl/authentication/proxy/idps-metadata?sp-entity-id=https://profile.surfconext.nl/authentication/metadata";

function createIdpList(idps) {
	html="";
	for (i=0; i<idps.length; i++) {
		console.log(idps[i]);
		html += `<button type="button" class="button idp" value="${idps[i].entityid}" name="${idps[i].name}">`;
		html += `<span class="logo-wrapper"><img class="logo" src="${idps[i].logo}"/></span>`;
		html += `${idps[i].name}`;
		html += `</button>\n`;
	}
	console.log("Setting html to "+html);
	document.querySelector('#idps').innerHTML = html;
}

function storeSettings(settings) {
	console.log("Storing settings");
	console.log(settings);
	browser.storage.local.set(settings);
}

function showDefault(idp)
{
	console.log("Default is: ");
	console.log(idp);
	if (idp==null) {
		var idpName = "<disabled>";
	} else {
		var idpName = idp.name;
	}
	document.querySelector("#default").innerText = idpName;
}

function fetchDefault()
{
	browser.storage.local.get({idp:''})
		.then(({idp}) => showDefault(idp));
}

function selectIdp(idp_entityid,idp_name) {
	idp = { name: idp_name, entityid: idp_entityid };
	console.log("CS: Selected IdP "+idp);
	storeSettings({ idp: idp });
}

function resetIdp() {
	console.log("CS: Selected reset");
	storeSettings({ idp: null });
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks()
{
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("idp")) {
			selectIdp(e.target.value,e.target.name);
		}
		else if (e.target.id=="reset_idp") {
			resetIdp();
		}
	});
}

function listenForDefaultChange()
{
	browser.storage.onChanged.addListener( (e) => {
		console.log("Storage changed");
		console.log(e);
		if ('idp' in e)
		{
			idp = e.idp.newValue;
			console.log("Default IdP changed to "+idp);
			showDefault(idp);
		}
	});
}


var idp_list = [
	{ name: "SURFnet bv", entityid: "https://idp.surfnet.nl", logo: "https://static.surfconext.nl/logos/idp/surfnet.png" },
	{ name: "Universitair Medisch Centrum Utrecht", entityid: "http://fs.umcutrecht.nl/adfs/services/trust", logo: "https://static.surfconext.nl/logos/idp/UMC-Utrecht_logo.png" },
	{ name: "Hogeschool van Amsterdam", entityid: "http://adfs20.hva.nl/adfs/services/trust", logo: "https:///static.surfconext.nl/logos/idp/hva.jpg" },
	//{ name: "", entityid: "", logo: "" },
];

createIdpList(idp_list);
fetchDefault();
listenForClicks();
listenForDefaultChange();