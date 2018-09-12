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

	var watcherSP = new WatcherScrollPage();
	var calcApp = new Calculator('#calculator');
	// ползунок "сумма"
	var $summaSlider = $('#summa-slider');
	$summaSlider.rangeslider({
		polyfill: false,
		onSlide: function(position, value) {
			calcApp.updateInputValue(calcApp.$summaCtrl, value, 'summa');
			calcApp.calculate();
		},
		onSlideEnd: function(position, value) {}
	});
	var $summaInput = $('.summa');
	$summaInput.on('change', function () {
		$summaSlider.val(this.value).change();
	});
	// ползунок "пополнение в месяц"
	var $refilSlider = $('#refil-slider');
	$refilSlider.rangeslider({
		polyfill: false,
		onSlide: function(position, value) {
			calcApp.updateInputValue(calculator.$refilCtrl, value, 'refil');
			calcApp.calculate();
		},
		onSlideEnd: function(position, value) {}
	});

	// маска номера телефона
	$('.js-phone').mask('+7 (999) 999-9999');

	// var $answerForm = document.querySelector('.answer-form'),
	// 	$answerFormPhone = $answerForm.querySelector('.answer-form__phone > strong'),
	// 	$answerFormBtn = $answerForm.querySelector('.answer-form__btn > button');

	// // заявка на обратный звонок
	// var $callbackForm = document.querySelector('.js-form-callback'), // форма
	// 	$clientName = $callbackForm.querySelector('input[name=name]'), // инпут Имя
	// 	$clientPhone = $callbackForm.querySelector('input[name=phone]'), // инпут Номер телефона
	// 	$clientIsAgree = $callbackForm.querySelector('input[name=isAgree]'), // чекбокс
	// 	$sendCallback = $callbackForm.querySelector('.js-send-callback'); // кнопка Перезвоните

	// var validateCallbackForm = function() {
	// 	if (validateInput($clientName) && validateInput($clientPhone) && $clientIsAgree.checked) {
	// 		$sendCallback.disabled = false;
	// 	} else {
	// 		$sendCallback.disabled = true;
	// 	}
	// }

	// $clientName.addEventListener('blur', function() {
	// 	validateCallbackForm();
	// });

	// $clientPhone.addEventListener('blur', function() {
	// 	validateCallbackForm();
	// });

	// $clientIsAgree.addEventListener('change', function() {
	// 	validateCallbackForm();
	// });

	// var resetForm = function() {
	// 	setTimeout(function () {
	// 		classie.remove($callbackForm, '_hide');
	// 		classie.remove($answerForm, '_show');
	// 		$('.md__header > .title').text('Заявка на обратный звонок');
	// 		$clientName.value = '';
	// 		$clientPhone.value = '';
	// 		$clientIsAgree.checked = false;	
	// 		$sendCallback.disabled = true;
	// 	}, 300);
	// }

	// $sendCallback.addEventListener('click', function(ev) {
	// 	ev.preventDefault();
	// 	var error = 0;
	
	// 	var name = $clientName.value;
	// 	if (!name) {
	// 		classie.add($clientName, '_error');
	// 		error++;
	// 	};
	
	// 	var phone = $clientPhone.value;
	// 	if (!phone) {
	// 		classie.add($clientPhone, '_error');
	// 		error++;
	// 	};
	
	// 	if(!error) {
	// 		$.ajax({
	// 			async: true,
	// 			type: "POST",
	// 			url: "/ajax/callback.php",
	// 			dataType: "json",
	// 			data: {name: name, phone: phone},
	// 			success: function(data) {
	// 				$('.md__header > .title').text('Спасибо');
	// 				classie.add($callbackForm, '_hide');
	// 				classie.add($answerForm, '_show');
	// 				$answerFormPhone.innerText = phone;
	// 			},
	// 			error: function(data) {
	// 				console.log(data)
	// 			}
	// 		});
	// 	};

	// 	return false;
	// });

	// $('.js-show-callback').on('click', function() {
	// 	$('.md').addClass('_show');
	// });

	// закрывает модалку с формой обратного звонка
	// $answerFormBtn.addEventListener('click', function() {
	// 	$('.md-callback').removeClass('_show');
	// 	resetForm();
	// });

	// табы
	var $tabs = $('.js-tabs'),
		$tabsSwitcher = $tabs.find('.tabs__switcher'),
		$tabsSwitcherItem = $tabsSwitcher.find('.tabs__switcher-item'),
		$tabsContent = $tabs.find('.tabs__item');
	
	$tabsSwitcherItem.on('click', function() {
		$tabsSwitcherItem.removeClass('_active');
		$(this).addClass('_active');
		$tabsContent.removeClass('_active');
		$($tabsContent[$(this).index()]).addClass('_active');
	});
	
	var print = $('.js-print-save');
	print.on('click', function () {
		window.print();
	});

	// МОДАЛКИ ДЛЯ КАЛЬКУЛЯТОРА
	var $calcProgramModal = $('.js-md_calculator-program'); // модалка с расчетом
	$('.js-show-calculator-modal').on('click', function() {
		var tariff = calcApp.tariffs[$(this).index()];
		var tariffName = this.dataset.tariff;
		$('body').addClass('_overflow');
		$calcProgramModal.addClass('_show');
		$calcProgramModal.find('.js-program-name').text(tariffName); // название тарифа
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

	// закрытие модалки при нажатие на overlay
	$('.js-md-close').on('click', function() {
		$('body').removeClass('_overflow');
		$(this).parent().parent().parent().removeClass('_show');
		// resetForm();
	});

	// закрытие модалки при нажатие на крестик
	$('.md__overlay').on('click', function() {
		$('body').removeClass('_overflow');
		$(this).parent().removeClass('_show');
		// resetForm();
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
	var $mapSwitcherList = [].slice.call(document.querySelectorAll('.js-map-switch'));
		$mapSwitcherContent = $('.map__switcher-content');

	classie.add($mapSwitcherList[0], '_active')
	$($mapSwitcherContent[0]).addClass('_active');
	$mapSwitcherList.forEach(function (el, index) {
		el.addEventListener('click', function (ev) {
			ev.preventDefault();
			var activeItem = $mapSwitcherList.filter(function (item) {
				return classie.has(item, '_active');
			})

			if (activeItem.length) {
				classie.remove(activeItem[0], '_active')
			}
			classie.add(this, '_active')

			$mapSwitcherContent.removeClass('_active');
			$($mapSwitcherContent[index]).addClass('_active');
			// сбрасываю выделение с меток на карте
			resetActivePlacemark($mapSwitcherList.length);
			// выделяю метку
			yaMap.geoObjects.get(index).options.set('iconImageHref', '../img/metka_active.png');
			// смещаю карту на центр
			var mapCenter = this.dataset.coords.split(',');
			yaMap.setCenter([mapCenter[0],mapCenter[1]]);
		});
	});

	// сбрасывает выделения у меток на карте
	var resetActivePlacemark = function (count) {
		for (var i = 0; i < count; i++) {
			yaMap.geoObjects.get(i).options.set('iconImageHref', '../img/metka.png');;
		}
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
					iconImageHref: '../img/metka.png',
					iconImageSize: [46, 63],
					iconImageOffset: [-20, -54]
				}
			);
			yaMap.geoObjects.add(placeMark);
		});
		// делаю первую метку активной
		yaMap.geoObjects.get(0).options.set('iconImageHref', '../img/metka_active.png');
		yaMap.behaviors.disable('scrollZoom');
	}
});
