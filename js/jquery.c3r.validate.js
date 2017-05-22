/*
 * jQuery c3r validate Plugin
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


		// przeładowanie przygotowania formularza
		if( options == 'prepare' ){
			requiredRemove(form);
			return;
		}

		requiredRemove(form);
		

		// sprawdzenie poprawności danych
		if( options == 'test' ){
			validTest(formId, invalidElements);
			return;
		}


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

			validTest(formId, invalidElements);

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


	function validTest(formId, invalidElements){
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

		return output;
	}


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

	function preloader(param, color, bg, opacity){
 		
 		param = param || true;
 		color = color || '#00b2ff';
 		bg = bg || '#fff';
 		opacity = opacity || '0.9';

 		var ajaxLoaderCssCenter = '<style type="text/css">.uil-default-css{position: absolute;top: 45%;left: 50%;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);}</style>';

		var ajaxLoaderCss = '<style type="text/css">@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4166666666666667s;animation-delay: -0.4166666666666667s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.33333333333333337s;animation-delay: -0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.25s;animation-delay: -0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.16666666666666669s;animation-delay: -0.16666666666666669s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.08333333333333331s;animation-delay: -0.08333333333333331s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.08333333333333337s;animation-delay: 0.08333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.16666666666666663s;animation-delay: 0.16666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.25s;animation-delay: 0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(11){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.33333333333333337s;animation-delay: 0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(12){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.41666666666666663s;animation-delay: 0.41666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}</style>';

		var ajaxLoaderHtml = "<div class='uil-default-css' style='transform:scale(0.32);'><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:"+color+";-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;'></div></div>";

		if( param == true )
		{
			var container = $('<div class="preloader-container" style="position:absolute; text-align:center; top:0; width:100%; height:100vh; z-index:999999; opacity:0; transition: 0.5s"></div>');
			var curtine = $('<div class="preloader-curtine" style="position:absolute; top:0; background:'+ bg +'; opacity:'+opacity+'  ;width:100%; height:100%"></div>');
		
			$('body').append(container);
			$('.preloader-container').append(curtine);			
			$('.preloader-container').append(ajaxLoaderCss);
			$('.preloader-container').append(ajaxLoaderCssCenter);
			$('.preloader-container').append(ajaxLoaderHtml);
			
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