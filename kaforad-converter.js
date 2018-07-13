//#7DaysofCodeChallenge
//TRACK:Mobile Web Specialist Track
//AUTHOR: Oyedoyin Agbaje
//PROJECT NAME:Currency Converter
//MAIN script
//API USED:Freecurrencyconverterapi (https://www.currencyconverterapi.com/)

class CurrencyConverter{
	constructor(){ 
	    //set default value for required data
		this.amountToConvert = 1;
		this.fromCurrency="NGN";
		this.toCurrency="USD";
			
		
	}

bindData(results,bindToObject){
//pass json data and dropdown name
//bind data to drop down	

	for(let key in results){
		
						
				let selectCurrency = document.getElementById(`${bindToObject}`);
 				let currencyOption = document.createElement('option');
 				currencyOption.setAttribute('value', results[key].id);
 				currencyOption.setAttribute('label', results[key].currencyName); 
 				currencyOption.setAttribute('text',  results[key].currencyName); 			
 				currencyOption.innerHTML = results[key].currencyName;
  				selectCurrency.appendChild(currencyOption);
  				
				}   

		return;
}

rateCalculation(amount,rate){
	//currency conversion
	let total =0;	
	total =  Math.round((amount*rate) * 100) / 100;
	return total;
	
}

convertCurrency(){

	var drpFrom=document.getElementById("convertFrom");
	var drpTo=document.getElementById("convertTo");

	var button = document.getElementById("btnConvert");

		button.addEventListener("click",function(e){
			//this.amountToConvert = document.getElementById("amount").value;
			let amount = document.getElementById("amount").value;
			this.fromCurrency=drpFrom.value;
    		this.toCurrency=drpTo.value;
    		let fromSelected=drpFrom.options[drpFrom.selectedIndex].text;
			let toSelected=drpTo.options[drpTo.selectedIndex].text;
			
    		// creating the API query string as seen in documentation
    		let queryString = this.fromCurrency+ '_' + this.toCurrency +','+this.toCurrency+ '_' + this.fromCurrency;

    		//call currency converter API - Multiple queries, and non-compact sample
			fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${queryString}`, {method: 'get'})						
			.then((conversionRate) => conversionRate.json()) 				
			.then(function(rateValue) {	
				console.log(rateValue.results);
				let currencyIndex =0;
				let currencyKey = [];
				Object.keys(rateValue.results).forEach(function(key){			
					
					    currencyKey[currencyIndex] = key;						
					    currencyIndex += 1;
					});
				
					//get conversion rate from and to
					console.log('rate value results');
					console.log(rateValue.results);
				   	let currencyCode=rateValue.results[currencyKey[0]].fr;
					let currencyValue =rateValue.results[currencyKey[0]].val;
					let reverseCode=rateValue.results[currencyKey[1]].fr;
					let reverseValue=rateValue.results[currencyKey[1]].val;

					//create conversion rate string display
					let buildConversionString = `1 ${currencyCode} = ${reverseCode} ${reverseValue}`;
					let buildReverseString = `1 ${reverseCode} = ${currencyCode} ${currencyValue}`;
					let total = cConverter.rateCalculation(amount ,currencyValue);
					document.getElementById("countryCurrency").innerHTML = `${fromSelected} &nbsp; to &nbsp; ${toSelected}`;					
					document.getElementById("currencyConversion").innerHTML = buildConversionString +'&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; '+ buildReverseString;						
					document.getElementById("conversionRate").innerHTML = `<b> ${amount} ${currencyCode} = ${total} ${reverseCode}</b>`;
			})	.catch(function(error) {
					
				  console.log(error);
				    document.getElementById("errorDisplay").innerHTML = "Conversion rate can not be gotten at this time. <p>Confirm you are online";
				 }); 


		},false);
}



}




let cConverter = new CurrencyConverter();

(function(){
	fetch('https://free.currencyconverterapi.com/api/v5/currencies', {method: 'get'})
			
				.then((currencies) => currencies.json()) 
				 // Manipulating Currency Data from FREE API
				.then(function(allCurrencies) {
						
		             //call funciton - binding currency to drop down
		              cConverter.bindData(allCurrencies.results,'convertFrom') ;
		              cConverter.bindData(allCurrencies.results,'convertTo') ;
		         })
}) ();

//registering  service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('service-worker.js')
           .then(function() { console.log("Service Worker Registered"); 
       }).catch(function(error){
       	console.log('Could not register service worker at this time.' + error)
       })
}
