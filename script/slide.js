function log(line) {
	$("pre").text($("pre").text() + "\n" + line);	
}

$(".action").livequery(function(){
    $(this).sortable();
});

var timeout;

$(".title").livequery(function(){
	log("match: .title");
	log($(this).html());
	
	var parent = $(this).parent();
	
    $(this).bind("click", function(){
		log("click");
        if (!timeout) {
			log("!timeout");
            timeout = setTimeout(function(){
				log("toggle " + $(".content", parent).length);
                timeout = null;
                $(".content", parent).toggle("blind", null, 200);
            }, 200);
		}
    }).bind("dblclick", function(){
		log("dblclick");
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
	$(this).ellipsis();
});

$('.title, .action li').livequery(function(){
	log("match: .title, .action li");
    $(this).editable(function(value, settings){
        $(this).effect("highlight", null, 2500);
        return value;
    }, {
        event: 'dblclick',
        style: 'inherit'
    });
});

//Load http://www.sprymedia.co.uk/article/Design bookmarklet
//function fnStartDesign(sUrl) {var nScript = document.createElement('script');nScript.setAttribute('language','JavaScript');nScript.setAttribute('src',sUrl);document.body.appendChild(nScript);}fnStartDesign('http://www.sprymedia.co.uk/design/design/media/js/design-loader.js');