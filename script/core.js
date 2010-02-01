/**
@prefix : <http://purl.org/net/ns/doas#> .
<>	a	:JavaScript;
		:shortdesc "MUPPLE";
		:created "2009-12-27";
		:release [
			:revision "0.6";
			:created "2010-01-31"
		];
		:author [
			:name "Laurian Gridinoc";
			:homepage <http://purl.org/net/laur>
		];
		:license <http://www.apache.org/licenses/LICENSE-2.0> .
*/

//TODO find out what license should be used.


const base = "http://purl.org/ou/mupple/";
//const base = "http://127.0.0.1:8888/MUPPLE/"; 

const width = 310;


var manifest = {
	firstRunPage: "https://wiki.mozilla.org/Education/Projects/JetpackForLearning/Profiles/MUPPLE#How_to_MUPPLE_the_Web"//base + "first-run.html",
}


with (jetpack.future) {
	import("slideBar");
	import("menu");
	import("selection");
	import("storage.simple");
}

var MUPPLE = function() {

	Utils.init();
	
	this.slideBar = new SlideBar(function() {

		mupple.restore(document);					

		// "import" PURE right here, it requires "document"
		// not needed anymore, we use E4X templating now
		/*$.get(base + "script/lib/pure_packed.js", function(data, status) {
			eval(data);
		});*/
		
		
		// listen to messages from the slidebar's code		
		$("#comm", document).load(function() {
			var message = $(this).attr("src");
			message = message.substring(message.indexOf("#") + 1);
			
			if (message == "save") mupple.save(document);
			
			var command = message.substring(0, message.indexOf(":"));
			var args = message.substring(message.indexOf(":") + 1);
			
			//TODO: DRY!
			if (command == "link-over") {
				var action = $("#" + args, document);
				var id = Utils.sha1(action.attr("about"));
				
				if (action.attr("typeof") == "mupple:link") {
					$("a[href='"+action.attr("about")+"']", jetpack.tabs.focused.contentDocument).css({
						outline: "1px solid rgba(255, 20, 147, 0.6)",
						"-moz-outline-radius":	"4px 4px 4px 4px"
					});
					setTimeout(function() {
						$("a[href='"+action.attr("about")+"']", jetpack.tabs.focused.contentDocument).css({
							outline: null,
							"-moz-outline-radius": null
						});
					}, 500);
				}
				
				if (action.attr("typeof") == "mupple:field") {
					$("input[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).css({
						outline: "1px solid rgba(255, 20, 147, 0.6)",
						"-moz-outline-radius":	"4px 4px 4px 4px"
					});
					setTimeout(function() {
						$("input[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).css({
							outline: null,
							"-moz-outline-radius": null
						});
					}, 500);
				}
				
				if (action.attr("typeof") == "mupple:select") {
					$("select[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).css({
						outline: "1px solid rgba(255, 20, 147, 0.6)",
						"-moz-outline-radius":	"4px 4px 4px 4px"
					});
					setTimeout(function() {
						$("select[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).css({
							outline: null,
							"-moz-outline-radius": null
						});
					}, 500);
				}
				
			}
			
			
			if (command == "show") {
				var action = $("#" + args, document);
				
			
				var id = Utils.sha1(action.attr("about"));

				//console.log(action.attr("about"));
				//console.log(id);

				if ($('#' + id, jetpack.tabs.focused.contentDocument).length == 0) {
					var badge = Utils.createBadge(jetpack.tabs.focused.contentDocument, id, action.text());
					
					//TODO: DRY
					if (action.attr("typeof") == "mupple:link") 
						$("a[href='"+action.attr("about")+"']", jetpack.tabs.focused.contentDocument).before(badge);

					if (action.attr("typeof") == "mupple:field") 
							$("input[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).before(badge);
					if (action.attr("typeof") == "mupple:select") 
							$("select[name='"+action.attr("about").substring(1)+"']", jetpack.tabs.focused.contentDocument).before(badge);
				}
				
				
				// E4X templating + CDATA madness
				var code = <>
					muppleBase = "{base}";
					muppleId = "{id}";
					<![CDATA[
					
					//FIXME
					//if ($('#' + muppleId).length > 0) {
						var left = $('#' + muppleId).position().left;
						var top = $('#' + muppleId).position().top;
						$.scrollTo('#' + muppleId, 800, {
							offset:		{top: -40, left: -40},
							onAfter:	function() {
								var pin = $("<span></span>").css({
									height:	31,
							        width:	26,
									"background-repeat": 	"no-repeat",
							        backgroundImage:	"url(" + muppleBase + "image/pin.png)",
							        position:			"absolute",
							        "-moz-background-inline-policy":	"continuous",
							        cursor:			"pointer",
							        "margin-top": 	"-20px",
							        "margin-left": 	"-10px",
									"z-index":		1000,
									top:	"-50px",
									left:	left
								}).appendTo("body").animate({
									top:	top
								});
								setTimeout(function(){
									pin.remove();
								}, 3000);
							}
						});
					//}
				]]></>; 
				
				
				Utils.injectLibs(jetpack.tabs.focused.contentDocument, function() {
					Utils.injectScript(code.toString(), jetpack.tabs.focused.contentDocument);
				});
			}
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
						//TODO: more granular IDs, this is 2nd level domain name only, 
						//confusing, we need site/sub-site level (define site!)
						var id = Utils.sha1(Utils.baseDomain(context.document.location));
						
						var text = $(context.node).text();
						
						/*
						
						//TODO: figure out how to create a range/selection without security errors
						
						var xptr = context.document.location + "#xpointer(" + Utils.getXPath(context.node) + ")";
						console.log(xptr);
						xptr = "http://example.com/#xpointer:(string-range(/html[1]/body[1]/p[1], \"\", 1, 10))";
						console.log(xptr);
						var range = Utils.xptrService.parseXPointerToRange(xptr, jetpack.tabs.focused.contentDocument);
						jetpack.tabs.focused.contentWindow.getSelection().addRange(range);
						*/
						
						var action = $("#actions li.link", document).clone()
							.text(text).attr({
								about:	$(context.node).attr("href"),
								property:	"rdfs:label",
								typeof:		"mupple:link",
								id:			Utils.uuid()
							});
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
							.text($(context.node).attr("name")).attr({
								//about:	context.document.location + "#" + $(context.node).attr("name"),
								about:	"#" + $(context.node).attr("name"),
								property:	"rdfs:label",
								typeof:		"mupple:field",
								id:			Utils.uuid()
							});
						$("#" + id + " .action", document).append(action);
					
						mupple.save(document);
					}
				};
			});

			page.on("select").add(function(context) {
				return {
					icon:		base + "image/document-edit-1.png",
			    	label:		"Add form field action",
			    	command: 	function() {
						var id = Utils.sha1(Utils.baseDomain(context.document.location));

						var action = $("#actions li.field", document).clone()
							.text($(context.node).attr("name")).attr({
								//about:	context.document.location + "#" + $(context.node).attr("name"),
								about:	"#" + $(context.node).attr("name"),
								property:	"rdfs:label",
								typeof:		"mupple:select",
								id:			Utils.uuid()
							});
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
								.text(jetpack.selection.text).attr({
									//TODO: create Annotea like things, context, etc.
									about:	Utils.xptrService.createXPointerFromSelection(
									    jetpack.tabs.focused.contentWindow.getSelection(), 
									    jetpack.tabs.focused.contentDocument),
									property:	"rdfs:label",
									typeof:		"mupple:range",
									id:			Utils.uuid()
								});
							$("#" + id + " .action", document).append(action);
						
							mupple.save(document);
						}
					});
			  	}
			};
		}
	}
	
	function setupListeners() {

		jetpack.tabs.onReady(function(tab) {
			new Card(document, tab);
			mupple.save(document);
		});
	}
	
	//TODO: use save/restore to sync multiple slidebars in multiple windows
	
	this.save = function(document) {
		//TODO: save from higher in hierarchy, to save sets and open workflows
		jetpack.storage.simple.test = $("#container", document).html();
	};
	
	this.restore = function(document) {
		$("#container", document).html(jetpack.storage.simple.test);
	};
	
};


