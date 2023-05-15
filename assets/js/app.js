import "url-search-params-polyfill";

(function ($) {
	"use strict";
	window.openHouse = $.extend(true, {}, window.openHouse || {}, {
		$document: $(document),
		$body: $("body"),
		$header: $("header"),
		mobileWidth: 992,
		resizeIID: -1,
		paginationIID: -1,
		$google_maps: $("[data-google-map]"),
		map: null,
		lastWindow: null,
		loadCount: 12,

		init: function () {
			this.$body.toggleClass("hasTouch", this.hasTouch());

			this.mobileMenu();
			this.smoothScroll();

			// Competition
			this.modalInit();

			this.toogleUserForms();
			this.togglemap();

			if ($(".events").length > 0) {
				this.loadmore();
				this.eventFilter();
			}

			if ($(".news-and-media").length > 0) {
				this.loadmoreNews();
				this.newsFilter();
			}

			this.categoriseBuildings();
			this.google_maps();
			this.buildingFilter();
			this.buildingUpdateFilter();

			this.enableFavourites();

			this.buildSlick();
			this.showmore();
			this.formUI();

			this.prevWinner();
			this.updateFavCount();
			this.searchForm();

			if (this.$body.width() >= this.mobileWidth) {
				// Desktop only
			} else {
				// Mobile only
			}

			this.onPDFlinkclick();
		},

		onPDFlinkclick: function () {
			$("a").on("click", function () {
				const $el = $(this);
				const href = $el.attr("href");

				if (href && href.endsWith(".pdf")) {
					const url = new URL(href);

					console.log("going to a pdf file");
					console.log(url.pathname);
					console.log(url.hostname);

					var gtmData = {
						event: "viewing_pdf_file",
						category: "Viewing PDF File",
						action: url.hostname,
						label: url.pathname,
						value: 1,
					};
					window.dataLayer.push(gtmData);
				}
			});
		},

		hasTouch: function () {
			return (
				"ontouchstart" in document.documentElement ||
				navigator.maxTouchPoints > 0 ||
				navigator.msMaxTouchPoints > 0
			);
		},

		mobileMenu: function () {
			var self = this;
			this.$header
				.on("click", ".menu-toggle", function () {
					self.$body.toggleClass("mobile-menu-open");
				})
				.on("click", ".mobile-expander", function () {
					$(this).parent("li").toggleClass("expanded");
				});
		},

		/*
		 *	Smooth Scroll
		 */
		smoothScroll: function () {
			var self = this;

			$('a[href*="#"]')
				.not('[href="#"]')
				.not('[href="#0"]')
				.click(function (event) {
					var headerOffset = self.$body.width() >= self.mobileWidth ? 257 : 132;
					if (
						location.pathname.replace(/^\//, "") ===
							this.pathname.replace(/^\//, "") &&
						location.hostname === this.hostname
					) {
						var target = $(this.hash);
						target = target.length
							? target
							: $("[name=" + this.hash.slice(1) + "]");
						if (target.length) {
							event.preventDefault();
							if (
								$(this).parents("header").length &&
								self.$body.width() < self.mobileWidth
							) {
								self.$body.removeClass("mobile-menu-open");
							}
							$("html, body").animate(
								{
									scrollTop: target.offset().top - headerOffset,
								},
								1000,
								function () {
									// Callback after animation
									// Must change focus! (problems on IE)
									/*
									var $target = $(target);
									$target.focus();
									if ($target.is(":focus")) { // Checking if the target was focused
										return false;
									} else {
										$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
										$target.focus(); // Set focus again
									};
									*/
								}
							);
						}
					}
				});
		},

		/*
		 *	Events
		 */

		eventFilter: function () {
			var self = this;
			var event_filter = "all";
			self.$body
				.on("click", ".event-filters li", function () {
					event_filter = $(this).data("type");
					$(".event-filters li").removeClass("active");
					$(this).addClass("active");
					self.eventFilterDisplay(event_filter);
					$(".load-more").removeClass("all-loaded");
					self.loadmore();
				})
				.on("click", ".events .load-more span", function () {
					self.loadmore();
				});
		},

		eventFilterDisplay: function (filter) {
			if (filter === "all" || filter === "") {
				$(".event-tiles .event-tile").show();
			} else {
				$(".event-tiles .event-tile").hide();
				$(".event-tiles .event-tile")
					.filter("." + filter)
					.show();
			}
		},

		loadMoreData: {
			lastDate: "",
			lastType: "",
			loaded: [],
		},

		loadmore: function () {
			var self = this,
				event_filter = self.getActiveFilter();
			$(".load-more span").text("Loading More...");
			$.ajax({
				url: openHouseGlobal.ajaxurl,
				type: "POST",
				dataType: "json",
				data: {
					action: "load_more",
					event_filter: event_filter,
					loaded: self.loadMoreData.loaded.join(","),
					load_count: self.loadCount,
				},
				success: function (response) {
					var newItems = $(response.results);
					if (response.count !== 0) {
						$(".load-result").append(newItems);
						setTimeout(function () {
							self.eventFilterDisplay(event_filter);
						}, 1000);
						$.merge(self.loadMoreData.loaded, response.ids);
					}
					$(".load-more span").text("Load More");
					$(".load-more").toggleClass(
						"all-loaded",
						response.count < self.loadCount
					);
				},
				complete: function () {},
			});
		},

		getActiveFilter: function () {
			var self = this,
				event_filter = "";
			$(".event-filters")
				.find(".active")
				.each(function () {
					event_filter = $(this).data("type");
					if (event_filter === "all") {
						event_filter = "";
					}
				});
			return event_filter;
		},

		/*
		 *	News
		 */

		newsFilter: function () {
			var self = this;
			var news_filter = "all";
			self.$body
				.on("click", ".news-filters li", function () {
					news_filter = $(this).data("type");
					$(".news-filters li").removeClass("active");
					$(this).addClass("active");
					self.newsFilterDisplay(news_filter);
					$(".load-more").removeClass("all-loaded");
					self.loadmoreNews();
				})
				.on("click", ".news-and-media .load-more span", function () {
					self.loadmoreNews();
				});
		},

		newsFilterDisplay: function (filter) {
			if (filter === "all" || filter === "") {
				$(".news-tiles .news-tile").show();
			} else {
				$(".news-tiles .news-tile").hide();
				$(".news-tiles .news-tile")
					.filter("." + filter)
					.show();
			}
		},

		loadMoreNewsData: {
			lastDate: "",
			lastType: "",
			loaded: [],
		},

		loadmoreNews: function () {
			var self = this,
				news_filter = self.getActiveNewsFilter();
			$(".load-more span").text("Loading More...");
			$.ajax({
				url: openHouseGlobal.ajaxurl,
				type: "POST",
				dataType: "json",
				data: {
					action: "load_more_news",
					event_filter: news_filter,
					loaded: self.loadMoreNewsData.loaded.join(","),
					load_count: self.loadCount,
				},
				success: function (response) {
					var newItems = $(response.results); //,
					if (response.count !== 0) {
						$(".load-result").append(newItems);
						setTimeout(function () {
							self.eventFilterDisplay(news_filter);
						}, 1000);
						$.merge(self.loadMoreNewsData.loaded, response.ids);
					}
					$(".load-more span").text("Load More");
					$(".load-more").toggleClass(
						"all-loaded",
						response.count < self.loadCount
					);
				},
				complete: function () {},
			});
		},

		getActiveNewsFilter: function () {
			var self = this,
				news_filter = "";
			$(".news-filters")
				.find(".active")
				.each(function () {
					news_filter = $(this).data("type");
					if (news_filter === "all") {
						news_filter = "";
					}
				});
			return news_filter;
		},

		/*
		 *	Buildings
		 */

		categoriseBuildings: function () {
			var self = this;
			var $pool = $(".building-pool");
			var types = [];

			$(".buildings")
				.find(".building_precinct")
				.each(function () {
					$(this).removeClass("building_precinct");
					types.push($(this).attr("class"));
					$(this).addClass("building_precinct");
				});

			// categorise

			for (var i = 0; i < types.length; i++) {
				$(".building-pool")
					.find(".building-tile." + types[i])
					.each(function () {
						$(".buildings")
							.find(".building_precinct." + types[i])
							.find(".building-tiles")
							.append(this);
					});
			}

			// sort
			for (var i = 0; i < types.length; i++) {
				var mylist = $(".buildings")
					.find(".building_precinct." + types[i])
					.find(".building-tiles");
				var listitems = mylist.children(".building-tile").get();
				listitems.sort(function (a, b) {
					//return $(a).find('.building_id').text().toUpperCase().localeCompare($(b).find('.building_id').text().toUpperCase());
					a = $(a).find(".building_id").text();
					b = $(b).find(".building_id").text();
					a = a.length < 3 ? "0" + a : a;
					b = b.length < 3 ? "0" + b : b;
					return a.localeCompare(b);
				});
				$.each(listitems, function (idx, itm) {
					mylist.append(itm);
				});
			}
		},

		buildingFilter: function () {
			var self = this;
			$(".buildings-filter select").each(function () {
				$(this).selectpicker();
			});

			$("select.building-precinct").on("change", function () {
				self.buildingUpdateFilter();
			});
			$("select.building-types").on("change", function () {
				self.buildingUpdateFilter();
			});
			$(".button-list").on("click", function () {
				$(".button-list").addClass("active");
				$(".button-map").removeClass("active");
				self.buildingUpdateFilter();
				window.location.hash = "#list";
			});
			$(".button-map").on("click", function () {
				$(".button-list").removeClass("active");
				$(".button-map").addClass("active");
				self.buildingUpdateFilter();
				window.location.hash = "#map";
			});

			$(".day-filters")
				.find(".day-filter")
				.each(function () {
					$(this).on("click", function () {
						if ($(this).hasClass("active")) {
							$(this).removeClass("active");
						} else {
							$(".day-filters").find(".day-filter").removeClass("active");
							$(this).addClass("active");
						}
						self.buildingUpdateFilter();
					});
				});
		},

		buildingUpdateFilter: function () {
			var self = this,
				typeFilter = "all",
				precinctFilter = "all",
				dayFilter = "all";
			if ($("select.building-types option:selected").length != 0) {
				typeFilter = $("select.building-types option:selected").val();
			}
			if ($("select.building-precinct option:selected").length != 0) {
				precinctFilter = $("select.building-precinct option:selected").val();
			}
			if ($(".day-filters .active").length != 0) {
				dayFilter = $(".day-filters").find(".active").attr("data-date");
			}

			if ($(".button-list").hasClass("active")) {
				$(".buildings-map-wrapper").css({ height: 0, overflow: "hidden" });
				$(".buildings-wrapper").show();
			} else {
				$(".buildings-map-wrapper").css({
					height: "initial",
					overflow: "hidden",
				});
				$(".buildings-wrapper").hide();
			}

			if (self.map != null) {
				self.filterMarkers(self.map, precinctFilter, typeFilter, dayFilter);
				self.center_map(self.map);
			}

			if (typeFilter == "all") {
				typeFilter = "";
			} else {
				typeFilter = "." + typeFilter;
			}
			if (precinctFilter == "all") {
				precinctFilter = "";
			} else {
				precinctFilter = "." + precinctFilter;
			}
			if (dayFilter == "all") {
				dayFilter = "";
			} else {
				dayFilter = "." + dayFilter;
			}

			$(".buildings-wrapper")
				.find(".building_precinct")
				.each(function () {
					$(this).find(".building-tile").hide();
					$(this)
						.find(".building-tile" + typeFilter + precinctFilter + dayFilter)
						.show();

					var activeBuildings = $(this)
						.find(".building-tile")
						.filter(function () {
							return $(this).css("display") !== "none";
						}).length;
					$(this).show();
					if (activeBuildings == 0) {
						$(this).hide();
					}
				});
		},

		google_maps: function () {
			var self = this;
			window.initMap = () => {
				$(".map").each(function () {
					self.map = self.new_map($(this));
				});
			};
		},

		new_map: function ($el) {
			var self = this;
			// var
			var $markers = $el.find(".marker");
			var args = {
				zoom: 13,
				center: new google.maps.LatLng(0, 0),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: true,
				styles: [
					{
						featureType: "administrative",
						elementType: "labels.text.fill",
						stylers: [
							{
								color: "#444444",
							},
						],
					},
					{
						featureType: "landscape",
						elementType: "all",
						stylers: [
							{
								color: "#f2f2f2",
							},
						],
					},
					{
						featureType: "landscape",
						elementType: "geometry.fill",
						stylers: [
							{
								color: "#ffffff",
							},
						],
					},
					{
						featureType: "landscape.natural",
						elementType: "all",
						stylers: [
							{
								visibility: "on",
							},
						],
					},
					{
						featureType: "landscape.natural.terrain",
						elementType: "all",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "landscape.natural.terrain",
						elementType: "geometry.fill",
						stylers: [
							{
								visibility: "on",
							},
						],
					},
					{
						featureType: "poi",
						elementType: "all",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "poi.park",
						elementType: "all",
						stylers: [
							{
								visibility: "on",
							},
							{
								color: "#e3edc9",
							},
						],
					},
					{
						featureType: "poi.park",
						elementType: "geometry.fill",
						stylers: [
							{
								saturation: "0",
							},
							{
								hue: "#b8ff00",
							},
						],
					},
					{
						featureType: "poi.park",
						elementType: "labels",
						stylers: [
							{
								visibility: "simplified",
							},
							{
								color: "#000000",
							},
						],
					},
					{
						featureType: "poi.park",
						elementType: "labels.icon",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "road",
						elementType: "all",
						stylers: [
							{
								saturation: -100,
							},
							{
								lightness: 45,
							},
						],
					},
					{
						featureType: "road",
						elementType: "geometry.fill",
						stylers: [
							{
								color: "#e0e0e0",
							},
						],
					},
					{
						featureType: "road",
						elementType: "labels",
						stylers: [
							{
								visibility: "simplified",
							},
							{
								color: "#000000",
							},
						],
					},
					{
						featureType: "road",
						elementType: "labels.text",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "road",
						elementType: "labels.icon",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "road.highway",
						elementType: "all",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "road.highway",
						elementType: "labels",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "road.highway",
						elementType: "labels.icon",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "road.arterial",
						elementType: "geometry.fill",
						stylers: [
							{
								visibility: "on",
							},
						],
					},
					{
						featureType: "road.arterial",
						elementType: "labels.icon",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "road.local",
						elementType: "all",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "road.local",
						elementType: "geometry.fill",
						stylers: [
							{
								color: "#e0e0e0",
							},
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "road.local",
						elementType: "labels",
						stylers: [
							{
								visibility: "off",
							},
							{
								color: "#000000",
							},
						],
					},
					{
						featureType: "road.local",
						elementType: "labels.text.fill",
						stylers: [
							{
								color: "#ff0000",
							},
						],
					},
					{
						featureType: "transit",
						elementType: "all",
						stylers: [
							{
								visibility: "off",
							},
						],
					},
					{
						featureType: "transit",
						elementType: "labels",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
					{
						featureType: "transit",
						elementType: "labels.icon",
						stylers: [
							{
								hue: "#0092ff",
							},
							{
								saturation: "-50",
							},
						],
					},
					{
						featureType: "water",
						elementType: "all",
						stylers: [
							{
								color: "#46bcec",
							},
							{
								visibility: "on",
							},
						],
					},
					{
						featureType: "water",
						elementType: "geometry.fill",
						stylers: [
							{
								saturation: "-60",
							},
							{
								lightness: "60",
							},
							{
								color: "#d8e2e9",
							},
						],
					},
					{
						featureType: "water",
						elementType: "labels.text",
						stylers: [
							{
								visibility: "simplified",
							},
						],
					},
				],
			};
			// create map
			var map = new google.maps.Map($el[0], args);
			// add a markers reference
			map.markers = [];
			// add markers
			$markers.each(function () {
				self.add_marker($(this), map);
			});
			// center map
			self.center_map(map);
			// return
			return map;
		},

		add_marker: function ($marker, map) {
			var self = this;
			// var
			var latlng = new google.maps.LatLng(
				$marker.attr("data-lat"),
				$marker.attr("data-lng")
			);
			var precinct = $marker.attr("precinct");
			var building_type = $marker.attr("building-type");
			var building_type = $marker.attr("building-type");
			var saturday = $marker.attr("saturday");
			var sunday = $marker.attr("sunday");
			var label = $marker.attr("label");
			var image = "/wp-content/themes/openhouse/assets/images/icon-pin.png  ";
			// create marker
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				label: label,
				icon: image,
				precinct: precinct,
				building_type: building_type,
				saturday: saturday,
				sunday: sunday,
			});
			// add to array
			map.markers.push(marker);

			// if marker contains HTML, add it to an infoWindow
			if ($marker.html()) {
				// create info window
				var infowindow = new google.maps.InfoWindow({
					content: $marker.html(),
				});
				// show info window when marker is clicked
				google.maps.event.addListener(marker, "click", function () {
					if (self.lastWindow) self.lastWindow.close();
					infowindow.open(map, marker);
					self.lastWindow = infowindow;
				});
			}
		},

		center_map: function (map) {
			// vars
			var count_visible = 0;
			var latlng;
			var bounds = new google.maps.LatLngBounds();
			// loop through all markers and create bounds

			$.each(map.markers, function (i, marker) {
				if (marker.getVisible()) {
					latlng = new google.maps.LatLng(
						marker.position.lat(),
						marker.position.lng()
					);
					bounds.extend(latlng);
					count_visible = count_visible + 1;
				}
			});

			// only 1 marker?
			if (count_visible == 0) {
				latlng = new google.maps.LatLng(
					"-27.80498521171944",
					"153.80498521171944"
				);
				bounds.extend(latlng);
				map.setZoom(16);
				map.fitBounds(bounds);
			} else if (map.markers.length == 1 || count_visible == 1) {
				// set center of map
				map.setCenter(bounds.getCenter());
				map.setZoom(16);
			} else {
				// fit to bounds
				var zoom = map.getZoom();
				map.setZoom(zoom > 16 ? 16 : zoom);
				map.fitBounds(bounds);
			}
		},

		filterMarkers: function (map, precinctFilter, typeFilter, dayFilter) {
			var self = this;
			$.each(map.markers, function (i, marker) {
				var keep = false;
				// alert(((marker.saturday == 'true' && dayFilter == "saturday") || (marker.sunday == "true" && dayFilter == "sunday")));
				if (
					(typeof dayFilter == typeof undefined ||
						(marker.saturday == "true" && dayFilter == "saturday") ||
						(marker.sunday == "true" && dayFilter == "sunday") ||
						dayFilter == "all") &&
					(marker.precinct == precinctFilter || precinctFilter == "all") &&
					(marker.building_type == typeFilter || typeFilter == "all")
				) {
					keep = true;
				}
				marker.setVisible(keep);
			});
		},

		enableFavourites: function () {
			var self = this;

			$(".section-shortlist").on(
				"click",
				".simplefavorite-button",
				function () {
					$(this).closest(".building").slideUp();
					var gtmData = {
						event: "building_favouriting_event",
						category: "Shortlist",
						action: "Un-favourited",
						label: $(this).data("posttitle"),
						value: 0,
					};
					window.dataLayer.push(gtmData);
				}
			);

			$(".buildings, .building-before-content").on(
				"click",
				".simplefavorite-button",
				function () {
					var $btn = $(this),
						name = $btn.data("posttitle"),
						isFavorite = $btn.hasClass("active"),
						$universalModal = $("#modal-universal"),
						loggedin = self.$body.hasClass("logged-in"),
						gtmData = [];

					if (!loggedin) return;

					if (!isFavorite) {
						self.$body.addClass("modal-open");
						$(".content", $universalModal)
							.append(
								$(
									'<h2><i class="icon-tick"></i>Building added to favourites</h2><p>' +
										name +
										' has been added to your favourites.</p><a class="button" href="/favourites">View Favourites</a><a class="button" href="#modalClose">Add Buildings</a>'
								)
							)
							.addClass("favorite-add")
							.closest(".boh-modal")
							.addClass("narrow");
						$universalModal.fadeIn();
						window.dataLayer = window.dataLayer || [];
						gtmData = {
							event: "building_favouriting_event",
							category: "Shortlist",
							action: "Favourited",
							label: $btn.data("posttitle"),
							value: 1,
						};
					} else {
						gtmData = {
							event: "building_favouriting_event",
							category: "Shortlist",
							action: "Un-favourited",
							label: $btn.data("posttitle"),
							value: 0,
						};
					}
					window.dataLayer.push(gtmData);
				}
			);
		},

		buildSlick: function () {
			var $sliders = $(".slider"),
				opts = {
					arrows: true,
					autoplay: true,
					autoplaySpeed: 10000,
					dots: true,
				};

			$sliders.each(function () {
				if ($(this).data("slick")) {
					$(this).slick($.extend(true, opts, $(this).data("slick")));
				} else {
					$(this).slick(opts);
				}
			});
		},

		showmore: function () {
			$(".button-read-more").on("click", function () {
				$(this).toggleClass("active");
				if ($(this).hasClass("active")) {
					$(this).find("button").text("Read Less");
				} else {
					$(this).find("button").text("Read More");
				}
				var target = $(this).attr("target-data");
				if (typeof target !== typeof undefined && target !== false) {
					if ($(this).parents("." + target).length) {
						$(this)
							.parents("." + target)
							.toggleClass("showless");
					} else if ($(this).siblings("." + target).length) {
						$(this)
							.siblings("." + target)
							.toggleClass("showless");
					}
				}
			});
		},

		togglemap: function () {
			var self = this;

			if ($(location).attr("hash") == "#map") {
				$(".button-map").addClass("active");
				$(".button-list").removeClass("active");
			} else if ($(location).attr("hash") == "#list") {
				$(".button-list").addClass("active");
				$(".button-map").removeClass("active");
			}
			$(window).on("hashchange", function (e) {
				if ($(location).attr("hash") == "#map") {
					$(".button-map").addClass("active");
					$(".button-list").removeClass("active");
				} else if ($(location).attr("hash") == "#list") {
					$(".button-list").addClass("active");
					$(".button-map").removeClass("active");
				}
				self.buildingUpdateFilter();
			});
		},

		toogleUserForms: function () {
			var self = this;
			var params = new URLSearchParams(window.location.search);
			var action = params.get("action");
			var somresetpass = params.get("somresetpass");
			if (action == "rp" || somresetpass === "true") {
				$(".open-house-user-forms")
					.find(".nav-tabs li")
					.each(function () {
						$(this).removeClass("active");
						$(this).hide();
					});
				$("input#somfrp_user_info").attr("placeholder", "Email or Username");
				$(".open-house-user-forms").find(".nav-tabs li.forgot-password").show();
				$(".open-house-user-forms")
					.find(".nav-tabs li.forgot-password")
					.find("a")
					.click();
			}
			$("body")
				.on("click", ".toggle-login", function () {
					$("#user_login").attr("placeholder", "User Name");
					$("#user_pass").attr("placeholder", "Password");
					$(".open-house-user-forms")
						.find(".nav-tabs li")
						.each(function () {
							$(this).removeClass("active");
							$(this).show();
						});
					$(".open-house-user-forms")
						.find(".nav-tabs li.forgot-password")
						.hide();
					$(".open-house-user-forms")
						.find(".nav-tabs li.user-login")
						.find("a")
						.click();
				})
				.on("click", ".toggle-forgot-password", function () {
					$(".open-house-user-forms")
						.find(".nav-tabs li")
						.each(function () {
							$(this).removeClass("active");
							$(this).hide();
						});
					$("input#somfrp_user_info").attr("placeholder", "Email or Username");
					$(".open-house-user-forms")
						.find(".nav-tabs li.forgot-password")
						.show();
					$(".open-house-user-forms")
						.find(".nav-tabs li.forgot-password")
						.find("a")
						.click();
				});

			// add placeholder to reset password fields.
			$("input#som_new_user_pass").attr("placeholder", "New password");
			$("input#som_new_user_pass_again").attr(
				"placeholder",
				"Repeat new password"
			);
		},

		formUI: function () {
			var self = this;
			$("select.gfield_select").each(function () {
				$(this).selectpicker();
			});
			$(".gfield_radio input").each(function () {
				$(this).checkboxradio({
					icon: false,
				});
			});
			$(".ginput_container_checkbox")
				.find('input[type="checkbox"]')
				.each(function () {
					$(this).checkboxradio({
						icon: true,
					});
				});
			$(".ginput_container_fileupload").each(function () {
				if ($(this).find(".file-upload-text").length == 0) {
					$(this).append(
						'<input type="text" class="file-upload-text" placeholder="Photo" /> <input type="button" class="file-upload-button" value="Upload" />'
					);
				}
			});
			$(".ginput_container_fileupload")
				.find('[type="file"]')
				.each(function () {
					$(this).on("change", function () {
						$(this)
							.siblings('[type="text"]')
							.val(
								$(this)
									.val()
									.replace(/C:\\fakepath\\/i, "")
							);
					});
				});

			$(".file-upload-button").each(function () {
				$(this)
					.unbind("click")
					.on("click", function (e) {
						e.preventDefault();
						$(this).siblings('[type="file"]').click();
						e.stopPropagation();
						return false;
					});
			});
			$(".file-upload-text").each(function () {
				$(this).attr("disabled", "disabled");
			});

			$(".postcode-rule input").attr("pattern", "[0-9]{4}");

			$(".datepicker")
				.datepicker("option", {
					dateFormat: "dd/mm/yy",
					beforeShow: function (el, obj) {
						$("#ui-datepicker-div")
							.insertAfter($(el))
							.position({
								my: "left top",
								at: "left bottom",
								of: $(el),
							});

						setTimeout(function () {
							$("#ui-datepicker-div")
								.insertAfter($(el))
								.position({
									my: "left top",
									at: "left bottom",
									of: $(el),
								});
						}, 250);
					},
				})
				.datepicker("refresh")
				.datepicker("hide");
			$(".ui-datepicker").hide();

			$(document).bind("gform_confirmation_loaded", function () {
				//self.addServiceListeners();
			});
		},

		addServiceListeners: function () {
			$.ajax({
				url: openHouseGlobal.ajaxurl,
				type: "POST",
				dataType: "json",
				data: {
					action: "form_reload",
				},
				success: function (response) {
					var message = $(".boh-confirm-message");
					$(".form-section-wrapper").html(response.results);
				},
				complete: function (response) {},
			});
		},

		prevWinner: function () {
			var year = $(".prev-winners-filter").find("li:last").data("year");
			$(".prev-winners-filter").find("li:last").addClass("active");
			$(".prev_winners .row").not(":last").hide();

			$(".prev-winners-filter").on("click", "li", function () {
				$(".prev-winners-filter").find("li").removeClass("active");
				year = $(this).data("year");
				$(this).addClass("active");
				$(".prev_winners .row").each(function () {
					$(this).hide();
					if ($(this).hasClass("year-" + year)) {
						$(this).show();
					}
				});
			});
		},

		/*
		 *	Modal
		 */

		modalInit: function () {
			var self = this;
			this.$body
				.on("click", "[data-modal]", function (e) {
					e.preventDefault();
					self.modalAction("open", this);
				})
				.on(
					"click",
					'a[href="#modalClose"],[data-action="modal-close"]',
					function (e) {
						e.preventDefault();
						self.modalAction("close", this);
					}
				);
		},

		modalAction: function (action, link) {
			var self = this,
				$modalContainer = $(".modal-container"),
				$universalModal = $("#modal-universal"),
				$competitionModal = $("#modal-competition"),
				$link = $(link),
				slug = $link.data("modal"),
				data = $link.data("modal-data");

			if (action === "open" && slug === "competition_modal") {
				$competitionModal.fadeIn();
				self.$body.addClass("modal-open");
				self.formUI();
			} else if (action === "open") {
				$(".loading-modal").removeClass("loading-modal");
				$link.addClass("loading-modal");

				$universalModal.addClass("loading").fadeOut(function () {
					$(".content", this).remove();
					$universalModal
						.find(".boh-modal")
						.append($('<div class="content"></div>'))
						.end()
						.fadeIn();
				});

				$.ajax({
					url: openHouseGlobal.ajaxurl,
					type: "POST",
					dataType: "json",
					data: {
						action: slug,
						data: data ? data : {},
					},
					success: function (response) {
						//$universalModal.fadeOut(function(){ $(this).remove(); });
						$(response.results)
							.find(".gform_wrapper")
							.show()
							.end()
							.appendTo($(".content", $universalModal))
							.hide()
							.slideDown();
						if (response.modalclass) {
							$(".boh-modal", $universalModal).addClass(response.modalclass);
						}
						$universalModal.removeClass("loading");
						self.buildSlick();
						self.$body.addClass("modal-open");
						self.formUI();
					},
					complete: function () {
						$link.removeClass("loading-modal");
					},
				});
			} else if (action === "close") {
				$competitionModal.fadeOut();
				$universalModal.fadeOut(function () {
					$(".content", this).remove();
					$(".boh-modal", this)
						.removeAttr("class")
						.addClass("boh-modal")
						.append($('<div class="content"></div>'));
				});
				self.$body.removeClass("modal-open");
				$(".loading-modal").removeClass("loading-modal");
			}
		},

		scrollSpyEnable: function () {
			$('.before-content[data-spy="affix"]')
				.on("affixed.bs.affix", function () {
					console.log("affix");
					$(".before-content-spacer").height($(".before-content").height());
				})
				.on("affixed-top.bs.affix", function () {
					console.log("affix top");
					$(".before-content-spacer").height(0);
				});
		},

		updateFavCount: function () {
			$(document).on(
				"favorites-updated-single",
				function (event, favorites, post_id, site_id, status) {
					$.ajax({
						url: openHouseGlobal.ajaxurl,
						type: "POST",
						dataType: "json",
						data: {
							action: "update_fav_count",
						},
						success: function (response) {
							$(".user-favourite-count").text(response.results);
							if (response.results == 0) {
								$(".user-favourite-count").hide();
							} else {
								$(".user-favourite-count").show();
							}
						},
						complete: function (response) {},
					});
				}
			);
		},

		searchForm: function () {
			var self = this;
			if ($(window).width() < self.mobileWidth) {
				$(".search-form-wrapper").addClass("active");
			} else {
				$(".search-toggle").on("click", function () {
					$(".search-form-wrapper").toggleClass("active");
				});
			}
			$(".search-form-wrapper input").attr("placeholder", "Search...");
			$(window).resize(function () {
				if ($(window).width() < self.mobileWidth) {
					$(".search-form-wrapper").addClass("active");
				} else {
					$(".search-form-wrapper").removeClass("active");
					$(".search-toggle").on("click", function () {
						$(".search-form-wrapper").toggleClass("active");
					});
				}
			});
		},
	});
})(jQuery);

jQuery(document).ready(function () {
	openHouse.init();
});
