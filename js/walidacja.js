$(document).ready(function(){



function testInputText(element) {
	if( $(element).attr('data-pattern') != null ){
		var str = $(element).val();
		var reg = new RegExp( $(element).attr('data-pattern'), 'gi' );

	    if ( !reg.test(str) ) {
	        $(element).removeClass('ok').addClass('err');
	        return false;
	    } else {
	        $(element).addClass('ok').removeClass('err');
	        return true;
	    }	
	}else{
		if ( $(element).val() != '' ) {
	        $(element).addClass('ok').removeClass('err');
	        return true;
	    } else {
	        $(element).removeClass('ok').addClass('err');
	        return false;
	    }	
	}
}

function testInputCheckbox(element){
	if( element.checked == true ){
	    $(element).parent().addClass('ok').removeClass('err');
	    return true;
	}else{
	    $(element).parent().removeClass('ok').addClass('err');
	    return false;		
	}
}

function testTextarea(element){
	if ( $(element).val() != '' ) {
        $(element).addClass('ok').removeClass('err');
        return true;
    } else {
        $(element).removeClass('ok').addClass('err');
        return false;
    }
}



//remove attr required
$('input, textarea').each(function(){
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