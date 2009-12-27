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
		run:	function() {
			with (jetpack) {
				future.import("slideBar");
				slideBar.append({
					html:	<?xml version="1.0" encoding="UTF-8"?>
							<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
							<html	xmlns="http://www.w3.org/1999/xhtml"
					      			xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
					      			version="XHTML+RDFa 1.0"
					      			xml:lang="en-GB">
								<head profile="http://www.w3.org/1999/xhtml/vocab http://www.w3.org/2003/g/data-view http://ns.inria.fr/grddl/rdfa/ http://purl.org/uF/2008/03/">
									<link href="http://www.w3.org/2003/g/glean-profile" rel="transformation" />
								  	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
									<title>{M.title}</title>
									<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
									<style type="text/css"><![CDATA[
										
									]]></style>
								</head>
								<body>
									<h1>{M.title}</h1>
									
								</body>
							</html>,
					width:	400
				});
			}
		}
	};
})();

M.run();
