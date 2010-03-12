// force livequery update when we enter this document
// modifications done with jquery from jetpack don't trigger livequery :(
$("body").mousemove(function(e) {
	$("#flow").text(e.pageX + ", " + e.pageY);
});

//make sortable the workflow items
$(".edit .workflows").livequery(function(){
    $(this).sortable({
		revert: 		true,
		dropOnEmpty:	true,
		cancel: 		'li.empty',
		update:			function() {
			save();
		}
	});
}, function(){
		$(this).sortable("destroy");
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
$(".edit .workflowtrash").livequery(function(){
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
}, function() {
	//destroy, hmmm, no dragable/sortable available anyway
});

//make sortable tasks
$(".edit .action").livequery(function(){
    $(this).sortable({
		revert: 		true,
		connectWith:	'.action',
		dropOnEmpty:	true,
		cancel: 		'li.empty',
		update:			function() {
			save();
		}
	});
}, function(){
	$(this).sortable("destroy");
});

//trash bin for tasks
$(".edit .trash").livequery(function(){
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
}, function() {
	//destroy, hmmm, no dragable/sortable available anyway
});

//make sortable task sets
$(".edit #container").livequery(function(){
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
}, function() {
	$(this).sortable("destroy");
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
    });

$(".title").bind("dblclick", function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
	$(this).ellipsis();
});

//all the editable items
$('.edit .title,.edit .action li,.edit #workflow h3,.edit ul.workflows > li > span').livequery(function() {
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
}, function() {
	$(this).editable("destroy");
});

//delete taskset
$(".edit a.delete").livequery(function() {
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
			if ($('body.play').length > 0) send("link-over:" + $(this).attr("id"));
		},
		function() {
			//send("link-out:" + $(this).attr("about"));
		}
	).click(function() {
		//send("show:" + $(this).attr("about"));
		if ($('body.play').length > 0) {
			if ($(this).parents("div.tab").hasClass("tab-current")) {
				send("show:" + $(this).attr("id"));				
			} else {
				send("switch-show:" + $(this).attr("id"));	
			}
		};
		//test rdfa extraction on this very action
		//console.log($(this).rdf().databank.dump({format:'application/rdf+xml', serialize: true}));
	});
});

$("#edit button").toggle(
		function() {
			$("body").addClass("edit").removeClass("play");
			$(this).text("End editing mode");
		},
		function() {
			$("body").removeClass("edit").addClass("play");			
			$(this).text("Edit this workflow");
		}
	);
	
function save() {
	send("save");
}

function send(message) {
	$("#comm").attr({
		src: "data:text/plain,have a number: " + Math.random() + "#" + message
	});
}

$("#new-task a").livequery(function(){
	$(this).click(function(){
		$("#workflow ul.workflows").append("<li id='urn:uuid:" + guid() + "'><span>Double click to edit</span><div class='payload'><div class='empty'><h1>things will happen here once you (re)load tabs</h1><p><a href='https://wiki.mozilla.org/Education/Projects/JetpackForLearning/Profiles/MUPPLE' target='_new' class='info'>About MUPPLE</a></p></div></div></li>");
	});	
});



$("#export a").livequery(function(){
	$(this).click(function(){
		//alert("export");
		send("export");
	});	
});


$("#workflow ul.workflows > li").livequery(function() {
	$(this).click(function() {
		if ($('body.play').length > 0) {
			
			var id = $(this).attr("id");

			//save cards
			$.map($("#workflow ul.workflows > li"), function(li){
				if ($(li).attr("id") != id && $(li).hasClass("active")) {
					$(li).removeClass("active");
					$(li).children("div.payload").html($("#container").html());
				}
			});

			//load cards
			$.map($("#workflow ul.workflows > li"), function(li){
				if ($(li).attr("id") == id) {
					$(li).addClass("active");
					$("#container").html($(li).children("div.payload").html());
				}
			});
			
			save();
		}
	});
});

$(".tab button").livequery(function(){
	$(this).toggle(function() {
		$(this).text("Mark as undone")
		.closest(".tab").children("h4").addClass("done");
	}, function() {
		$(this).text("Mark as done")
		.closest(".tab").children("h4").removeClass("done");
	});	
	save();
});


//http://note19.com/2007/05/27/javascript-guid-generator/
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


//dev bookmarklets

//uncomment to load http://www.sprymedia.co.uk/article/Design bookmarklet
//function fnStartDesign(sUrl) {var nScript = document.createElement('script');nScript.setAttribute('language','JavaScript');nScript.setAttribute('src',sUrl);document.body.appendChild(nScript);}fnStartDesign('http://www.sprymedia.co.uk/design/design/media/js/design-loader.js');

//uncomment to load http://getfirebug.com/lite.html
//set slidebar to min 500px with to have firebug lite usable
//var firebug=document.createElement('script');firebug.setAttribute('src','http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);
