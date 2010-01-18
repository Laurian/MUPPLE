jetpack.future.import("menu");
jetpack.future.import("selection");

jetpack.menu.context.page.on("*").add({
	label: 		"Ice Cream",  
	icon: 		"http://example.com/ice-cream.png",  
	menu: 		new jetpack.Menu(["Vanilla", "Chocolate", "Pistachio", null, "None"]),  
	command:	function (menuitem, context) {
		jetpack.notifications.show(menuitem.label);
		
	},
	beforeShow:	function(menu, context) {
		console.log(context.node);
	}
});