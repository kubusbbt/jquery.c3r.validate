/*
 * jQuery c3 validate Plugin
 * cod3r.pl
 *
 * Copyright 2017, cod3r.pl
 */


// (function($){
	
	$.fn.validate = function(options){
		
		var form = this,
			formId = '#'+form.attr('id'),
			invalidElements = [];

		settings = {
			'blockSend': false,
			'invalidClass': 'invalid',
			'validClass': 'valid',
			'liveValidation': true,
			'parentLevel': 1, // parent level dla klasy invalid / valid dla inputów
			'parentLevelCheckbox': 1, // parent level dla klasy invalid / valid dla checkboxa
			'test': false
		};

		$.extend(settings, options);
		// console.log( settings );


		requiredRemove(form);

		if( settings['liveValidation'] == true ){
			liveValidation(formId);
		}	

		sendValidation(formId, invalidElements);

		return this; //zwraca obiekt jQuery walidowanego formularza

	}; // end $.fn.validate = function()



	function parentLevel(element, type){
		
		type = type || '';
		
		var level = '';

		if( type == 'checkbox' ){
			var parentLevel = settings['parentLevelCheckbox'];
		}
		else{
			var parentLevel = settings['parentLevel'];
		}
		
		if( parentLevel == 0 ){
			level = $(element);
		}else{
			level = $(element).parents().eq( parentLevel - 1 );
		}

		return level;

	}


	function requiredRemove(form){
		
		var elements = form.find('input, textarea, select');
		
		$(elements).each(function(){
			if( $(this).attr('required') ){
				$(this).removeAttr('required');
				$(this).addClass('required');
			}
		});

	}

	function liveValidation(formId){
		
		var elementValidation = formId+' input.required, '+formId+' textarea.required, '+formId+' select.required';
		
		$(document).on('keyup blur change', elementValidation, function(event){

			if( $(this).attr('type') == 'text' ){
				testInputText(this);
			}
			
			if( $(this).attr('type') == 'password' ){
				testInputText(this);
			}

			if( $(this).attr('type') == 'email' ){
				testInputEmail(this);
			}

			if( $(this).attr('type') == 'checkbox' ){
				testInputCheckbox(this);
			}

			if( $(this).attr('type') == 'radio' ){
				testInputRadio(this);
			}

			if( $(this).is('select') ){
				testInputSelect(this);
			}

			if( $(this).is('textarea') ){
				testTextarea(this);
			}

		});

	}

	function sendValidation(formId, invalidElements){

		//walidation on form send
		$(formId).submit(function(){
			output = true;
			
			$(formId+' input[type=text].required').each(function(){
				if( testInputText(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});
			
			$(formId+' input[type=password].required').each(function(){
				if( testInputText(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			$(formId+' input[type=email].required').each(function(){
				if( testInputEmail(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			$(formId+' input[type=checkbox].required').each(function(){
				if( testInputCheckbox(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			$(formId+' input[type=radio].required').each(function(){
				if( testInputRadio(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			$(formId+' select.required').each(function(){
				if( testInputSelect(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			$(formId+' textarea.required').each(function(){
				if( testTextarea(this) == false ){
					invalidElements.push(this);
					output = false;
				}
			});

			if( settings['test']==true ){
				console.log('output = '+output);
				console.log( invalidElements );
			}

			$(this).trigger( 'send', [output, invalidElements] );


			if( output == true )
			{
				$(this).trigger( 'valid' );

				// Blokowanie kulkukrotnego przesłania formularza
				$(this).submit(function() {
					return false;
				});
				
				if( settings['blockSend'] == true ){
					return false;
				}else{
					return output;
				}	
			}
			else
			{
				$(this).trigger( 'invalid', [invalidElements] );
				return false;
			}


		});

	} // end function sendValidation()


	/****************************/
	/*		TEST FUNCTIONS		*/
	/****************************/

	function testInputText(element) {

		if( $(element).data('type') == 'pesel' ){
			
			if ( testPesel(element) == true ){
				parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
				return true;
			}
			else{
				parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);
				return false;
			}

		}else{
			if( $(element).attr('data-pattern') != null ){
				var str = $(element).val();
				var reg = new RegExp( $(element).attr('data-pattern'), 'gi' );

				if ( !reg.test(str) ) {
					parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);	        
					return false;
				} else {
					parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
					return true;
				}	
			}else{
				if ( $(element).val() != '' ) {
					parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
					return true;
				} else {
					parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);
					return false;
				}	
			}
		}

	}

	function testInputEmail(element) {

		var pattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/;
		var str = $(element).val();
		var reg = pattern;

		if ( !reg.test(str) ) {
			parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);
			return false;
		} else {
			parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
			return true;
		}	

	}

	function testInputCheckbox(element){

		if( element.checked == true ){
			parentLevel(element, 'checkbox').addClass(settings['validClass']).removeClass(settings['invalidClass']);
			return true;
		}else{
			parentLevel(element, 'checkbox').removeClass(settings['validClass']).addClass(settings['invalidClass']);
			return false;		
		}

	}

	function testInputRadio(element){

		var input = $(element).attr('name');

		if( $('input[name='+input+']:checked').length != 0 ){
			parentLevel(element, 'checkbox').addClass(settings['validClass']).removeClass(settings['invalidClass']);
			return true;
		}else{
			parentLevel(element, 'checkbox').removeClass(settings['validClass']).addClass(settings['invalidClass']);
			return false;	
		}

	}

	function testInputSelect(element){

		if( $(element).val() != '' ){
			parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
			return true;
		}else{
			parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);
			return false;		
		}

	}

	function testTextarea(element){

		if ( $(element).val() != '' ) {
			parentLevel(element).addClass(settings['validClass']).removeClass(settings['invalidClass']);
			return true;
		} else {
			parentLevel(element).removeClass(settings['validClass']).addClass(settings['invalidClass']);
			return false;
		}

	}

	function testPesel(element) {

		var pesel = $(element).val();
		var output = false;
		
		var reg = /^[0-9]{11}$/;
		if(reg.test(pesel) == false) {
			output = false;
		}
		else
		{
			var dig = (""+pesel).split("");
			var kontrola = (1*parseInt(dig[0]) + 3*parseInt(dig[1]) + 7*parseInt(dig[2]) + 9*parseInt(dig[3]) + 1*parseInt(dig[4]) + 3*parseInt(dig[5]) + 7*parseInt(dig[6]) + 9*parseInt(dig[7]) + 1*parseInt(dig[8]) + 3*parseInt(dig[9]))%10;
			if(kontrola==0) kontrola = 10;
			kontrola = 10 - kontrola;
			if(parseInt(dig[10])==kontrola){
				output = true;
			}
			else{
				output = false;
			}
		}

		return output;

	}
	
	function testDouble(formID) {
		
		var output = false;

		var inputs = $(formID + ' input[data-equal]');
		var inputsArray = [];

		inputs.each(function(){
			var value = $(this).data('equal');
			inputsArray.push( value );
		});

		$.unique(inputsArray.sort());
		
		inputsArray.forEach(function(e){
			var ddd = [];

			$(formID + ' input[data-equal='+e).each(function(){
				ddd.push( $(this).val() );
			});

			$.unique(ddd.sort());

			if( ddd.length == 1 ){
				parentLevel(formID + ' input[data-equal='+e).addClass(settings['validClass']).removeClass(settings['invalidClass']);
				output = true;
			}
			else{
				parentLevel(formID + ' input[data-equal='+e).removeClass(settings['validClass']).addClass(settings['invalidClass']);
				output = false;
			}
		});

		console.log( 'double ' + output );

		return output;

	}


	/****************************/
	/*		HELP FUNCTIONS		*/
	/****************************/
	
	function checkAllCheckbox(masterCheckbox, secondCheckbox) {
		
		$(masterCheckbox).on('click', function(){
			if( $(this).is(':checked') ){
				$(secondCheckbox).prop("checked", true);
			}else{
				$(secondCheckbox).prop("checked", false);
			}
		});

	};

	function preloader(param, bg, opacity){
		
 		param = param || true;
 		bg = bg || '#fff';
 		opacity = opacity || '0.9';

 		var ajaxLoader = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjhweCcgaGVpZ2h0PSc2OHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9InVpbC1kZWZhdWx0Ij48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIgY2xhc3M9ImJrIj48L3JlY3Q+PHJlY3QgIHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjMDBiMmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSgwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMHMnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzAwYjJmZicgdHJhbnNmb3JtPSdyb3RhdGUoMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjA4MzMzMzMzMzMzMzMzMzMzcycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PHJlY3QgIHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjMDBiMmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuMTY2NjY2NjY2NjY2NjY2NjZzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyMwMGIyZmYnIHRyYW5zZm9ybT0ncm90YXRlKDkwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC4yNXMnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzAwYjJmZicgdHJhbnNmb3JtPSdyb3RhdGUoMTIwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC4zMzMzMzMzMzMzMzMzMzMzcycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PHJlY3QgIHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjMDBiMmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjQxNjY2NjY2NjY2NjY2NjdzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyMwMGIyZmYnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuNXMnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzAwYjJmZicgdHJhbnNmb3JtPSdyb3RhdGUoMjEwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC41ODMzMzMzMzMzMzMzMzM0cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PHJlY3QgIHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjMDBiMmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjY2NjY2NjY2NjY2NjY2NjZzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyMwMGIyZmYnIHRyYW5zZm9ybT0ncm90YXRlKDI3MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuNzVzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyMwMGIyZmYnIHRyYW5zZm9ybT0ncm90YXRlKDMwMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuODMzMzMzMzMzMzMzMzMzNHMnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzAwYjJmZicgdHJhbnNmb3JtPSdyb3RhdGUoMzMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC45MTY2NjY2NjY2NjY2NjY2cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PC9zdmc+';
		
		if( param == true )
		{
			var container = $('<div class="preloader-container" style="position:absolute; text-align:center; top:0; width:100%; height:100vh; z-index:999999; opacity:0; transition: 0.5s"></div>');
			var curtine = $('<div class="preloader-curtine" style="position:absolute; top:0; background:'+ bg +'; opacity:'+opacity+'  ;width:100%; height:100%"></div>');
			var loader = $('<img style="position:absolute; top: 45%" src="'+ajaxLoader+'">');
		
			$('body').append(container);
			$('.preloader-container').append(curtine);
			$('.preloader-container').append(loader);
			
			setTimeout(function(){
				$('.preloader-container').css('opacity', '1');
			}, 100);
		}
		else
		{
			$('.preloader-container').remove();
		}
	}
	

// } (jQuery));