function log(line) {
	$("pre").text($("pre").text() + "\n" + line);	
}

$("body").mousemove(function(e) {
	$("#flow").text(e.pageX + ", " + e.pageY);
});

$(".action").livequery(function(){
    $(this).sortable({
		//placeholder: 	'ui-state-highlight',
		revert: 		true,
		connectWith:	'.action',
		dropOnEmpty:	true,
		cancel: 		'li.empty',
		//deactivate:		function() {
			//clean-up
			//$(".ui-sortable-placeholder").remove();
		//}
	});
});

$(".trash").livequery(function(){
	$(this).droppable({
		//accept: 'li',
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


$(".container").livequery(function(){
    $(this).sortable({
		//placeholder: 'ui-state-highlight',
		scroll:	true,
		revert: true,
		handle:	'h4',
		start:	function() {
			ignoreClick = true;
		}
	});
});

var timeout;
var ignoreClick = false;

$(".title").livequery(function(){
    $(this).bind("click", function(){
		if (ignoreClick) {
			ignoreClick = false;
			return;
		}
		var parent = $(this).parent();
        if (!timeout) {
			timeout = setTimeout(function(){
			    timeout = null;
                $(".content", parent).toggle("blind", null, 200);
            }, 200);
		}
    }).bind("dblclick", function(){
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
	$(this).ellipsis();
});

$('.title, .action li').livequery(function(){
    $(this).editable(function(value, settings){
        $(this).effect("highlight", null, 2500);
        return value;
    }, {
        event: 'dblclick',
        style: 'inherit'
    });
});

$("a.delete").livequery(function(){
    $(this).bind("click", function(){
		$(this).parents(".tab").slideUp("normal", function() {
			$(this).remove();
		});
		return false;
	});
});

//Load http://www.sprymedia.co.uk/article/Design bookmarklet
//function fnStartDesign(sUrl) {var nScript = document.createElement('script');nScript.setAttribute('language','JavaScript');nScript.setAttribute('src',sUrl);document.body.appendChild(nScript);}fnStartDesign('http://www.sprymedia.co.uk/design/design/media/js/design-loader.js');

//Load http://getfirebug.com/lite.html
//var firebug=document.createElement('script');firebug.setAttribute('src','http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);