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
										h1	{
											color:	red !important;
										}
									]]></style>
								</head>
								<body class="bp">
									<div class="container">
										<h1 onclick="init();">{M.title}</h1>
									</div>
								</body>
							</html>,
					width:	400,
					onSelect:	function(slide) { 
						slide.slide(400, true);
					},
					onReady:	function(slide) {
						M.loadLibs(slide.contentDocument, function() {
							console.log("loaded");
						});
						/*$("h1", slide.contentDocument).bind("click", function() {
							console.log("click");
						});
						//
						jetpack.tabs.onOpen(function(tab) {
							
						});
						jetpack.tabs.onReady(function(tab) {
							console.log(tab.label);
						});*/
						console.log($("html", slide.contentDocument).html());
						$.get(M.base + "script/lib/jquery-1.3.2.min.js", function(data, status) {
							console.log(data);
						});
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
		loadScript:	function(src, document, callback) {
			var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
			script.src = src;
			$(script).bind("load", callback);
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		loadStyle:	function(href, document, callback) {
			var style = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
			style.type = "text/css";
			style.rel = "stylesheet";
			style.href = href;
			style.media = "screen";
			$(style).bind("load", callback);
			document.getElementsByTagName("head")[0].appendChild(style);
		}
	};
})();

M.run();
