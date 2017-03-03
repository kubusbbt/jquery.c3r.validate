/***************************************************
	walidacja.js,
	Copyright 2015-2016, JAdesign.pl
	
	znaki PL
	ęóąśłżźćńĘÓĄŚŁŻŹĆŃ
	
	imie
	data-pattern="^[a-zA-ZęóąśłżźćńĘÓĄŚŁŻŹĆŃ -]{3,}$"
	
	telefon
	data-pattern="^[0-9+ ]{9,13}$" maxlength="13"

	data urodzenia
	data-pattern="^[0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{4}$"

	pesel
	data-pattern="^[0-9]{11}$" maxlength="11"

	kod pocztowy
	data-pattern="^[0-9]{2}-[0-9]{3}$"
	
	2 identyczne pola testDouble
	przykład użyty jest w funkcji sendmode normal
****************************************************/


$(document).ready(function(){


	test = true; // jeśli true to konsola zwraca elementy invalid
	//sendMode = 'ajax'; // ajax | post | normal
	live_validation_event = 'keyup blur change';


	// id formularza
	walidacja('form', 'normal');


}); //end document ready


function ajax(form){
	$.ajax({
		url: 'ajax.php',
		type: 'POST',
		data: $(form).serialize(),

		success: function(data){
		  $('#ajax').html(data);
		}
	});
}

function post(form){
	$.post("ajax.php", myVars, function(data) {                   
		console.log(data);
	}, 'json');
}

function preloader(){
	$('.preloader').removeClass('hidden');
	$('form').css('opacity', '0.1');
	$('form').css('pointer-events', 'none');
}

function form_send(data){
	$('.preloader').addClass('hidden');
	$('form').css( 'height', $('form').innerHeight() );
	$('form').html('');
	$('.thx').removeClass('hidden');
}




function walidacja(formId, sendMode){
	
	//element na który ma zostać dodana klasa invalid/valid
	function parentElement( element ){
		var level = $(element).parent();
		return level;
	}
	//element na który ma zostać dodana klasa invalid/valid
	function parentElementCheckbox( element ){
		var level = $(element).parent().parent();
		return level;
	}

	function testInputText(element) {
		if( $(element).data('type') == 'pesel' ){
			
			if ( testPesel(element) == true ){
				parentElement(element).addClass('valid').removeClass('invalid');
				return true;
			}
			else{
				parentElement(element).removeClass('valid').addClass('invalid');
				return false;
			}

		}else{
			if( $(element).attr('data-pattern') != null ){
				var str = $(element).val();
				var reg = new RegExp( $(element).attr('data-pattern'), 'gi' );

			    if ( !reg.test(str) ) {
			        parentElement(element).removeClass('valid').addClass('invalid');	        
			        return false;
			    } else {
			        parentElement(element).addClass('valid').removeClass('invalid');
			        return true;
			    }	
			}else{
				if ( $(element).val() != '' ) {
			        parentElement(element).addClass('valid').removeClass('invalid');
			        return true;
			    } else {
			        parentElement(element).removeClass('valid').addClass('invalid');
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
	        parentElement(element).removeClass('valid').addClass('invalid');
	        return false;
	    } else {
	        parentElement(element).addClass('valid').removeClass('invalid');
	        return true;
	    }	
	}

	function testInputCheckbox(element){
		if( element.checked == true ){
		    parentElementCheckbox(element).addClass('valid').removeClass('invalid');
		    return true;
		}else{
		    parentElementCheckbox(element).removeClass('valid').addClass('invalid');
		    return false;		
		}
	}

	function testInputSelect(element){
		if( $(element).val() != '' ){
		    parentElement(element).addClass('valid').removeClass('invalid');
		    return true;
		}else{
		    parentElement(element).removeClass('valid').addClass('invalid');
		    return false;		
		}
	}

	function testTextarea(element){
		if ( $(element).val() != '' ) {
	        parentElement(element).addClass('valid').removeClass('invalid');
	        return true;
	    } else {
	        parentElement(element).removeClass('valid').addClass('invalid');
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
	
	function testDouble(element1, element2) {
		var input1 = $(element1).val();
		var input2 = $(element2).val();

		if( input1 == input2 ){
			parentElement(element1).addClass('valid').removeClass('invalid');
			parentElement(element2).addClass('valid').removeClass('invalid');
			return true;
		}else{
			parentElement(element1).removeClass('valid').addClass('invalid');
			parentElement(element2).removeClass('valid').addClass('invalid');
			return false;
		}
	}

	//remove attr required
	var elements = formId+' input, '+formId+' textarea, '+formId+' select';

	$(elements).each(function(){
		if( $(this).attr('required') ){
			$(this).removeAttr('required');
			$(this).addClass('required');
		}
	});

	//live walidation
	var elementValidation = formId+' input.required, '+formId+' textarea.required, '+formId+' select.required';
	
	$(document).on(live_validation_event, elementValidation, function(event){
		if( $(this).attr('type') == 'text' ){
			testInputText(this);
		}

		if( $(this).attr('type') == 'email' ){
			testInputEmail(this);
		}

		if( $(this).attr('type') == 'checkbox' ){
			testInputCheckbox(this);
		}

		if( $(this).is('select') ){
			testInputSelect(this);
		}

		if( $(this).is('textarea') ){
			testTextarea(this);
		}
	});

	//walidation on form send
	$(formId).submit(function(){
		output = true;
		
		$(formId+' input[type=text].required').each(function(){
			if( testInputText(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$(formId+' input[type=email].required').each(function(){
			if( testInputEmail(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$(formId+' input[type=checkbox].required').each(function(){
			if( testInputCheckbox(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$(formId+' select.required').each(function(){
			if( testInputSelect(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$(formId+' textarea.required').each(function(){
			if( testTextarea(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		if(test==true){console.log('output = '+output);}

		if( output == true ){

			// jeżeli mode jest ustawione na ajax
			if( sendMode == 'ajax' ){
				ajax(this);
				return false;
			}

			// jeżeli mode jest ustawione na post
			if( sendMode == 'post' ){
				post(this);
				return false;
			}

			// jeżeli mode jest ustawione na normal
			if( sendMode == 'normal' ){
			
				//if( !testDouble('input[name=email]', 'input[name=email2]') ){
				//	output = false;
				//}
			
				/* Blokowanie kulkukrotnego przesłania formularza*/
				$(this).submit(function() {
					return false;
				});
				
				return output;
			}
		}else{
			return false;
		}

	}); // end $('form').submit(function(){

} // end walidacja function