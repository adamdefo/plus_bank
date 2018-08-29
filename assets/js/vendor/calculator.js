/**
 * 
 * @author Aleksey Kondratyev
 * @description Кальлятор по расчёту доходов по вкладам
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

		this.$el = document.querySelector(selector);

		// сумма
		this.$summaCtrl = this.$el.querySelector('.summa');
		this.$summaSlider = this.$el.querySelector('#summa-slider');

		// пополнение в месяц
		this.$refilCtrl = this.$el.querySelector('.refil');

		// селект со сроками
		this.$periodSelect = this.$el.querySelector('#period-select');

		// свичер
		this.$switcherPercentEl = this.$el.querySelector('#switcher-percent');
		this.$switcherPercentCtrl = this.$switcherPercentEl.querySelectorAll('.switcher__radio');
		this.percentType;

		// сколько получит клиент
		this.$totalEl = this.$el.querySelector('.total');
		this.total = 0;

		// общий доход
		this.$profitEl = this.$el.querySelector('.profit'); 
		this.profit = 0;

		// доход в месяц 
		this.$profitInMonthEl = this.$el.querySelector('.profit-in-month');
		this.profitInMonth;

		// ставка
		this.$rateEl = this.$el.querySelector('.rate');

		// срок
		this.$periodEl = this.$el.querySelector('.period');

		this._init();
	};

	Calculator.prototype._params = {
		summa: 1000000, // сумма
		refil: 1000, // пополнение
		percentType: 'every-month', // выплата процентов
		rate: 8,
		period: 6 // срок
	};

	Calculator.prototype._init = function () {
		this._initCtrls();
		this._initEvents();
		this.calculate();
	};

	Calculator.prototype._initCtrls = function () {
		var self = this;

		// проставляет в инпуте значение
		this.$summaCtrl.value = this._params.summa
		this.$summaSlider.value = this._params.summa;

		if (this.$refilCtrl) {
			this.$refilCtrl.value = this._params.refil;
			this.$refilSlider.value = this._params.refil;
		}

		// проставляет селект
		this.$periodSelect.value = this._params.period

		// выставляет свичер
		this.$switcherPercentCtrl.forEach(function(ctrl) {
			ctrl.checked = ctrl.value === self._params.percentType;
		});
	};

	Calculator.prototype.updateInputValue = function (input, value, paramKey) {
		input.value = value;
		this._params[paramKey] = value
	};

	Calculator.prototype._initEvents = function () {
		var self = this;

		this.$summaCtrl.addEventListener('change', function () {
			self._params.summa = this.value;
			self.calculate();
		});

		// this.$summaCtrl.addEventListener('keyup', function () {
		// 	console.log(this.value)
		// 	self.$summaSlider.value = this.value;

		// 	if (this.value != self._params.summa) {
		// 		self.calculate();
		// 	}
		// });

		if (this.$refilCtrl) {
			this.$refilCtrl.addEventListener('change', function () {
				self._params.refil = this.value;
				self.$refilSlider.value = this.value;
				self.calculate();
			});
		}

		this.$periodSelect.addEventListener('change', function () {
			self._params.period = this.value
			self.calculate();
		});

		this.$switcherPercentCtrl.forEach(function(ctrl) {
			ctrl.addEventListener('change', function() {
				self._params.percentType = this.value;
				self.calculate();
			});
		});
	};

	Calculator.prototype.calculate = function () {
		this.total = Number(this._params.summa)
		this.refil = Number(this._params.refil)

		for ( var i = 1; i <= this._params.period; i++ ) {
			this.total += this.total * (this._params.rate / 12 / 100);
		}

		this.profit = this.total - Number(this._params.summa);
		this.profitInMonth = this.profit / this._params.period;

		this._outData();
	};

	Calculator.prototype._calculate = function () {};

	Calculator.prototype._outData = function () {
		this.$totalEl.innerText = Math.floor(this.total);
		this.$profitEl.innerText = Math.floor(this.profit);
		this.$profitInMonthEl.innerText = Math.floor(this.profitInMonth);
		this.$rateEl.innerText = this._params.rate + '%';
		this.$periodEl.innerText = this._params.period
	};

	window.Calculator = Calculator;

})(window);
