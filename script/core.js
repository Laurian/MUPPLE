/**
@prefix : <http://purl.org/net/ns/doas#> .
<>	a	:JavaScript;
		:shortdesc "MUPPLE";
		:created "2008-06-12";
		:release [
			:revision "0.1";
			:created "2009-12-27"
		];
		:author [
			:name "Laurian Gridinoc";
			:homepage <http://purl.org/net/laur>
		];
		:license <http://www.apache.org/licenses/LICENSE-2.0> .
*/

var M = (function() {
	return {
		title:	"MUPPLE",
		base:	"http://github.com/Laurian/MUPPLE/raw/master/",
		
		run:	function() {
			with (jetpack) {
				future.import("slideBar");
				future.import("menu");
				
				slideBar.append({
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
											alert($);
											alert($().rdf().databank.dump({format:'application/rdf+xml', serialize: true}));
										}
									]]></script>
									<link href="style/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
									<style type="text/css"><![CDATA[
										#templates	{
											xdisplay:	none;
										}
									]]></style>
								</head>
								<body class="slide">
									<div class="container">
										<h1 id="empty">things will happen here once you (re)load tabs</h1>
									</div>
									<div id="templates">
										<div id="tab">
											<div class="tab">
												<h4 class="title">Untitled</h4>
												<div>
											   		<ul class="action">
											    		<li>action one</li>
											        	<li>action two</li>
											        	<li>action three</li>
											    	</ul>
												</div>
											</div>
										</div>
									</div>
								</body>
							</html>,
					
					width:	320,
					
					onSelect:	function(slide) { 
						slide.slide(320, true);
					},
					
					onReady:	function(slide) {
						var document = slide.contentDocument;
						
						M.loadLibs(document, function() {
							M.loadUILibs(document, function() {
								//M.loadScript(M.base + "script/lib/firebug-lite-custom.js", document, function() {
									M.loadScript(M.base + "script/slide.js", document, function() {
										console.log("loaded");
									});
								//});
							});
						});
						
						// "import" PURE
						$.get(M.base + "script/lib/pure_packed.js", function(data, status) {
							eval(data);
							//$("p.foo", document).autoRender({foo: "loaded!"});
						});
						
						/*$("h1", slide.contentDocument).bind("click", function() {
							console.log("click");
						});*/
						
						
						jetpack.tabs.onOpen(function(tab) {
							
						});
						
						jetpack.tabs.onReady(function(tab) {
							if ($("title", tab).length == 0) return;
							
							$("#empty", document).remove();
							
							//var t = $($("#tab", document).html(), document);
							var t = $("#tab", document).clone();
							$("div.container", document).append(t);
							t.autoRender({
								title: $("title", tab).text()
							});
							
							
							
						});
					}
				});
				
				menu.context.page.add({  
					label: "MUPPLE",  
					icon: "http://example.com/ice-cream.png",  
					menu: new jetpack.Menu(["Record", "Chocolate", "Pistachio", null, "None"]), 
					command: function(menuitem) {
						jetpack.notifications.show(menuitem.label)
					}  
				});
			}
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
			//TODO: detect and reuse existing jQuery, see http://jetpackgallery.mozillalabs.com/jetpacks/154
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
		}
	};
})();

M.run();
