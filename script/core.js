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
		prefix:	"http://github.com/Laurian/MUPPLE/raw/master/",
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
									<title>{M.title}</title>
									<script type="text/javascript">var prefix = "{M.prefix}";</script>
									<style type="text/css"><![CDATA[
										h1	{
											color:	red;
										}
									]]></style>
								</head>
								<body>
									<h1 onclick="init();">{M.title}</h1>
									<script type="text/javascript"><![CDATA[
										var s = document.createElement("script");
										s.src = prefix + "script/lib/LAB.js";
										s.onload = function () {
											$LAB
											.script(prefix + "script/lib/jquery-1.3.2.min.js").wait()
											.script(prefix + "script/lib/jquery.json-2.2.min.js").wait()
											.script(prefix + "script/lib/jquery.rdfquery.core-1.0.js").wait()
											.script(prefix + "script/lib/jquery.rdfquery.rdfa-1.0.js").wait()
											.script(prefix + "script/lib/jquery.rdfquery.rules-1.0.js").wait(function() {
												alert($().rdf().databank.dump({format:'application/rdf+xml', serialize: true}));
											});
										};
										document.body.appendChild(s);
									]]></script>
								</body>
							</html>,
					width:	400,
					onReady:	function(slide) {
						
					}
				});
			}
		}
	};
})();

M.run();
