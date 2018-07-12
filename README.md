# Walidacja JS

### Instalacja poprzez NPM

```zsh
npm install jquery.c3r.validate
```


### Wywołanie funkcji

Przekazane musi zostać ID formularza

```javascript
$('#form').validate();
```


##### Przykład wykorzystania z ajax

```javascript
$('#form').validate({

	'blockSend': true

}).on('valid', function(){

	$.ajax({
		url: 'ajax.php',
		type: 'POST',
		data: $(this).serialize(),
		
		success: function(data){
			$('#ajax').html(data);
		}
	});

});
```

### Funkcja prepare

Funkcja pozwala przygotować formularz do walidacji po modyfikacjach  

```javascript
$('#prepare').on('click', function(){
	$('#form').validate('prepare');
})
```

### Funkcja test

Funkcja pozwala sprawdzić poprawność formularza bez jego wysyłki  

```javascript
$('#test').on('click', function(){
	$('#form').validate('test');
})
```


---

### Ustawienia

Dodatkowe ustawienia przekazywane są jako parametr funcji

```javascript
$('#form').validate({

	'blockSend': false,
	'invalidClass': 'invalid'

});
```

**blockSend**    
Blokowanie przesłania formularza i przejścia do adresu wskazanego w action

>default: false  
blockSend: true/false

--

**invalidClass**  
Klasa jaką ma otrzymać niepopranie zwalidowany element

>default: 'invalid'  
invalidClass: string

--

**validClass**  
Klasa jaką ma otrzymać poprawnie zwalidowany element

>default: 'valid'  
validClass: string

--

**liveValidation**  
Walidacja w czasie rzeczywistym

>default: true  
liveValidation: true/false

--

**parentLevel**  
Poziom rodzica elementu który otrzyma klasę invalidClass/validClass

>default: 1  
parentLevel: intiger

--

**parentLevelCheckbox**  
Poziom rodzica elementu checkbox który otrzyma klasę invalidClass/validClass

>default: 1  
parentLevelCheckbox: intiger

--

**test**  
Tryb testowy, zwraca w konsoli status walidacji oraz elementy niepoprawnie zwalidowane

>default: false  
test: true/false

---

### Funkcje Callback

Triggery przypisane do zdarzeń

**send**  
Odpalany przy przesłaniu formularza bez względu na poprawność walidacji

```javascript
$('#form').validate().on('send', function(e, a, b){
	// e - event
	// a - output( status walidacji )
	// b - tablica błędnych elementów
});
```

--

**valid**  
Odpalany przy poprawnym zwalidowaniu formularza

```javascript
$('#form').validate().on('valid', function(){
	// twój kod
});
```

--

**invalid**
Odpalany przy niepoprawnym zwalidowaniu formularza

```javascript
$('#form').validate().on('invalid', function(e, a){
	// e - event
	// a - tablica błędnych elementów
});
```

---

### Parametry walidacji

Paterny do zastosowania dla konkretnych pól formularza  


**Imię**  

```html
<input required type="text" name="name" data-pattern="^[a-zA-ZęóąśłżźćńĘÓĄŚŁŻŹĆŃ -]{3,}$">
```

--

**Email**  

```html
<input required type="email" name="email">
```

--

**Telefon**  

```html
<input required type="text" name="phone" data-pattern="^[0-9+ ]{9,13}$" maxlength="13">
```

--

**Data urodzenia**  

```html
<input required type="text" name="birth" data-pattern="^[0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{4}$">
```

--

**Pesel**  

```html
<input required type="text" name="pesel" data-type="pesel" data-pattern="^[0-9]{11}$" maxlength="11">
```

--

**Numer dowodu osobistego**

```html
data-pattern="^[A-Z]{3}[0-9]{6}$" maxlength="9"
```

--

**Kod pocztowy**  

```html
<input required type="text" name="post" data-pattern="^[0-9]{2}-[0-9]{3}$">
```

---

### Funkcje pomocnicze

**checkAllCheckbox()**  

Zaznaczanie kilku checkboxów - parametr pierwszy to klikany checkbox, drugi parametr to checkboxy do zaznaczenia

```javascript
checkAllCheckbox('.klikniety-checkbox', '.checkbox1, .checkbox2');
```

--

**preloader( visible, color, bg, opacity )**  

Wyświetla preloader

**visible** - *true/false*: wyświetla/usuwa preloader  
**color** - *HEX*: parametr opcjonalny - kolor preloadera  
**bg** - *default: #fff*: parametr opcjonalny - kolor tła pod preloader w formacie hex  
**opacity** - *default: 0.9*: parametr opcjonalny - poziom krycia tła pod preloaderem  

```javascript
preloader( true );
preloader( false );
preloader( true, 'green','red', '.5');
```
