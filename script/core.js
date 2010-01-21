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

var M =	{
		title:	"MUPPLE", 
		//base:	"http://github.com/Laurian/MUPPLE/raw/master/", 
		base:	"http://127.0.0.1:8888/MUPPLE/", //dev  
		
		run:	function() {
				
			jetpack.slideBar.append({
				icon:	M.base + "image/mupple-jetpack_32x32.png",
				
				width:	310,
				
				html:	<html	xmlns="http://www.w3.org/1999/xhtml"
				      			xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
				      			version="XHTML+RDFa 1.0"
				      			xml:lang="en-GB">
							<head profile="http://www.w3.org/1999/xhtml/vocab http://www.w3.org/2003/g/data-view http://ns.inria.fr/grddl/rdfa/ http://purl.org/uF/2008/03/">
								<link href="http://www.w3.org/2003/g/glean-profile" rel="transformation" />
							  	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
								<base href={M.base} />
								<title>{M.title}</title>
								<script type="text/javascript">var base = "{M.base}";</script>
								<script type="text/javascript"><![CDATA[
									function init() {
										alert($().rdf().databank.dump({format:'application/rdf+xml', serialize: true}));
									}
								]]></script>
								<link href="style/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
								<link href="style/smoothness/jquery-ui-1.7.2.custom.css" media="screen, projection" rel="stylesheet" type="text/css" />
								<style type="text/css"><![CDATA[
									#templates	{
										display:	none;
									}
									#flow {
										color:	white;
									}
								]]></style>
							</head>
							<body class="slide">
								<div id="main" class="container">
									<!-- -->
									<div id="workflows">
										<div class="content">
							        		<div class="buttons">
							        			<span title="help"></span>
							        		</div>
											<h4>Open Workflows</h4>
											<ul>
							        			<li>n/a</li>
							        			<li class="selected">Current Workflow</li>
							        		</ul>
										</div>
										<div class="expander">
											<span title="expand/collapse"></span>
										</div>
							        </div>
									<!-- -->
									<div id="workflow">
							            <h3>Current Workflow3</h3>
										<div class="content">
											<ul class="workflows">
												<li class="empty">
													<p>
														no tasks, <a href="#" class="help">show me how to add one</a>
													</p>
													<p>
														or <a href="#" class="delete">delete this workflow</a>
													</p>
												</li>
							                	<li class="link">Current task set</li>
							                </ul>

											<div class="bar">
												<div class="workflowtrash">trash</div>
											</div>
											<div class="bar-button">
												<a href="#" class="add">new task (set)</a>
											</div>
										</div>
							     	</div>
								</div>
								<div class="container" id="container">
									<div class="empty">
										<h1>things will happen here once you (re)load tabs</h1>
										<p><a href="http://wiki.github.com/Laurian/MUPPLE" target="_new" class="info">About MUPPLE</a></p>
									</div>
								</div>
								<div id="templates">
									<div id="tab">
										<div class="tab id@id">
											<h4 class="title">Untitled</h4>
											<div class="content">
										   		<ul class="action">
										    		<li class="empty">
														<p>no actions, <a href="http://wiki.github.com/Laurian/MUPPLE" target="_new" class="help">show me how to add one</a></p>
														<p>or <a href="http://wiki.github.com/Laurian/MUPPLE" target="_new" class="delete">delete this group</a></p>
													</li>
										    	</ul>
												<div class="bar">
													<div class="trash">trash</div>
												</div>
												<div class="bar-button">
													<button>Done</button>
												</div>
											</div>
										</div>
									</div>
									<ul id="actions">
										<li class="link">link</li>
										<li class="field">form field</li>
										<li class="note">annotation</li>
									</ul>
								</div>
								<div class="container">
									<pre><![CDATA[ ]]></pre>
								</div>
								<span id="flow"><![CDATA[ ]]></span>
							</body>
						</html>,
										
				onSelect:	function(slide) { 
					slide.slide(310, true);
				},
				
				onReady:	function(slide) {
					var document = slide.contentDocument;
					M.slide = document;
					
					M.loadLibs(document, function() {
						M.loadUILibs(document, function() {
							M.loadScript(M.base + "script/slide.js", document, function() {
								console.log("loaded");
							});
						});
					});
					
					// "import" PURE
					$.get(M.base + "script/lib/pure_packed.js", function(data, status) {
						eval(data);
					});
					
					M.xptrServiceInit();
					
					
					jetpack.tabs.onOpen(function(tab) {
					 
					});
					
					jetpack.tabs.onReady(function(tab) {
						if ($("title", tab).length == 0) return;
						
						var id = M.sha1(M.baseDomain(tab.location));
						if ($("#" + id, document).length != 0) return;
						
						var t = $("#tab div.tab", document).clone();
						$("#container", document).append(t);
						t.autoRender({
							id:		id,
							title: 	$("title", tab).text()
						});
						
						
						M.save();
					});
					
					M.load();
				}
			});
			
			jetpack.menu.context.page.on("a, a > *").add(function(context) {
				return {
					icon:		M.base + "image/link-1.png",
			    	label:		"Add link action",
			    	command: 	function() {
						var id = M.sha1(M.baseDomain(context.document.location));
						//TODO: create widget if non-existant
						
						//TODO: use PURE
						var action = $("#actions li.link", M.slide).clone()
							.text($(context.node).text());
						$("#" + id + " .action", M.slide).append(action);
						
						M.save();
					}
				};
			});

			jetpack.menu.context.page.on("input").add(function(context) {
				return {
					icon:		M.base + "image/document-edit-1.png",
			    	label:		"Add form field action",
			    	command: 	function() {
						var id = M.sha1(M.baseDomain(context.document.location));
						//TODO: create widget if non-existant
						
						//TODO: use PURE
						var action = $("#actions li.field", M.slide).clone()
							.text($(context.node).attr("name"));
						$("#" + id + " .action", M.slide).append(action);
						
						M.save();
					}
				};
			});
			
			jetpack.menu.context.page.beforeShow = function(menu, context) {
				menu.reset();
			  	if (jetpack.selection.text) {
					//jetpack.selection.text
			    	menu.add({
						icon:		M.base + "image/bubble-1.png",
				    	label:		"Note: " + jetpack.selection.text,
						command: 	function() {
							var id = M.sha1(M.baseDomain(context.document.location));
							//TODO: create widget if non-existant

							//TODO: use PURE
							var action = $("#actions li.note", M.slide).clone()
								.text(jetpack.selection.text);
							$("#" + id + " .action", M.slide).append(action);
							
							console.log(M.xptrService.createXPointerFromSelection(
							    jetpack.tabs.focused.contentWindow.getSelection(), 
							    jetpack.tabs.focused.contentDocument));
							
							M.save();
						}
					});
			  	}
			};

		},
		
		save:	function() {
			jetpack.future.import("storage.simple");
			jetpack.storage.simple.test = $("#container", M.slide).html();
		},
		
		load:	function() {
			jetpack.future.import("storage.simple");
			$("#container", M.slide).html(jetpack.storage.simple.test);
		},
		
		loadLibs:	function(document, callback) {
			//TODO: detect and reuse existing jQuery, see http://jetpackgallery.mozillalabs.com/jetpacks/154
			with (M) {
				loadScript(base + "script/lib/jquery-1.3.2.min.js", document, function() {
					loadScript(base + "script/lib/jquery.json-2.2.min.js", document, function() {
						loadScript(base + "script/lib/jquery.rdfquery.core-1.0.js", document, function() {
							loadScript(base + "script/lib/jquery.rdfquery.rdfa-1.0.js", document, callback);
						});
					});
				});
			}
		},
		
		loadUILibs:	function(document, callback) {
			with (M) {
				loadScript(base + "script/lib/jquery-ui-1.7.2.custom.min.js", document, function() {
					loadScript(base + "script/lib/jquery.text-overflow.js", document, function() {
						loadScript(base + "script/lib/jquery.jeditable.js", document, function() {
							loadScript(base + "script/lib/jquery.livequery.js", document, callback);
						});
					});
				});
			}
		},
		
		loadScript:	function(src, document, callback) {
			var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
			script.src = src;
			$(script).bind("load", callback);
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		
		loadStyle:	function(href, document, callback) {
			var style = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
			style.type 		= "text/css";
			style.rel 		= "stylesheet";
			style.href 		= href;
			style.media 	= "screen";
			$(style).bind("load", callback);
			document.getElementsByTagName("head")[0].appendChild(style);
		},
		
		import:	function(src, callback) {
			$.get(src, function(data, status) {
				eval(data);
				callback();
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
				uri = M.uri(uri);
			
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
		
		xptrServiceInit:	function() {
			var xptrService;
			
			try {
				xptrService = Components.classes["@mozilla.org/xpointer-service;1"].getService();
				xptrService = xptrService.QueryInterface(Components.interfaces.nsIXPointerService);
				M.xptrService = xptrService;
			} catch (ignored) {}
			
			if (!xptrService) {
				// how can we have this blocking? narrativejs-like?
				M.import(M.base + "script/lib/nsXPointerService.js", function() {
					//M.xptrService = new XPointerService();
					console.log("xpointerlib imported");
					//M.xptrService = new XPointerService();
				});
			}
			
		}
	};



M.run();
