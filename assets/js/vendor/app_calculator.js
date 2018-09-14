/**
 * Кальлятор по расчёту доходов по вкладам
 * @author Aleksey Kondratyev
 */
// (function(window) {

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
		this.maxSumma = this.$summaCtrl.dataset.max;
		this.$summaSlider = this.$el.querySelector('#summa-slider');
		this.$summaProgress = this.$el.querySelector('.js-input-progress');

		// пополнение в месяц
		this.$refilCtrl = this.$el.querySelector('.refil');

		// селект со сроками
		this.$periodSelect = this.$el.querySelector('#period-select');

		// свичер
		this.$switcherPercentEl = this.$el.querySelector('#switcher-percent');
		this.$switcherPercentCtrl = this.$switcherPercentEl.querySelectorAll('.switcher__radio');
		this.percentType;

		this.$resultItems = this.$el.querySelectorAll('.calculator__result-item');

		// название тарифа
		this.$tariffName = this.$el.querySelector('.js-tariff-name');

		// сколько получит клиент
		this.$totalEl = this.$el.querySelector('.js-total');

		// ставка
		this.$rateEl = this.$el.querySelector('.js-rate');

		// срок
		this.$periodEl = this.$el.querySelector('.js-period');

		// общий доход
		this.$profitEl = this.$el.querySelector('.js-profit'); 

		// доход в месяц 
		this.$profitInMonthEl = this.$el.querySelector('.js-profit-in-month');

		// тарифы
		this.$tarifflist = this.$el.querySelectorAll('.js-tariff');
		// данные по каждому тарифу
		this.tariffs = [];

		// тариф подходящий под выбранные параметры
		this.selectedTariff = {};

		this._init();
	};

	Calculator.prototype._params = {
		summa: 1500000, // сумма
		refil: 0, // пополнение
		percentType: 'every-month', // выплата процентов
		period: 12 // срок,
	};

	Calculator.prototype._init = function () {
		this._initTariffs();
		this._initCtrls();
		this._initEvents();
		this.calculate();
	};

	// создаем для каждого тарифа свой объект
	Calculator.prototype._initTariffs = function () {
		var self = this;
		this.$tarifflist.forEach(function (tariff, index) {
			self.tariffs.push({
				id: index,
				name: tariff.dataset.name,
				rate: tariff.dataset.rate,
				minRefil: tariff.dataset.minrefil,
				minSrok: tariff.dataset.minsrok,
				percentType: tariff.dataset.percenttype,
				total: 0,
				profit: 0,
				profitInMonth: 0,
			});
		});
	};

	Calculator.prototype._initCtrls = function () {
		var self = this;

		// проставляет в инпуте значение
		this.$summaCtrl.value = this._params.summa
		this.$summaSlider.value = this._params.summa;
		this.calculateProgressFill();

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
		this._params[paramKey] = value;
		this.calculateProgressFill();
	};

	Calculator.prototype._initEvents = function () {
		var self = this;
		this.$summaCtrl.addEventListener('change', function () {
			self._params.summa = this.value;
			self.calculateProgressFill();
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
			this.blur();
			self._params.period = Number(this.value);
			self.calculate();
		});

		this.$switcherPercentCtrl.forEach(function(ctrl) {
			ctrl.addEventListener('change', function() {
				self._params.percentType = this.value;
				self.calculate();
			});
		});
	};
	
	Calculator.prototype.calculateProgressFill = function () {
		this.$summaProgress.style.width = (this._params.summa * 100) / this.maxSumma + '%';
	};

	// выделяет подходящий тариф
	Calculator.prototype._selectTarif = function () {
		var self = this;
		var selectedTariff = this.tariffs.filter(function(tariff) {
			return (Number(tariff.minSrok) === self._params.period && 
				tariff.percentType === self._params.percentType
				// tariff.minRefil >= self._params.refil
			);
		})

		this.selectedTariff = Object.assign({}, selectedTariff[0]);
		this.$tariffName.innerText = this.selectedTariff.name;
	};

	Calculator.prototype._outTotalSumma = function () {
		this.$totalEl.innerHTML = formatNumber(Math.floor(this.selectedTariff.total), false) + '&thinsp;';
	};

	Calculator.prototype._outProfit = function () {
		this.$profitEl.innerHTML = formatNumber(Math.floor(this.selectedTariff.profit), false) + '&thinsp;';
	};

	Calculator.prototype._outProfitInMonth = function () {
		this.$profitInMonthEl.innerHTML = formatNumber(Math.floor(this.selectedTariff.profitInMonth), false) + '&thinsp;';
	};

	Calculator.prototype._outRate = function () {
		this.$rateEl.innerHTML = this.selectedTariff.rate + '&thinsp;%';
	};

	Calculator.prototype._outPeriods = function () {
		this.$periodEl.innerText = this._params.period + ' мес.';
	};

	Calculator.prototype.calculate = function () {
		this._selectTarif();
		var summa = Number(this._params.summa),
			refil = Number(this._params.refil);

		this.selectedTariff.total = summa;
		if (this._params.percentType === 'every-month') {
			for ( var i = 1; i <= this._params.period; i++ ) {
				this.selectedTariff.profit += (this.selectedTariff.total) * (this.selectedTariff.rate / 12 / 100);
				this.selectedTariff.total += refil;
			}
			this.selectedTariff.total += Math.floor(this.selectedTariff.profit);
		} else {
			for ( var i = 1; i <= this._params.period; i++ ) {
				var profit = (this.selectedTariff.total) * (this.selectedTariff.rate / 12 / 100);
				this.selectedTariff.total += refil + profit;
			}
			this.selectedTariff.profit = this.selectedTariff.total - (this._params.summa + refil * this._params.period);
		}
		this.selectedTariff.profitInMonth = this.selectedTariff.profit / this._params.period;

		this._outData();
	};

	Calculator.prototype.generateTblReport = function (tariff) {
		var rows = '';
		var summa = Number(this._params.summa),
			refil = Number(this._params.refil),
			profit = 0;

		for (var i = 1; i <= this._params.period; i++) {
			rows += '<tr>';
			rows += '<td>' + i + '</td>';

			if (i > 1) {
				summa += refil;
			}
			profit = (summa) * (tariff.rate / 12 / 100);

			if (this._params.percentType === 'every-month') {
				rows += '<td class="rubl">' + formatNumber(summa, false) + '</td>';
				rows += '<td class="rubl">' + formatNumber(refil, false) + '</td>';
				rows += '<td class="rubl">' + formatNumber(Math.floor(profit), false) + '</td>';
			} else {
				rows += '<td class="rubl">' + formatNumber(Math.floor(summa), false) + '</td>';
				rows += '<td class="rubl">' + formatNumber(refil, false) + '</td>';
				rows += '<td class="rubl">' + formatNumber(Math.floor(profit), false) + '</td>';
				summa += profit;
			}

			rows += '</tr>';
		}

		return rows;
	};

	Calculator.prototype.generatePdfHref = function (tariff, phone, coords) {
		return '/pdf/' +
			'?program_name=' + tariff.name +
			'&summa=' + this._params.summa +
			'&total=' + tariff.total +
			'&profit=' + Math.floor(tariff.profit) +
			'&profit_in_month=' + Math.floor(tariff.profitInMonth) +
			'&rate=' + tariff.rate +
			'&period=' + this._params.period +
			'&payment_type=' + this._params.percentType +
			'&phone=' + phone +
			'&coords=' + coords;
	};

	Calculator.prototype._outData = function () {
		this._outTotalSumma();
		this._outProfit();
		this._outProfitInMonth();
		this._outRate();
		this._outPeriods();
	};

	//window.Calculator = Calculator;

// })(window);
