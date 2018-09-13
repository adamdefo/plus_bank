// проверяет значение в инпуте
var validateInput = function(input) {
	var error = 0
	if (!input.value) {
		error++;
	}
	return !error;
}

// валидатор на email
var validateEmail = function(email) {
	var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return reg.test(email);
}

$(function() {
	var tabs = new Tabs('.js-tabs'); // табы с описанием программ
	var phone = '88124253797';
	// HEADER
	var headerHeight = $('.js-header').height(),
		$nav = $('.js-nav'),
		$navLinks = $nav.find('.nav__link'),
		$scrollItems = $navLinks.map(function () {
			var item = $($(this).attr('href'));
			if (item.length) {
				return item;
			}
		});

	// скролинг страницы и установка активного пункта навигации
	window.addEventListener( 'scroll', function( event ) {
		var scrollTop = $(this).scrollTop(),
			fromTop = scrollTop + $nav.outerHeight() + headerHeight,
			cur = $scrollItems.map(function () {
				if ($(this).offset().top < (fromTop + 100))
					return this;
			});

		cur = cur[cur.length - 1];
		var id = (cur && cur.length) ? cur.prop('id') : '';

		$navLinks.removeClass('_active').filter("[href='#" + id + "']").addClass('_active');
	}, false );

	// ПРОКРУТКА ПО SECTION
	$navLinks.on('click', function (e) {
		e.preventDefault();
		var target = $(this).attr('href'),
			offset,
			delta;

		if (!target.length)
			return false;
		delta = ($(this).data('delta-offset')) ? parseInt($(this).data('delta-offset')) : 0;
		offset = $(target).offset().top - headerHeight + delta;

		if (target == '#calculator') {
			offset -= 100;
		}

		$('html, body').animate({scrollTop: offset}, 750);
	});

	// инициализация калькулятора и наблюдателя за скролом
	var watcherSP = new WatcherScrollPage();
	var calcApp = new Calculator('#calculator');

	// кнопки Распечатать, Сохранить схему проезда
	var btnSaveScheme = $('.js-save-scheme');

	// ползунок "сумма"
	var $summaSlider = $('#summa-slider');
	$summaSlider.rangeslider({
		polyfill: false,
		onSlide: function(position, value) {
			calcApp.updateInputValue(calcApp.$summaCtrl, value, 'summa');
			calcApp.calculate();
			btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark))
			tabs.setActiveTab(calcApp.selectedTariff.id);
			calcInputSumma.set(value);
			totalSumma.set(calcApp.selectedTariff.total);
		},
		onSlideEnd: function(position, value) {}
	});
	var $summaInput = $('.summa');
	$summaInput.on('change', function () {
		$summaSlider.val(this.value).change();
		btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark))
		tabs.setActiveTab(calcApp.selectedTariff.id);
	});

	// ползунок "пополнение в месяц"
	var $refilSlider = $('#refil-slider');
	$refilSlider.rangeslider({
		polyfill: false,
		onSlide: function(position, value) {
			calcApp.updateInputValue(calculator.$refilCtrl, value, 'refil');
			calcApp.calculate();
			btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, $('.header__phone > span').text()))
		},
		onSlideEnd: function(position, value) {}
	});

	// селект со Сроком вклада
	var $calculatorSelect = $('.js-calculator-period');
	$calculatorSelect.on('change', function () {
		btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark));
		tabs.setActiveTab(calcApp.selectedTariff.id);
		totalSumma.set(calcApp.selectedTariff.total);
	});

	// маска номера телефона
	$('.js-phone').mask('+7 (999) 999-9999');

	var print = $('.js-print-save');
	print.on('click', function () {
		var header = $calcProgramModal.find('.md__header').html();
		var content = $calcProgramModal.find('.md__content').html();
		var footer = $calcProgramModal.find('.md__footer .md__footer-itogo').html();
		var html = header + content + footer;

		var win = window.open('','','left=0,top=0,width=600,height=800,toolbar=0,scrollbars=1,status=0');
		win.document.write(html);
		win.focus();
		win.print();
		win.close();
	});

	// МОДАЛКИ ДЛЯ КАЛЬКУЛЯТОРА
	var $calcProgramModal = $('.js-md_calculator-program'); // модалка с расчетом
	$('.js-show-calculator-modal').on('click', function() {
		var tariff = calcApp.selectedTariff;
		$('body').addClass('_overflow');
		$calcProgramModal.addClass('_show');
		$calcProgramModal.find('.js-program-name').text(tariff.name); // название тарифа
		$calcProgramModal.find('.js-summa').text(calcApp._params.summa); // сумма сбережения
		$calcProgramModal.find('.js-srok').text(calcApp._params.period + ' мес.'); // срок сбережения
		$calcProgramModal.find('.js-dohod').text(Math.floor(tariff.profit)); // доход по программе
		$calcProgramModal.find('.js-percent-type').text(calcApp._params.percentType === 'every-month' ? 'ежемесячно' : 'в конце срока'); // выплата процентов
		$calcProgramModal.find('.js-stavka').text(tariff.rate + '%'); // процентная ставка
		$calcProgramModal.find('.js-total-itogo').text(Math.floor(tariff.total)); // итого

		var tbody = $calcProgramModal.find('.js-calculator-tbl tbody');
		tbody.html(calcApp.generateTblReport(tariff));
	});

	var $calcUsloviyaModal = $('.js-md_usloviya'); // модалка с условиями
	$('.js-show-usloviya-modal').on('click', function() {
		$('body').addClass('_overflow');
		$calcUsloviyaModal.addClass('_show');
	});

	var $calcMapModal = $('.js-md_map'); // модалка с картой
	$('.js-look-adress').on('click', function() {
		$('body').addClass('_overflow');
		$calcMapModal.addClass('_show');
	});

	// закрытие модалки при нажатие на overlay
	$('.js-md-close').on('click', function() {
		$('body').removeClass('_overflow');
		$(this).parent().parent().parent().removeClass('_show');
	});

	// закрытие модалки при нажатие на крестик
	$('.md__overlay').on('click', function() {
		$('body').removeClass('_overflow');
		$(this).parent().removeClass('_show');
	});


	// FAQ
	var faqList = document.getElementById('faq-list'),
		faqItemQuestion = [].slice.call(faqList.querySelectorAll('.faq__question'));
	
	faqItemQuestion.forEach(function(item) {
		item.addEventListener('click', function (ev) {
			ev.preventDefault();
			if (classie.has(this, '_active')) {
				classie.remove(this, '_active')
			} else {
				var activeItem = faqItemQuestion.filter(function (item) {
					return classie.has(item, '_active');
				})

				if (activeItem.length) {
					classie.remove(activeItem[0], '_active')
				}
				classie.add(this, '_active')
			}	
		});
	});

	// ПЕРЕКЛЮЧАТЕЛЬ ОФИСОВ НА КАРТЕ
	var activePlacemark = '';
	var pathToPlaceMarkIcon = './img/';
	var $mapSwitcherList = [].slice.call(document.querySelectorAll('.js-map-switch')),
		$mapSwitcher = $('.js-map-switch'),
		$mapSwitcherContent = $('.map__switcher-content');
	var activeMapSwitcher = 0;

	$($mapSwitcher[activeMapSwitcher]).addClass('_active');
	$($mapSwitcherContent[activeMapSwitcher]).addClass('_active');
	$mapSwitcher.on('click', function (ev) {
		ev.preventDefault();
		activeMapSwitcher = $(this).index();
		$mapSwitcher.removeClass('_active');
		$(this).addClass('_active');
		$mapSwitcherContent.removeClass('_active');
		$($mapSwitcherContent[activeMapSwitcher]).addClass('_active');

		$tabsMapSwitcherItem.removeClass('_active');
		$tabsMapContent.removeClass('_active');
		$($tabsMapSwitcherItem[activeMapSwitcher]).addClass('_active');
		$($tabsMapContent[activeMapSwitcher]).addClass('_active');

		setActivePlacemark(yaMap, $mapSwitcherList.length, this.dataset.coords);
		setActivePlacemark(yaMapModal, $mapSwitcherList.length, this.dataset.coords);
		btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark));
	});


	// сбрасывает выделения у меток на карте
	var resetActivePlacemark = function (map, count) {
		for (var i = 0; i < count; i++) {
			map.geoObjects.get(i).options.set('iconImageHref', pathToPlaceMarkIcon + 'metka.png');;
		}
	}

	var setActivePlacemark = function (map, count, coords) {
		resetActivePlacemark(map, count);
		// выделяю метку
		var placemark = map.geoObjects.get(activeMapSwitcher);
		placemark.options.set('iconImageHref', pathToPlaceMarkIcon + 'metka_active.png');
		// смещаю карту на центр
		activePlacemark = coords;
		var mapCenter = coords.split(',');
		map.setCenter([mapCenter[0],mapCenter[1]]);
	}

	// центр карты
	var yaMapCenter = [55.75467204818265,37.621772908664276];
	
	var yaMap;
	ymaps.ready(initMap);
	function initMap() { 
		yaMap = new ymaps.Map('map', {
			center: yaMapCenter,
			zoom: 13,
			controls: ['zoomControl']
		});
		$mapSwitcherList.forEach(function (mark, index) {
			var placeMark = new ymaps.Placemark(
				mark.dataset.coords.split(','),
				{
					hideIcon: false,
					hintContent: 'Подсказка' + index
					// balloonContent: 'Содержимое метки' + index
				},
				{
					iconLayout: 'default#image',
					iconImageHref: pathToPlaceMarkIcon + 'metka.png',
					iconImageSize: [46, 63],
					iconImageOffset: [-20, -54]
				}
			);
			yaMap.geoObjects.add(placeMark);
		});
		activePlacemark = $mapSwitcherList[0].dataset.coords;
		btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark));
		// делаю первую метку активной
		yaMap.geoObjects.get(0).options.set('iconImageHref', pathToPlaceMarkIcon + 'metka_active.png');
		yaMap.behaviors.disable('scrollZoom');
	}

	// карта яндекс в модалке
	var yaMapModal;
	ymaps.ready(initMapModal);
	function initMapModal() { 
		yaMapModal = new ymaps.Map('map-modal', {
			center: yaMapCenter,
			zoom: 13,
			controls: ['zoomControl']
		});
		$mapSwitcherList.forEach(function (mark, index) {
			var placeMark = new ymaps.Placemark(
				mark.dataset.coords.split(','),
				{
					hideIcon: false,
					hintContent: 'Подсказка' + index
					// balloonContent: 'Содержимое метки' + index
				},
				{
					iconLayout: 'default#image',
					iconImageHref: pathToPlaceMarkIcon + 'metka.png',
					iconImageSize: [46, 63],
					iconImageOffset: [-20, -54]
				}
			);
			yaMapModal.geoObjects.add(placeMark);
		});
		// делаю первую метку активной
		yaMapModal.geoObjects.get(0).options.set('iconImageHref', pathToPlaceMarkIcon + 'metka_active.png');
		yaMapModal.behaviors.disable('scrollZoom');
	}

	// табы в модалке с картой
	var $tabsMap = $('.js-tabs-map'),
		$tabsMapSwitcherItem = $tabsMap.find('.tabs__switcher-item'),
		$tabsMapContent = $tabsMap.find('.tabs__item');
	
	$($tabsMapSwitcherItem[activeMapSwitcher]).addClass('_active');
	$($tabsMapContent[activeMapSwitcher]).addClass('_active');
	$tabsMapSwitcherItem.on('click', function(ev) {
		ev.preventDefault();
		activeMapSwitcher = $(this).index();
		$tabsMapSwitcherItem.removeClass('_active');
		$(this).addClass('_active');
		$tabsMapContent.removeClass('_active');
		$($tabsMapContent[activeMapSwitcher]).addClass('_active');

		$mapSwitcher.removeClass('_active');
		$mapSwitcherContent.removeClass('_active');
		$($mapSwitcher[activeMapSwitcher]).addClass('_active');
		$($mapSwitcherContent[activeMapSwitcher]).addClass('_active');

		setActivePlacemark(yaMap, $mapSwitcherList.length, this.dataset.coords);
		setActivePlacemark(yaMapModal, $mapSwitcherList.length, this.dataset.coords);
		btnSaveScheme.attr('href', calcApp.generatePdfHref(calcApp.selectedTariff, phone, activePlacemark));
	});


	var calcInputSumma = new AutoNumeric('.js-calc-input-summa',
	{
		selectNumberOnly: true,
		decimalPlaces : 0,
		digitGroupSeparator : ' ',
		modifyValueOnWheel: false
	});

	// $('.js-autonum').autoNumeric({decimalPlaces: 0, digitGroupSeparator: ' '});
});
