
/***************************************************

telefon
data-pattern="^[0-9+ ]{9,13}$"

data urodzenia
data-pattern="^[0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{4}$"

pesel
data-pattern="^[0-9]{11}$" maxlength="11"

kod pocztowy
data-pattern="^[0-9]{2}-[0-9]{3}$"

****************************************************/


$(document).ready(function(){


function testInputText(element) {
	if( $(element).attr('data-pattern') != null ){
		var str = $(element).val();
		var reg = new RegExp( $(element).attr('data-pattern'), 'gi' );

	    if ( !reg.test(str) ) {
	        $(element).parent().removeClass('valid').addClass('invalid');
	        return false;
	    } else {
	        $(element).parent().addClass('valid').removeClass('invalid');
	        return true;
	    }	
	}else{
		if ( $(element).val() != '' ) {
	        $(element).parent().addClass('valid').removeClass('invalid');
	        return true;
	    } else {
	        $(element).parent().removeClass('valid').addClass('invalid');
	        return false;
	    }	
	}
}

function testInputEmail(element) {
	var pattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/;
	var str = $(element).val();
	var reg = pattern;

    if ( !reg.test(str) ) {
        $(element).parent().removeClass('valid').addClass('invalid');
        return false;
    } else {
        $(element).parent().addClass('valid').removeClass('invalid');
        return true;
    }	
}

function testInputCheckbox(element){
	if( element.checked == true ){
	    $(element).parent().addClass('valid').removeClass('invalid');
	    return true;
	}else{
	    $(element).parent().removeClass('valid').addClass('invalid');
	    return false;		
	}
}

function testTextarea(element){
	if ( $(element).val() != '' ) {
        $(element).parent().addClass('valid').removeClass('invalid');
        return true;
    } else {
        $(element).parent().removeClass('valid').addClass('invalid');
        return false;
    }
}



//remove attr required
$('input, textarea, select').each(function(){
	if( $(this).attr('required') ){
		$(this).removeAttr('required');
		$(this).addClass('required');
	}
});


//live walidation
$(document).on('keyup blur change', 'input, textarea', function(event){
	if( $(this).attr('type') == 'text' ){
		testInputText(this);
	}

	if( $(this).attr('type') == 'email' ){
		testInputEmail(this);
	}

	if( $(this).attr('type') == 'checkbox' ){
		testInputCheckbox(this);
	}

	if( $(this).is('textarea') ){
		testTextarea(this);
	}
});


//walidation on form send
$('form').submit(function(){
	output = true;

	$('input[type=text].required').each(function(){
		if( testInputText(this) == false ){
			output = false;
		}
	});

	$('input[type=email].required').each(function(){
		if( testInputEmail(this) == false ){
			output = false;
		}
	});

	$('input[type=checkbox].required').each(function(){
		if( testInputCheckbox(this) == false ){
			output = false;
		}
	});

	$('textarea.required').each(function(){
		if( testTextarea(this) == false ){
			output = false;
		}
	});
	
	if( output == true ){		
		$.ajax({
			url: 'ajax.php',
			type: 'POST',
			data: $(this).serialize(),

			success: function(data){
			  $('#ajax').html(data);
			}
		});
	}

	return false;
	// return output;
});


}); //end document ready