/***************************************************
	walidacja.js,
	Copyright 2015-2016, JAdesign.pl

	telefon
	data-pattern="^[0-9+ ]{9,13}$" maxlength="13"

	data urodzenia
	data-pattern="^[0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{4}$"

	pesel
	data-pattern="^[0-9]{11}$" maxlength="11"

	kod pocztowy
	data-pattern="^[0-9]{2}-[0-9]{3}$"
****************************************************/


$(document).ready(function(){

	function parentElement( element ){
		var level = $(element).parent();
		return level;
	}
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

	//remove attr required
	$('input, textarea, select').each(function(){
		if( $(this).attr('required') ){
			$(this).removeAttr('required');
			$(this).addClass('required');
		}
	});

	//live walidation
	$(document).on('keyup blur change', 'input.required, textarea.required, select.required', function(event){
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
	$('form').submit(function(){
		output = true;
		
		test = true;
		sendMode = 'normal'; // ajax | post | normal

		$('input[type=text].required').each(function(){
			if( testInputText(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$('input[type=email].required').each(function(){
			if( testInputEmail(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$('input[type=checkbox].required').each(function(){
			if( testInputCheckbox(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$('select.required').each(function(){
			if( testInputSelect(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		$('textarea.required').each(function(){
			if( testTextarea(this) == false ){
				output = false;
				if(test==true){console.log(this);}
			}
		});

		if(test==true){console.log('output = '+output);}

		if( output == true ){
			if( sendMode == 'ajax' ){
				$.ajax({
					url: 'ajax.php',
					type: 'POST',
					data: $(this).serialize(),

					success: function(data){
					  $('#ajax').html(data);
					}
				});

				return false;
			}
			if( sendMode == 'post' ){
				$.post("ajax.php", myVars, function(data) {                   
					console.log(data);
				}, 'json');

				return false;
			}
			if( sendMode == 'normal' ){
				return output;
			}
		}else{
			return false;
		}

	}); // end $('form').submit(function(){

}); //end document ready