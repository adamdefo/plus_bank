/**
 * Aleksey Kondratyev
 *
 */
;(function(window) {

	'use strict';

	var extend = function (a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	};

	var Calculator = function (selector, params) {

		this._params = extend({}, this._params);
		extend(this._params, params);

		this.el = document.querySelector(selector);
		// инпуты
		this.inputs = this.el.querySelectorAll('.calculator__input');
		// инпут Сумма
		this.summaCtrl = this.inputs[0];
		// инпут Пополнение
		// this.refilCtrl = this.inputs[1];
		// Срок
		this.period = this.el.querySelector('#calculator-period');
		// свичеры
		this.switchers = this.el.querySelectorAll('.calculator__switcher > .switcher');
		// this.monthSwitchCtrl = this.switchers[0].querySelectorAll('.switcher__radio');
		this.percentSwitchCtrl = this.switchers[0].querySelectorAll('.switcher__radio');
		// 3/6/12
		this.month;
		// в конце срока/ежемесячно
		this.percent;
		// итого
		this.$total = this.el.querySelector('#total');
		this.total;
		// доход
		this.$dohod = this.el.querySelector('#dohod');
		this.dohod;
		// ставка
		this.$stavka = this.el.querySelector('#stavka');
		this.stavka;

		this._init();
	};

	Calculator.prototype._params = {
		summa: 200000, //
		refil: 2000, //
		month: 12,
		percent: 'every',
		stavka: 17
	};

	Calculator.prototype._init = function () {
		this.summaCtrl.value = this._params.summa;
		// this.refilCtrl.value = this._params.refil;
		this.month = this._params.month;
		this.percent = this._params.percent;

		this._initSwitchers();
		this._initEvents();
		this.calculate();
	};

	// установка активного пункта у свичеров
	Calculator.prototype._initSwitchers = function () {
		var self = this;
		// this.monthSwitchCtrl.forEach(function(ctrl) {
		// 	ctrl.checked = +ctrl.value === self.month;
		// });

		this.percentSwitchCtrl.forEach(function(ctrl) {
			ctrl.checked = ctrl.value === self.percent;
		});
	};

	Calculator.prototype.updateInputValue = function (input, value) {
		input.value = value;
	};

	Calculator.prototype._initEvents = function () {
		var self = this;

		this.summaCtrl.addEventListener('change', function() {
			self.calculate();
		});

		// this.refilCtrl.addEventListener('change', function() {
		// 	self.calculate();
		// });

		// this.monthSwitchCtrl.forEach(function(ctrl) {
		// 	ctrl.addEventListener('change', function(ev) {
		// 		self.month = this.value;
		// 		self.calculate();
		// 	});
		// });

		this.percentSwitchCtrl.forEach(function(ctrl) {
			ctrl.addEventListener('change', function(ev) {
				self.percent = this.value;
				self.calculate();
			});
		});

		// this.checkbox.addEventListener('change', function() {
		// 	if (this.checked) {
		// 		classie.add(this, '_checked');
		// 		self._params.stavka += 1;
		// 	} else {
		// 		classie.remove(this, '_checked');
		// 		self._params.stavka -= 1;
		// 	}
		// 	self.calculate();
		// });

		Calculator.prototype.calculate = function () {
			this.$stavka.innerText = this._params.stavka + '%';
			this.total = Number(this.summaCtrl.value);
			// this.total = Number(this.summaCtrl.value) + Number(this.refilCtrl.value*this.month);
			this.$total.innerText = this.total;
			// this.dohod = Number(this.refilCtrl.value*this.month);
			// if (this.checkbox.checked) {
			// 	this.dohod += this.dohod * 0.01;
			// }
			this.$dohod.innerText = this.dohod;
		};
	};

	window.Calculator = Calculator;

})(window);
