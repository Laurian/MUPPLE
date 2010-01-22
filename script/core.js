/**
@prefix : <http://purl.org/net/ns/doas#> .
<>	a	:JavaScript;
		:shortdesc "MUPPLE";
		:created "2009-12-27";
		:release [
			:revision "0.3";
			:created "2009-12-27"
		];
		:author [
			:name "Laurian Gridinoc";
			:homepage <http://purl.org/net/laur>
		];
		:license <http://www.apache.org/licenses/LICENSE-2.0> .
*/

with (jetpack.future) {
	import("slideBar");
	import("menu");
	import("selection");
	import("storage.simple");
}

const base = "http://github.com/Laurian/MUPPLE/raw/master/";
//const base = "http://127.0.0.1:8888/MUPPLE/"; 

var MUPPLE = function() {

	Utils.init();
	
	this.slideBar = new SlideBar(function() {

		mupple.load(document);					

		// "import" PURE right here, it requires "document"
		$.get(base + "script/lib/pure_packed.js", function(data, status) {
			eval(data);
		});


	});

	createMenus();
	setupListeners();
		
	function createMenus() {
		with(jetpack.menu.context) {
			
			page.on("a, a > *").add(function(context) {
				return {
					icon:		base + "image/link-1.png",
			    	label:		"Add link action",
			    	command: 	function() {
						var id = Utils.sha1(Utils.baseDomain(context.document.location));

						var action = $("#actions li.link", document).clone()
							.text($(context.node).text());
						$("#" + id + " .action", document).append(action);
					
						mupple.save(document);
					}
				};
			});

			page.on("input").add(function(context) {
				return {
					icon:		base + "image/document-edit-1.png",
			    	label:		"Add form field action",
			    	command: 	function() {
						var id = Utils.sha1(Utils.baseDomain(context.document.location));

						var action = $("#actions li.field", document).clone()
							.text($(context.node).attr("name"));
						$("#" + id + " .action", document).append(action);
					
						mupple.save(document);
					}
				};
			});
		
			page.beforeShow = function(menu, context) {
				menu.reset();
			  	if (jetpack.selection.text) {
					
			    	menu.add({
						icon:		base + "image/bubble-1.png",
				    	label:		"Note: " + jetpack.selection.text,
						command: 	function() {
							var id = Utils.sha1(Utils.baseDomain(context.document.location));

							var action = $("#actions li.note", document).clone()
								.text(jetpack.selection.text);
							$("#" + id + " .action", document).append(action);
						
							console.log(Utils.xptrService.createXPointerFromSelection(
							    jetpack.tabs.focused.contentWindow.getSelection(), 
							    jetpack.tabs.focused.contentDocument));
						
							mupple.save(document);
						}
					});
			  	}
			};
		}
	}
	
	function setupListeners() {

		jetpack.tabs.onOpen(function(tab) {

		});

		jetpack.tabs.onReady(function(tab) {
			if ($("title", tab).length == 0) return;

			var id = Utils.sha1(Utils.baseDomain(tab.location));
			if ($("#" + id, document).length != 0) return;

			var t = $("#tab div.tab", document).clone();
			$("#container", document).append(t);
			
			t.autoRender({
				id:		id,
				title: 	$("title", tab).text()
			});

			mupple.save(document);
		});
	}
	
	this.save = function(document) {
		console.log("save " + $("#container", document).html());
		jetpack.storage.simple.test = $("#container", document).html();
	};
	
	this.load = function(document) {
		console.log("load " + jetpack.storage.simple.test);
		$("#container", document).html(jetpack.storage.simple.test);
	};
	
};



var SlideBar = function(callback) {

	this.document = null;
	
	jetpack.slideBar.append({
		icon:	base + "image/mupple-jetpack_32x32.png",
		width:	310,			
		url:	base + "slidebar.html",
								
		onSelect:	function(slide) { 
			slide.slide(310, true);
		},
		
		onReady:	function(slide) {
			document = slide.contentDocument;
			
			loadLibs(document, function() {
				loadUILibs(document, function() {
					Utils.loadScript(base + "script/slide.js", document, function() {
						console.log("loaded");
						callback();
					});
				});
			});

		}
	});

	function loadLibs(document, callback) {
		with (Utils) {
			loadScript(base + "script/lib/jquery-1.3.2.min.js", document, function() {
				loadScript(base + "script/lib/jquery.json-2.2.min.js", document, function() {
					loadScript(base + "script/lib/jquery.rdfquery.core-1.0.js", document, function() {
						loadScript(base + "script/lib/jquery.rdfquery.rdfa-1.0.js", document, callback);
					});
				});
			});
		}
	};
	
	function loadUILibs(document, callback) {
		with (Utils) {
			loadScript(base + "script/lib/jquery-ui-1.7.2.custom.min.js", document, function() {
				loadScript(base + "script/lib/jquery.text-overflow.js", document, function() {
					loadScript(base + "script/lib/jquery.jeditable.js", document, function() {
						loadScript(base + "script/lib/jquery.livequery.js", document, callback);
					});
				});
			});
		}
	};

};


var Utils = {
	init:	function() {
		var xptrService;
		
		try {
			xptrService = Components.classes["@mozilla.org/xpointer-service;1"].getService();
			xptrService = xptrService.QueryInterface(Components.interfaces.nsIXPointerService);
			Utils.xptrService = xptrService;
		} catch (ignored) {}
		
		if (!xptrService) {
			Utils.import(base + "script/lib/nsXPointerService.js");
		}
	},
	
	loadScript:	function(src, document, callback) {
		var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
		script.src = src;
		if (callback) $(script).bind("load", callback);
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	
	loadStyle:	function(href, document, callback) {
		var style = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
		style.type 		= "text/css";
		style.rel 		= "stylesheet";
		style.href 		= href;
		style.media 	= "screen";
		if (callback) $(style).bind("load", callback);
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	
	import:	function(src, callback) {
		$.get(src, function(data, status) {
			eval(data);
			if (callback) callback();
		});
	},
	
	uri:	function(uri, base) {
		return Components.classes["@mozilla.org/network/io-service;1"]
		            .getService(Components.interfaces.nsIIOService)
					.newURI(uri, null, base);
	},
	
	//from https://developer.mozilla.org/en/Code_snippets/URI_parsing
	baseDomain:	function(uri) {
		if (!(typeof(uri) == "object" 
			&& uri instanceof Components.interfaces.nsIURI))
			uri = Utils.uri(uri);
		
		var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"]
		                  	.getService(Components.interfaces.nsIEffectiveTLDService);
		var suffix = eTLDService.getPublicSuffix(uri);
		var basedomain = eTLDService.getBaseDomain(uri);
		return basedomain.substr(0, (basedomain.length - suffix.length - 1));
	},
	
	// from https://developer.mozilla.org/en/nsICryptoHash
	sha1:	function(str) {
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
							.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

		converter.charset = "UTF-8";
		var result = {};

		var data = converter.convertToByteArray(str, result);
		var ch = Components.classes["@mozilla.org/security/hash;1"]
					.createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA1);
		ch.update(data, data.length);
		var hash = ch.finish(false);

		function toHexString(charCode) {
			return ("0" + charCode.toString(16)).slice(-2);
		}

		return [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
	},
	
	xptrService:	null,
	
	toggleUbiquity:		function(command) {
		with (jetpack.tabs[0].raw.ownerDocument.defaultView.gUbiquity) {
			if (command) textBox.value = command;
			toggleWindow();
		}
	}
};

var mupple = new MUPPLE();
