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
 				//I had to use .innerHTML to handle label attribute display for mozilla
 				currencyOption.innerHTML = results[key].currencyName;
  				selectCurrency.appendChild(currencyOption);
  				
				}   

		return;
}

convertCurrency(){
	 	// this variables stores returned values from the API
	   	let fromVal =0;
	   	let toVal=0;
	 	//Get conversion data(amount to convert, currency to convert to and currencty to convdrt from)
		let button = document.getElementById("btnConvert");
		let drpFrm='';
		let drpTo='';
		button.addEventListener("click",function(e){

			let amount = this.amountToConvert = document.getElementById("amount").value;
  
    			this.fromCurrency=document.getElementById("convertFrom").value;
    			this.toCurrency=document.getElementById("convertTo").value;
    			let selectedFrom= document.getElementById("convertFrom");
    			let selectedTo= document.getElementById("convertTo");
    			 drpFrm = selectedFrom.options[selectedFrom.selectedIndex].text;
    			drpTo = selectedTo.options[selectedTo.selectedIndex].text;
    			 
    			

    			// creating the API query string as seen in documentation
    			let query = this.fromCurrency+ '_' + this.toCurrency +','+this.toCurrency+ '_' + this.fromCurrency;
    			
				//call currency converter API - Multiple queries, and non-compact sample
				fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}`, {method: 'get'})						
				.then((conversionRate) => conversionRate.json()) 				
				.then(function(rateValue) {				
					// working around, object refrencing with index rather than with key
					// I should try refactor this later considering for loop but for now let me get the project done
					let currencykey=[];
					let i=	0;					
					Object.keys(rateValue.results).forEach(function(key){			
					
					   currencykey[i] =key;						
						i =i+1;
					})
					//since only two values will be returned at any point in time with the free API version
					// I am safe to reference index 0 and 1 , index 0 for where I am converting from
					// index 1 for reverse conversion
					let fromVal=rateValue.results[currencykey[0]].fr;
						let rateVal =rateValue.results[currencykey[0]].val;
						let reverseCurrency=rateValue.results[currencykey[1]].fr;
						let reverseVal=rateValue.results[currencykey[1]].val;

					//calculate converstion rate by multiplying user value with API value at 1
					   let   finalValue =  Math.round((amount*rateVal) * 100) / 100;
					  let   finalReverse = Math.round((amount*reverseVal) * 100) / 100;
					
					   //finalValue = finalValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					   //finalReverse = finalReverse.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					   
					  
					
					    let buildConversionString = `1 ${fromVal} = ${reverseCurrency} ${rateVal}`;
					    let buildReverseString = `1 ${reverseCurrency} = ${fromVal} ${reverseVal}`;
					    document.getElementById("conversionRate").innerHTML = `<b> ${amount} ${fromVal} = ${finalValue} ${reverseCurrency}</b>`;
						document.getElementById("conversionCurrency").innerHTML = buildConversionString +'&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; '+buildReverseString;						
						document.getElementById("countryCurrency").innerHTML = `${drpFrm} &nbsp; to &nbsp; ${drpTo}`;
					
					})
				.catch(function(error) {
					// Error issues to be handled here
				  throw Error(error);
				    document.getElementById("errorDisplay").innerHTML = "Conversion rate can not be gotten at this time. <p>Confirm you are online";
				 }); 
    	
						
		},false);

	}



}




let cConverter = new CurrencyConverter();

(function(){
	fetch('https://free.currencyconverterapi.com/api/v5/currencies', {method: 'get'})
			
				.then((currencies) => currencies.json()) //get API currencies into json
				 // Get all currencies from API and manipulate
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
