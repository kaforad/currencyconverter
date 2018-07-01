//#7DaysofCodeChallenge
//TRACK:Mobile Web Specialist Track
//AUTHOR: Oyedoyin Agbaje
//PROJECT NAME:Currency Converter
//idb script
//API USED:Freecurrencyconverterapi (https://www.currencyconverterapi.com/)

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange

 let currencyId = '';	 
 let currencyRate= '';
 let storeMyData= [];
 let returnedDBData='';
// IDB declarations
let currencyDb=''
let currencyStorageObj='';
let currencyTx='';
let currencyIndex='';
let openIDB = window.indexedDB.open("currencyRateDB",1);

openIDB.onerror = function(error){
		console.log('IDB Error'+ error.target.errorCode);
	}
openIDB.onsuccess = function(data){
		 currencyDb = data.target.result;//openIDB.result;
		 //currencyTx = currencyDb.transaction["currencyStorageObj","readwrite"];
		 // let currencyStorageObj = currencyTx.objectStore("currencyRate");
		 // currencyStorageObj = currencyTx.createObjectStore("currencyRate", { keyPath: "id" });
		  currencyStorageObj = currencyDb.createObjectStore("currencyRate", { keyPath: "id" });
		 currencyIndex =currencyStorageObj.index("id");
		 currencyIndex =currencyStorageObj.index("rate");
		 //replacing tx above
		 let currencyTx = currencyDb.transaction("currencyRates", "readwrite").currencyStorageObj("currencyRates");
    		let = currencyTx.add(storeMyData);
		 openIDB.onerror =function(error){
		 	console.log(error.target.errorCode);
		 }
		 currencyStorageObj.put(storeMyData);
		 currencyTx.oncomplete = function(){
		 	openIDB.close();
		 }
	}

openIDB.onupgradeneeded = function(data){
		 let currencyDb = openIDB.result;
		 currencyIndex = currencyDb.createObjectStore("currencyRate", {keyPath: "id"});
		 currencyIndex.createIndex("id", "id", { unique: false });
    	 currencyIndex.createIndex("rate", "rate", { unique: false });
    	 //currencyIndex.createIndex("country", "country", { unique: false });
	}
 document.addEventListener("DOMContentLoaded", function(){

 		if (!('indexedDB' in window)) {
  				console.log('IndexedDB not supported by browsers');
  				return;
			}
		else{
				console.log('IndexedDB  supported');
				//data
				let button = document.getElementById("btnConvert");
				button.addEventListener("click",function(e){
					let fromCurrency = document.getElementById("convertFrom").value;
				 	let toCurrency =   document.getElementById("convertTo").value;
				 	let storeQuery  = fromCurrency + '_' + toCurrency;
				 	fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${storeQuery}&compact=ultra`, {method: 'get'})
				 	.then((currencies) => currencies.json())
				 	.then(function(allCurrencies) {
				 		 Object.keys(allCurrencies).forEach(function(key){				 
				  			currencyId = key;	 
				 			currencyRate= allCurrencies[key];
				
				 		})
				 		 //get data to be stored in db
				  			storeMyData = [{ id: currencyId,  rate: currencyRate}];

				 	})





				//close click event listener	
				},false);
		}			



 //close domconentloaded listener	
 },false)