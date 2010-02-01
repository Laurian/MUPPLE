// force livequery update when we enter this document
// modifications done with jquery from jetpack don't trigger livequery :(
$("body").mousemove(function(e) {
	$("#flow").text(e.pageX + ", " + e.pageY);
});

//make sortable the workflow items
$(".workflows").livequery(function(){
    $(this).sortable({
		revert: 		true,
		dropOnEmpty:	true,
		cancel: 		'li.empty',
		update:			function() {
			save();
		}
	});
});

//expand current workflow
// TODO move boolean in a class (flag)
// such that the flag would be saved (DOM save)
var expanded = false;
$(".expander").click(function() {
	if (expanded) {
		$("#workflows .content").slideUp();
		$(".expander").removeClass("expander-up");
	} else {
		$("#workflows .content").slideDown();		
		$(".expander").addClass("expander-up");
	}
	expanded = !expanded;
});

//trash bin for workflow items
$(".workflowtrash").livequery(function(){
	$(this).droppable({
		accept: 'ul.workflows > li',
		activeClass: 'trash-active',
		hoverClass: 'trash-hover',
		drop:	function(event, ui) {
			$(ui.draggable).remove();
			$(this).parents(".bar").removeClass("trash-hover");
			$(this).parents(".bar").removeClass("trash-active");
			//save(); //no need, sortable.update does the job.
		},
		over:	function(event, ui) {
			$(this).parents(".bar").addClass("trash-hover");
		},
		out:	function(event, ui) {
			$(this).parents(".bar").removeClass("trash-hover");
		},
		activate:	function(event, ui) {
			$(this).parents(".bar").addClass("trash-active");
		},
		deactivate:	function(event, ui) {
			$(this).parents(".bar").removeClass("trash-active");
		}		
	});
});

//make sortable tasks
$(".action").livequery(function(){
    $(this).sortable({
		revert: 		true,
		connectWith:	'.action',
		dropOnEmpty:	true,
		cancel: 		'li.empty',
		update:			function() {
			save();
		}
	});
});

//trash bin for tasks
$(".trash").livequery(function(){
	$(this).droppable({
		//accept: 'li', 
		//we need accept 'li' with common parrent:
		accept: function(el) {
			if ($(el)[0].localName != "li") {
				return false;
			}
			var p1 = $(this).parents(".tab");
			var p2 = $(el).parents(".tab");
			return p1.length > 0 && p2.length > 0 && p1[0] == p2[0];
		},
		activeClass: 'trash-active',
		hoverClass: 'trash-hover',
		drop:	function(event, ui) {
			$(ui.draggable).remove();
			$(this).parents(".bar").removeClass("trash-hover");
			$(this).parents(".bar").removeClass("trash-active");
			//save();//no need, sortable.update does the job.
		},
		over:	function(event, ui) {
			$(this).parents(".bar").addClass("trash-hover");
		},
		out:	function(event, ui) {
			$(this).parents(".bar").removeClass("trash-hover");
		},
		activate:	function(event, ui) {
			$(this).parents(".bar").addClass("trash-active");
		},
		deactivate:	function(event, ui) {
			$(this).parents(".bar").removeClass("trash-active");
		}		
	});
});

//make sortable task sets
$("#container").livequery(function(){
    $(this).sortable({
		scroll:	true,
		revert: true,
		handle:	'h4',
		start:	function() {
			ignoreClick = true;
		},
		update:	function() {
			save();
		}
	});
});

var timeout;
var ignoreClick = false;

//move flag to DOM
var workflowExpanded = true;

$("#workflow h3").livequery(function() {
    $(this).bind("click", function() {
		if (ignoreClick) {
			ignoreClick = false;
			return;
		}
		var parent = $(this).parent();
		// ignore click when double-clicking
        if (!timeout) {
			timeout = setTimeout(function() {
			    timeout = null;
                //$(".content", parent).toggle("blind", null, 200);
				if (workflowExpanded) {
					$(".content", parent).slideUp();
					$("#workflow h3").addClass("collapsed");
				} else {
					$(".content", parent).slideDown();
					$("#workflow h3").removeClass("collapsed");
				}
				workflowExpanded = !workflowExpanded;
            }, 200);
		}
    }).bind("dblclick", function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
});

//for the editable titles filter doubleclicks, and collapse on single click
$(".title").livequery(function() {
    $(this).bind("click", function() {
		if (ignoreClick) {
			ignoreClick = false;
			return;
		}
		var parent = $(this).parent();
        if (!timeout) {
			timeout = setTimeout(function() {
			    timeout = null;
                $(".content", parent).toggle("blind", null, 200);
            }, 200);
		}
    }).bind("dblclick", function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
	$(this).ellipsis();
});

//all the editable items
$('.title, .action li, #workflow h3, ul.workflows > li').livequery(function() {
	//switch to textarea for larger content
	var type = ($(this).text().length > 50)?"textarea":"text";
	
    $(this).editable(function(value, settings) {
        $(this).effect("highlight", null, 500, function() {
			save();
		});
        return value;
    }, {
        event: 	'dblclick',
        style: 	'inherit',
		type:	type,
		onblur:	"submit"
    });
});

//delete taskset
$("a.delete").livequery(function() {
    $(this).bind("click", function() {
		$(this).parents(".tab").addClass("tab-deleted").slideUp("normal", function() {
			$(this).remove();
			save();
		});
		return false;
	});
});

// hover + click on actions, message "proxy-ed" to Jetpack (that listen on the iframe load)
// we do this here and not by binding the events from the jetpack directly due to a very strange
// behaviour I got... TODO check if we have jquery.live() in jetpack and if it work here
$('.action li').livequery(function() {
    $(this).hover(
		function() {
			//send("link-over:" + $(this).attr("about"));
			send("link-over:" + $(this).attr("id"));
		},
		function() {
			//send("link-out:" + $(this).attr("about"));
		}
	).click(function() {
		//send("show:" + $(this).attr("about"));
		send("show:" + $(this).attr("id"));
		//test rdfa extraction on this very action
		//console.log($(this).rdf().databank.dump({format:'application/rdf+xml', serialize: true}));
	});
});

function save() {
	send("save");
}

function send(message) {
	$("#comm").attr({
		src: "data:text/plain,have a number: " + Math.random() + "#" + message
	});
}

//dev bookmarklets

//uncomment to load http://www.sprymedia.co.uk/article/Design bookmarklet
//function fnStartDesign(sUrl) {var nScript = document.createElement('script');nScript.setAttribute('language','JavaScript');nScript.setAttribute('src',sUrl);document.body.appendChild(nScript);}fnStartDesign('http://www.sprymedia.co.uk/design/design/media/js/design-loader.js');

//uncomment to load http://getfirebug.com/lite.html
//set slidebar to min 500px with to have firebug lite usable
//var firebug=document.createElement('script');firebug.setAttribute('src','http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);
