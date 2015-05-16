function InfoController() {}

InfoController.prototype.load = function() {
	var self = this;
	$.getJSON("./data/info.json" , function(data) {
		self.show(data);
	});
}

InfoController.prototype.show = function(json) {
	// for each
	var card_info = json[0];
	var card_obj = $(".info-card")[0];
	card_obj.querySelector("u").innerText = card_info.date;
	card_obj.querySelector("p").innerHTML = card_info.body;
	card_obj.querySelector("img").src = card_info.img;
	card_obj.style.display =  "block";
}

// ---------------------------------------------------------
$(function() {
	var info_controller = new InfoController();
	info_controller.load();
});