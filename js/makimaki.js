// ---------------------------------------------------------
// お知らせの表示処理用
// ---------------------------------------------------------
function InfoController() {}

InfoController.prototype.show = function(data) {

	var item_box = document.querySelector("#info-list"),
		fragment = document.createDocumentFragment(),
		template = document.createElement("a"),
		div      = document.createElement("div"),
		l_div    = document.createElement("div"),
		l_img    = document.createElement("img"),
		r_div    = document.createElement("div"),
		r_span1  = document.createElement("span"),
		r_span2  = document.createElement("span"),
		r_p      = document.createElement("p");

	// テンプレート作成
	$(div).addClass("row");
	$(l_div).addClass("col-md-2");
	$(l_img).addClass("img-thumbnail").attr({"alt":"img","src":"img/noimage.png"});
	$(r_div).addClass("col-md-8");
	$(r_span1).addClass("date");
	$(r_span2).addClass("title");
	$(r_p).addClass("description");

	l_div.appendChild(l_img);
	r_div.appendChild(r_span1);
	r_div.appendChild(r_span2);
	r_div.appendChild(r_p);
	div.appendChild(l_div);
	div.appendChild(r_div);
	template.appendChild(div);

	for ( var i = 0; i < data.entries.length; i++ ) {
		var entry = data.entries[i];
		var imgsrc = /src="(.*?)"/igm.exec(entry.content);

		var item = template.cloneNode(true);
		item.href = entry.link;
		item.querySelector(".date").textContent = this.dateFormatter(entry.publishedDate);
		item.querySelector(".title").textContent = entry.title;
		item.querySelector(".description").innerHTML = this.unescapeHTML(entry.contentSnippet).split("続きを読む")[0];
		if(imgsrc != null) {
			item.querySelector("img").src = imgsrc[1];
		}
		fragment.appendChild(item);
		fragment.appendChild(document.createElement("hr"));
	}
	item_box.appendChild(fragment);
	$("#load-img").hide();
}

InfoController.prototype.dateFormatter = function(date_str) {
	var pdate  = new Date(date_str);
	var pyear  = pdate.getFullYear();
	var pmonth = pdate.getMonth() + 1;
	var pday   = pdate.getDate();

	pmonth = (pmonth < 10) ? "0" + pmonth : pmonth;
	pday = (pday < 10) ? "0" + pday : pday;

	return pyear + "/" + pmonth + "/" + pday;
}

InfoController.prototype.unescapeHTML = function(str) {
  var div = document.createElement("div");
  div.innerHTML = str.replace(/</g,"&lt;")
                     .replace(/>/g,"&gt;")
                     .replace(/ /g, "&nbsp;")
                     .replace(/\r/g, "&#13;")
                     .replace(/\n/g, "&#10;");
  return div.textContent || div.innerText;
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
		self.show_page(hash);
	});
}

PageController.prototype.show_page = function(page) {
	$(".page").hide();
	$(".menu li").each(function(){
		$(this).css("text-decoration", "none");
	});

	if(page === "") {
		page = "#home";
	}
	$("." + page.substr(1)).show();
	$(page).css("text-decoration", "underline");
}

// ---------------------------------------------------------
$(function() {
	var page_controller = new PageController();
	var hash = location.hash;
	page_controller.show_page(hash);
});

// ---------------------------------------------------------
// RSS処理用
// ---------------------------------------------------------
//APIのモジュールを読み込み
google.load("feeds", "1");
google.setOnLoadCallback(getRssFeed);

function getRssFeed() {
	var url = "http://ec2-54-69-49-117.us-west-2.compute.amazonaws.com/DevelopmentDiary/index.php/feed/";

	//フィードの取得
	var feed = new google.feeds.Feed(url);

	//エントリの表示数の設定
	feed.setNumEntries(3);

	feed.load(function(result) {
		if (!result.error) {
			var info_controller = new InfoController();
			info_controller.show(result.feed);
		} else {
			//読み込みが失敗したときの処理
			console.log(result.error.code + ":" + result.error.message);
		}
	});
}