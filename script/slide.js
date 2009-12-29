$(".action").livequery(function(){
    $(this).sortable();
});

var timeout;

$(".title").livequery(function(){
    $(".title").ellipsis().bind("click", function(){
        var parent = this.parent;
        if (!timeout) 
            timeout = setTimeout(function(){
                timeout = null;
                $(".content", parent).toggle("blind", null, 200);
            }, 200);
    }).bind("dblclick", function(){
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    });
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
