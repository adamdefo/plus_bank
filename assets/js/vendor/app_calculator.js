/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

( function( window ) {

	'use strict';
	
	// class helper functions from bonzo https://github.com/ded/bonzo
	
	function classReg( className ) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}
	
	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;
	
	if ( 'classList' in document.documentElement ) {
	  hasClass = function( elem, c ) {
		return elem.classList.contains( c );
	  };
	  addClass = function( elem, c ) {
		elem.classList.add( c );
	  };
	  removeClass = function( elem, c ) {
		elem.classList.remove( c );
	  };
	}
	else {
	  hasClass = function( elem, c ) {
		return classReg( c ).test( elem.className );
	  };
	  addClass = function( elem, c ) {
		if ( !hasClass( elem, c ) ) {
		  elem.className = elem.className + ' ' + c;
		}
	  };
	  removeClass = function( elem, c ) {
		elem.className = elem.className.replace( classReg( c ), ' ' );
	  };
	}
	
	function toggleClass( elem, c ) {
	  var fn = hasClass( elem, c ) ? removeClass : addClass;
	  fn( elem, c );
	}
	
	var classie = {
	  // full names
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  // short names
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};
	
	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( classie );
	} else if ( typeof exports === 'object' ) {
	  // CommonJS
	  module.exports = classie;
	} else {
	  // browser global
	  window.classie = classie;
	}
	
})( window );

/**
 * @author Aleksey Kondratyev
 */
(function(window) {

	'use strict';

	var extend = function (a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	};

	/**
	 * Кальлятор по расчёту доходов по вкладам
	 * @param {*} selector 
	 * @param {*} params 
	 */
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

		this.$resultItems = this.$el.querySelectorAll('.calculator__result-item');

		// сколько получит клиент
		this.$totalEl = this.$el.querySelectorAll('.js-total');

		// ставка
		this.$rateEl = this.$el.querySelectorAll('.js-rate');

		// срок
		this.$periodEl = this.$el.querySelectorAll('.js-period');

		// общий доход
		this.$profitEl = this.$el.querySelectorAll('.js-profit'); 

		// доход в месяц 
		this.$profitInMonthEl = this.$el.querySelectorAll('.js-profit-in-month');

		// тарифы
		this.$tarifflist = this.$el.querySelectorAll('.js-tariff');
		// данные по каждому тарифу
		this.tariffs = [];

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
		this.$tarifflist.forEach(function (tariff) {
			self.tariffs.push({
				total: 0,
				profit: 0,
				profitInMonth: 0,
				rate: tariff.querySelector('.js-rate').dataset.rate
			});
		});
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
		var self = this;

		var summa = Number(this._params.summa),
				refil = Number(this._params.refil);

		this.tariffs.forEach(function(tariff) {
			tariff.total = summa;
			if (self._params.percentType === 'every-month') {
				for ( var i = 1; i <= self._params.period; i++ ) {
					tariff.profit += (tariff.total) * (tariff.rate / 12 / 100);
					tariff.total += refil;
				}
				tariff.total += tariff.profit;
			} else {
				for ( var i = 1; i <= self._params.period; i++ ) {
					var profit = (tariff.total) * (tariff.rate / 12 / 100);
					tariff.total += refil + profit;
				}
				tariff.profit = tariff.total - (self._params.summa + refil * self._params.period);
			}
			tariff.profitInMonth = tariff.profit / self._params.period;
		});

		this._outData();
	};

	Calculator.prototype._outTotalSumma = function () {
		var self = this;
		this.$totalEl.forEach(function(el, index) {
			el.innerText = Math.floor(self.tariffs[index].total);
		})
	};

	Calculator.prototype._outProfit = function () {
		var self = this;
		this.$profitEl.forEach(function(el, index) {
			el.innerText = Math.floor(self.tariffs[index].profit);
		})
	};

	Calculator.prototype._outProfitInMonth = function () {
		var self = this;
		this.$profitInMonthEl.forEach(function(el, index) {
			el.innerText = Math.floor(self.tariffs[index].profitInMonth);
		})
	};

	Calculator.prototype._outRates = function () {
		this.$rateEl.forEach(function(el) {
			el.innerText = el.dataset.rate + '%';
		})
	};

	Calculator.prototype._outPeriods = function () {
		var self = this;
		this.$periodEl.forEach(function(el) {
			el.innerText = self._params.period + ' мес.';
		})
	};

	// выделяет подходящий тариф
	Calculator.prototype._selectTarif = function () {
		this._unselectTarif();
		if (this._params.summa < 1999999) {
			classie.add(this.$resultItems[0], '_active');
		} else if (this._params.summa > 2000000 && this._params.summa < 2499999) {
			classie.add(this.$resultItems[1], '_active');
		} else {
			classie.add(this.$resultItems[2], '_active');
		}
	};

	// снимает выделение с тарифов
	Calculator.prototype._unselectTarif = function () {
		this.$resultItems.forEach(function(el) {
			classie.remove(el, '_active');
		});
	};

	Calculator.prototype._outData = function () {
		this._selectTarif();
		this._outTotalSumma();
		this._outProfit();
		this._outProfitInMonth();
		this._outRates();
		this._outPeriods();
	};

	Calculator.prototype.generateTblReport = function (tariff) {
		var rows = '';
		var summa = Number(this._params.summa),
				refil = Number(this._params.refil);
		var profit = 0;
		for (var i = 1; i <= this._params.period; i++) {
			rows += '<tr>';
			rows += '<td>' + i + '</td>';

			if (i > 1) {
				summa += refil;
			}
			profit = (summa) * (tariff.rate / 12 / 100);

			if (this._params.percentType === 'every-month') {
				rows += '<td class="rubl">' + summa + '</td>';
				rows += '<td class="rubl">' + refil + '</td>';
				rows += '<td class="rubl">' + Math.floor(profit) + '</td>';
			} else {
				rows += '<td class="rubl">' + Math.floor(summa) + '</td>';
				rows += '<td class="rubl">' + refil + '</td>';
				rows += '<td class="rubl">' + Math.floor(profit) + '</td>';
				summa += profit;
			}

			rows += '</tr>';
		}

		return rows;
	};

	window.Calculator = Calculator;

})(window);
