;(function(window) {

	var WatcherScrollPage = function () {
		var docElem = document.documentElement,
			header = document.querySelector( '.js-header' ),
			didScroll = false,
			changeHeaderOn = 100;

		function init() {
			window.addEventListener( 'scroll', function( event ) {
				if( !didScroll ) {
					didScroll = true;
					setTimeout( scrollPage, 300 );
				}
			}, false );
		}

		function scrollPage() {
			var sy = scrollY();
			if ( sy >= changeHeaderOn ) {
				classie.add( header, 'header-scroll' );
			}
			else {
				classie.remove( header, 'header-scroll' );
			}
			didScroll = false;
		}

		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}

		init();
	}

	window.WatcherScrollPage = WatcherScrollPage;

})(window);