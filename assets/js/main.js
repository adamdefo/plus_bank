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
	var calculator = new Calculator('#calculator');

	$('#summa').rangeslider({
		polyfill: false,
		onInit: function() {
			this.value = calculator._params.summa;
		},
		onSlide: function(position, value) {
			calculator.updateInputValue(calculator.summaCtrl, value);
			calculator.calculate();
		},
		onSlideEnd: function(position, value) {}
	});

	$('#refil').rangeslider({
		polyfill: false,
		onInit: function() {
			this.value = calculator._params.refil;
		},
		onSlide: function(position, value) {
			calculator.updateInputValue(calculator.refilCtrl, value);
			calculator.calculate();
		},
		onSlideEnd: function(position, value) {}
	});

	// маска номера телефона
	$('.js-phone').mask('+7 (999) 999-9999');

	var $answerForm = document.querySelector('.answer-form'),
		$answerFormPhone = $answerForm.querySelector('.answer-form__phone > strong'),
		$answerFormBtn = $answerForm.querySelector('.answer-form__btn > button');

	// заявка на обратный звонок
	var $callbackForm = document.querySelector('.js-form-callback'), // форма
		$clientName = $callbackForm.querySelector('input[name=name]'), // инпут Имя
		$clientPhone = $callbackForm.querySelector('input[name=phone]'), // инпут Номер телефона
		$clientIsAgree = $callbackForm.querySelector('input[name=isAgree]'), // чекбокс
		$sendCallback = $callbackForm.querySelector('.js-send-callback'); // кнопка Перезвоните

	var validateCallbackForm = function() {
		if (validateInput($clientName) && validateInput($clientPhone) && $clientIsAgree.checked) {
			$sendCallback.disabled = false;
		} else {
			$sendCallback.disabled = true;
		}
	}

	$clientName.addEventListener('blur', function() {
		validateCallbackForm();
	});

	$clientPhone.addEventListener('blur', function() {
		validateCallbackForm();
	});

	$clientIsAgree.addEventListener('change', function() {
		validateCallbackForm();
	});

	var resetForm = function() {
		setTimeout(function () {
			classie.remove($callbackForm, '_hide');
			classie.remove($answerForm, '_show');
			$('.md__header > .title').text('Заявка на обратный звонок');
			$clientName.value = '';
			$clientPhone.value = '';
			$clientIsAgree.checked = false;	
			$sendCallback.disabled = true;
		}, 300);
	}

	$sendCallback.addEventListener('click', function(event) {
		event.preventDefault();
		var error = 0;
	
		var name = $clientName.value;
		if (!name) {
			classie.add($clientName, '_error');
			error++;
		};
	
		var phone = $clientPhone.value;
		if (!phone) {
			classie.add($clientPhone, '_error');
			error++;
		};
	
		if(!error) {
			$.ajax({
				async: true,
				type: "POST",
				url: "/ajax/callback.php",
				dataType: "json",
				data: {name: name, phone: phone},
				success: function(data) {
					$('.md__header > .title').text('Спасибо');
					classie.add($callbackForm, '_hide');
					classie.add($answerForm, '_show');
					$answerFormPhone.innerText = phone;
				},
				error: function(data) {
					console.log(data)
				}
			});
		};

		return false;
	});

	$('.js-show-callback').on('click', function() {
		$('.md').addClass('_show');
	});

	$('.js-md-close').on('click', function() {
		$(this).parent().parent().parent().removeClass('_show');
		resetForm();
	});

	$('.md__overlay').on('click', function() {
		$(this).parent().removeClass('_show');
		resetForm();
	});

	// закрывает модалку с формой обратного звонка
	$answerFormBtn.addEventListener('click', function() {
		$('.md-callback').removeClass('_show');
		resetForm();
	});

	// мобильное меню
	var $burger = document.querySelector('.burger'),
		$mobileNav = document.querySelector('.nav-xs');
		$mobileNavClose = document.querySelector('.js-nav-close');

	$burger.addEventListener('click', function(event) {
		classie.add($mobileNav, '_show');
		classie.add(document.body, '_overflow');
	});

	$mobileNavClose.addEventListener('click', function(event) {
		classie.remove($mobileNav, '_show');
		classie.remove(document.body, '_overflow');
	});

});

var myMap, myPlacemark;
ymaps.ready(initMap);
function initMap() { 
	myMap = new ymaps.Map("map", {
		center: [54.32255725910652,48.401403088097844],
		zoom: 18,
		controls: ['zoomControl']
	});
	myPlacemark = new ymaps.Placemark(
		myMap.getCenter(), 
		{
			hintContent: 'Подсказка',
			balloonContent: 'Содержимое метки'
		},
		{
			iconLayout: 'default#image',
            iconImageHref: '../img/point_hover.png',
            iconImageSize: [54, 78],
            iconImageOffset: [-20, -54]
		}
	);
	myMap.geoObjects.add(myPlacemark);
	myMap.behaviors.disable('scrollZoom');
};
