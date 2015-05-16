// ---------------------------------------------------------
// お知らせの表示処理用
// ---------------------------------------------------------
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
// index以外のページ表示用
// ---------------------------------------------------------
function PageController() {
	this.init();
}

PageController.prototype.init = function() {
	var self = this;
	$(window).on("hashchange", function() {
		var hash = location.hash;
		console.log(hash);

		self.show_page(hash);
	});
}

PageController.prototype.show_page = function(page) {
	$(".page").hide();
	$("." + page.substr(1)).show();

	if(page === "" || page === "#home") {
		var info_controller = new InfoController();
		info_controller.load();
	}
}

// ---------------------------------------------------------
$(function() {
	var page_controller = new PageController();
	var hash = location.hash;
	page_controller.show_page(hash);

	if(hash === "" || hash === "#home") {
		var info_controller = new InfoController();
		info_controller.load();
	}
});