var SlideBar = function(callback) {

	//TODO: do we need an array here? or we need an array of SlideBars for multiple windows handling?
	this.document = null;
	
	jetpack.slideBar.append({
		icon:	base + "image/mupple-jetpack_32x32.png",
		width:	width,			
		url:	base + "slidebar.html",
								
		onSelect:	function(slide) { 
			slide.slide(width, true);
		},
		
		onReady:	function(slide) {
			document = slide.contentDocument;
			
			//TODO: simplify
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
			//TODO: simplify, use an array
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
			//TODO: simplify, use an array, merge with loadLibs
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

// The Card is the widget that keeps actions for a particular domain name
// TODO: each step in a workflow should have its own stack of cards
var Card = function(document, tab) {
	
	if ($("title", tab).length == 0) return;

	var id = Utils.sha1(Utils.baseDomain(tab.location));
	if ($("#" + id, document).length != 0) return;

	var title = $("title", tab).text();

	//TODO add all needed namespaces, not to loose them on copy-paste
	var template = <div class="tab" id={id} xmlns:mupple="http://purl.org/ou/mupple/schema">
		<h4 class="title" about={tab.location} property="rdfs:label">{title}</h4>
		<div class="content">
	   		<ul class="action">
	    		<li class="empty">
					<p>no actions, <a href="https://wiki.mozilla.org/Education/Projects/JetpackForLearning/Profiles/MUPPLE#How_to_MUPPLE_the_Web" target="_new" class="help">show me how to add one</a></p>
					<p>or <a href="#" class="delete">delete this group</a></p>
				</li>
	    	</ul>
			<div class="bar">
				<div class="trash">. . . .</div><!-- TODO: use css content instead of dots -->
			</div>
			<div class="bar-button">
				<button>Done</button>
			</div>
		</div>
	</div>;
	
	
	var t = $(template.toString(), document);
	$("#container", document).append(t);
};




var Utils = {
	
	xptrService:	null,
	
	init:	function() {
		var xptrService;
		
		try {
			// do we have xpoiterlib extension? (very unlikely)
			xptrService = Components.classes["@mozilla.org/xpointer-service;1"].getService();
			xptrService = xptrService.QueryInterface(Components.interfaces.nsIXPointerService);
			Utils.xptrService = xptrService;
		} catch (ignored) {}
		
		if (!xptrService) {
			// "import it" = AJAX get + eval ... ugly.
			Utils.import(base + "script/lib/nsXPointerService.js");
		}
	},
	
	//loads a script by src
	loadScript:	function(src, document, callback) {
		var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
		script.src = src;
		if (callback) $(script).bind("load", callback);
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	
	//loads css by href
	loadStyle:	function(href, document, callback) {
		var style = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
		style.type 		= "text/css";
		style.rel 		= "stylesheet";
		style.href 		= href;
		style.media 	= "screen";
		if (callback) $(style).bind("load", callback);
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	
	//AJAX get + eval a script, unsafe
	//should we use ADSafe for sanboxing?
	import:	function(src, callback) {
		$.get(src, function(data, status) {
			eval(data);
			if (callback) callback();
		});
	},
	
	//inject <script>code</script>
	injectScript:	function(code, document) {
		var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
		$(script).text(code);
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	
	//inject <script>callback(json)</script>
	injectJsonP:	function(data, document, callbackName) {
		var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
		Utils.injectScript(callbackName + "(" + nativeJSON.encode(data) + ");", document);
	},
	
	//inject jQuery + some utility plugins
	injectLibs:		function(document, callback) {
		with (Utils) {
			loadScript(base + "script/lib/jquery-1.3.2.min.js", document, function() {
				loadScript(base + "script/lib/jquery.scrollTo.js", document, callback);
			});
		}
	},
	
	//get a real URI
	uri:	function(uri, base) {
		return Components.classes["@mozilla.org/network/io-service;1"]
		            .getService(Components.interfaces.nsIIOService)
					.newURI(uri, null, base);
	},
	
	//from https://developer.mozilla.org/en/Code_snippets/URI_parsing
	//used here for card IDs
	//TODO better granularity than 2nd level domain names
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
	// used for IDs (that won't need escaping when used in jquery)
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

	//TODO use this for xpointer when we're not dealing with ranges
	getXPath: 	function(element){
		var path = "";
     	for (; element && element.nodeType == 1; element = element.parentNode) {
	    	idx = (function(element) {
				var count = 1;
			    for (var sib = element.previousSibling; sib ; sib = sib.previousSibling) {
			    	if(sib.nodeType == 1 && sib.tagName == element.tagName) count++;
			    }
			    return count;
		  	}(element));
       		xname = element.tagName;
	       	if (idx > 1) xname += "[" + idx + "]";
	       	path = "/" + xname.toLowerCase() + path;
		}
		return path;
	},
						
	//invoke Ubiquity, TODO is tabs.raw legal?
 	toggleUbiquity:		function(command) {
		with (jetpack.tabs[0].raw.ownerDocument.defaultView.gUbiquity) {
			if (command) textBox.value = command;
			toggleWindow();
		}
	},
	
	// Badge to be injected next to the target of an annotation
	// inspired by http://azarask.in/verbs/mouse/
	createBadge:	function(document, id, title) {
		return $("<span></span>", document).css({
	 		height:	31,
	        width:	26,
			"background-repeat": 	"no-repeat",
	        backgroundImage:	"url(" + base + "image/bubble-2.png)",
	        position:			"absolute",
	        "-moz-background-inline-policy":	"continuous",
	        cursor:			"pointer",
	        "margin-top": 	"-20px",
	        "margin-left": 	"-10px",
	        "opacity": 		.3
		})
		.attr({
			id:		id,
			title:	title
		}).hover(
			function() {
				$(this).css({backgroundImage:	"url(" + base + "image/bubble-1.png)"});
			},
			function() {
				$(this).css({backgroundImage:	"url(" + base + "image/bubble-2.png)"});
			}
		);
	},
	
	// amazingly (ugly) unique IDs
	uuid:		function() {
		var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
		            .getService(Components.interfaces.nsIUUIDGenerator);
		var uuid = uuidGenerator.generateUUID();
		return uuid.toString().substring(1, 37);
	}
};


var mupple = new MUPPLE();
