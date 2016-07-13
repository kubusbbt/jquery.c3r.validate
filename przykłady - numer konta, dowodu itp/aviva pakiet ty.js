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


function testDoubleEmail(element) {
	var str = $(element).val();
	var reg = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/;

	returnType = true;

    if ( !reg.test(str) ) {
        $(element).parent().removeClass('valid').addClass('invalid');
        return false;
    }else{
        $(element).parent().addClass('valid').removeClass('invalid');
        // return true;

        
        if( $('.email1').val() == $('.email2').val() ) {
            $('.email2').parent().removeClass('invalid').addClass('valid');
            returnType = true;
        }else{
            $('.email2').parent().removeClass('valid').addClass('invalid');
            returnType = false;
        }
 
        return returnType;
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


function testInputSelect(element){
	if( $(element).val() != '' ){
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





function testInputProcent() {
	suma = 0;
	
	$('.procent').each(function(){
		if( $(this).val() != '' ){
			suma += parseInt( $(this).val() );
		}
	});

	if( suma == 100 ){
		$('.procent').parent().removeClass('invalid').addClass('valid');	
		return true;
	}else{
		$('.procent').parent().removeClass('valid').addClass('invalid');	
		return false;
	}
}


function testInputDate(element) {
	var str = $(element).val();
	
	if ( str.length == 10 ) {
		var dateString = str.match(/^(\d{2})[-.\/](\d{2})[-.\/](\d{4})$/);

		var date = new Date( dateString[3], dateString[2]-1, dateString[1] );
		var birthday = new Date(date);
		var today = new Date();
		var years = today.getFullYear() - birthday.getFullYear();

		birthday.setFullYear(today.getFullYear());

		if (today < birthday)
		{
		    years--;
		}
		
		if( years >= 18 && years <= 29 ){
			$(element).parent().addClass('valid').removeClass('invalid');
			$(element).parent().find('.err-msg').addClass('hidden');
			return true;
		}
		else{
			$(element).parent().removeClass('valid').addClass('invalid');
			$(element).parent().find('.err-msg').removeClass('hidden');
			return false;
		}
	}else{
		$(element).parent().removeClass('valid').addClass('invalid');
		return false;
	};
}

function testInputPesel(element) {
	var pesel = $(element).val();
    
    var reg = /^[0-9]{11}$/;
    if(reg.test(pesel) == false) {
		$(element).parent().removeClass('valid').addClass('invalid');
    	return false;}
    else
    {
        var dig = (""+pesel).split("");
        var kontrola = (1*parseInt(dig[0]) + 3*parseInt(dig[1]) + 7*parseInt(dig[2]) + 9*parseInt(dig[3]) + 1*parseInt(dig[4]) + 3*parseInt(dig[5]) + 7*parseInt(dig[6]) + 9*parseInt(dig[7]) + 1*parseInt(dig[8]) + 3*parseInt(dig[9]))%10;
        if(kontrola==0) kontrola = 10;
        kontrola = 10 - kontrola;
        if(parseInt(dig[10])==kontrola){
        	$(element).parent().addClass('valid').removeClass('invalid');
        	return true;
    	}
        else{
        	$(element).parent().removeClass('valid').addClass('invalid');
        	return false;
        }
    }
}

function testNrDokumentu(element) {
	var wartosc = $(element).val();
	var dokument = $('select[name=dokument-tozsamosci]').val();

	if( dokument == 'dowód osobisty' ){
		$('input[name=dokument-tozsamosci-nr]').removeAttr('disabled');
		$('input[name=dokument-tozsamosci-nr]').attr('maxlength','9');
		
		if( numerDowodu(wartosc) == true ){
			$(element).parent().addClass('valid').removeClass('invalid');	
			return true;	
		}else{
			$(element).parent().removeClass('valid').addClass('invalid');
			return false;
		}
	}
	else if( dokument == 'paszport' ){
		$('input[name=dokument-tozsamosci-nr]').removeAttr('disabled');
		$('input[name=dokument-tozsamosci-nr]').attr('maxlength','9');
	
		if( numerPaszportu(wartosc) == true ){
			$(element).parent().addClass('valid').removeClass('invalid');	
			return true;	
		}else{
			$(element).parent().removeClass('valid').addClass('invalid');
			return false;
		}
	}
	else if( dokument == 'karta pobytu' ){
		$('input[name=dokument-tozsamosci-nr]').removeAttr('disabled');
		var reg = /^[a-zA-Z0-9]{4,}$/;
		
		if(reg.test(wartosc) == false) {
			$(element).parent().removeClass('valid').addClass('invalid');
			return false;
		}else{
			$(element).parent().addClass('valid').removeClass('invalid');
			return true;			
		}
	}
	else{
		$('input[name=dokument-tozsamosci-nr]').attr('disabled', 'disabled');
		
		$(element).parent().removeClass('valid').addClass('invalid');
	}
}



function testInputNumerRachunku(element) {
	var numer = $(element).val();
	var reg = /^[0-9 ]{26,}$/;
	
	if( reg.test(numer) == false ){
		$(element).parent().removeClass('valid').addClass('invalid');
		return false;
	}else{
		if( NRBvalidatior(numer) == true ){
			$(element).parent().addClass('valid').removeClass('invalid');
			return true;
		}else{
			$(element).parent().removeClass('valid').addClass('invalid');
			return false;
		}
	}
	



}



//remove attr required
function removeAttr(){
	$('input, textarea, select').each(function(){
		if( $(this).attr('required') ){
			$(this).removeAttr('required');
			$(this).addClass('required');
		}
	});
}
removeAttr();


//live walidation
$(document).on('keyup blur change', 'input, textarea, select', function(event){
	if( $(this).attr('type') == 'text' ){
		testInputText(this);
	}

	if( $(this).attr('name') == 'data-urodzenia' ){
		testInputDate(this);
	}

	if( $(this).attr('name') == 'pesel' ){
		testInputPesel(this);
	}

	if( $(this).attr('name') == 'dokument-tozsamosci-nr' || $(this).attr('name') == 'dokument-tozsamosci' ){
		testNrDokumentu(this);
	}

	if( $(this).attr('type') == 'email' ){
		testDoubleEmail(this);
	}

	if( $(this).attr('data-type') == 'nrb' ){
		testInputNumerRachunku(this);
	}

	testInputProcent();

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

	$('input[type=text].required').each(function(){
		if( testInputText(this) == false ){
			output = false;
			if(test==true){console.log(this);}
		}
	});

	$('input[name=data-urodzenia].required').each(function(){
		if( testInputDate(this) == false ){
			output = false;
			if(test==true){console.log(this);}
		}
	});

	$('input[name=pesel].required').each(function(){
		if( testInputPesel(this) == false ){
			output = false;
			if(test==true){console.log(this);}
		}
	});

	$('input[type=email].required').each(function(){
		if( testDoubleEmail(this) == false ){
			output = false;
			if(test==true){console.log(this);}
		}
	});

	$('input[data-type=nrb].required').each(function(){
		if( testInputNumerRachunku(this) == false ){
			output = false;
			if(test==true){console.log(this);}
		}
	});

	$('input[type=procent].required').each(function(){
		if( testInputProcent() == false ){
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
	
	// if( output == true ){		
	// 	$.ajax({
	// 		url: 'app/lead.php',
	// 		type: 'POST',
	// 		data: $(this).serialize(),

	// 		success: function(data){
				
	// 			if (data == 'lead_ok') {
	// 				$('body').addClass('form-send');
	// 			}else{
	// 				console.log('err');
	// 			};

	// 			// $('#ajax-data').html(data);
	// 		}
	// 	});
	// }

	return false;
	// return output;
});






var formNum = 1;
$(document).on('click','.add', function(){
	$.ajax({
		url: "ajax2.php",
		type: "POST",
		data: { formNum: formNum },

		success: function(data){
			var formClass = 'append-form-'+formNum;
			$('#append').append('<div class="appended '+formClass+'"></div>');
			$('.'+formClass).html(data);
			removeAttr();
			formNum++;
		}
	})
});



$(document).on('click','.delete', function(){
	$(this).parent().parent().remove();
});

$(document).on('click', '.next-screen1 img', function(){
	$('a[href=#collapse2]').click();
});

$(document).on('click', '.next-screen2 img', function(){
	$('a[href=#collapse3]').click();
});

$(document).on('click', '.next-screen3 img', function(){
	$('a[href=#collapse4]').click();
});




$('input[name=kod-pocztowy]').change(function(){
	$('input[name=kod-pocztowy-2]').val( $('input[name=kod-pocztowy]').val() );
});
$('input[name=miejscowosc]').change(function(){
	$('input[name=miejscowosc-2]').val( $('input[name=miejscowosc]').val() );
});
$('input[name=ulica]').change(function(){
	$('input[name=ulica-2]').val( $('input[name=ulica]').val() );
});
$('input[name=nr-domu]').change(function(){
	$('input[name=nr-domu-2]').val( $('input[name=nr-domu]').val() );
});
$('input[name=nr-mieszkania]').change(function(){
	$('input[name=nr-mieszkania-2]').val( $('input[name=nr-mieszkania]').val() );
});



function numerDowodu(numer) {
	if (numer == null || numer.length != 9)
	return false;
	 
	numer = numer.toUpperCase();
	letterValues = [
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
	'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z'];
	function getLetterValue(letter)
	{
	for (j=0; j<letterValues.length; j++)
	if (letter == letterValues[j])
	return j;
	return -1;
	}
	 
	//Check seria
	for (i=0; i<3; i++)     
	if (getLetterValue(numer[i]) < 10)
	return false;
	//Check number 
	for (i=3; i<9; i++)
	if (getLetterValue(numer[i]) < 0 || getLetterValue(numer[i]) > 9)
	return false;
	 
	//sprawdz cyfre controlna
	sum = 7 * getLetterValue(numer[0]) +
	3 * getLetterValue(numer[1]) +
	1 * getLetterValue(numer[2]) +
	7 * getLetterValue(numer[4]) +
	3 * getLetterValue(numer[5]) +
	1 * getLetterValue(numer[6]) +
	7 * getLetterValue(numer[7]) +
	3 * getLetterValue(numer[8]);
	sum %= 10;
	if (sum != getLetterValue(numer[3]))
	return false;
	 
	return true;
}



function numerPaszportu(numer) {

	letterValue = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
	'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z'
	];

	wagi = ['7 ', '3', '9', '1', '7', '3', '1', '7', '3'];

	function getLetterValue(letter){
		for (i=0; i<letterValue.length; i++){
			if (letter == letterValue[i]){
				return i+10;
			}
		}
	}
	 
	iloczyny = [
		getLetterValue(numer[0]) * wagi[0],
		getLetterValue(numer[1]) * wagi[1],
		numer[2] * wagi[2],
		numer[3] * wagi[3],
		numer[4] * wagi[4],
		numer[5] * wagi[5],
		numer[6] * wagi[6],
		numer[7] * wagi[7],
		numer[8] * wagi[8],
	];

	sumowanie = iloczyny[0] + iloczyny[1] + iloczyny[2] + iloczyny[3] + iloczyny[4] + iloczyny[5] + iloczyny[6] + iloczyny[7] + iloczyny[8];
	sumowanie %= 10;

	if(sumowanie == 0){
		return true;
	}else{
		return false
	}
}


function NRBvalidatior(nrb){
	nrb = nrb.replace(/[^0-9]+/g,'');
	var Wagi = new Array(1,10,3,30,9,90,27,76,81,34,49,5,50,15,53,45,62,38,89,17,
	73,51,25,56,75,71,31,19,93,57);

	if(nrb.length == 26) {
		nrb = nrb + "2521";
		nrb = nrb.substr(2) + nrb.substr(0,2);
		var Z =0;

		for (var i=0; i < 30; i++) {
			Z += nrb[29-i] * Wagi[i];
		}

		if (Z % 97 == 1) {
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}




}); //end document ready



