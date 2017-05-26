describe('Add result', function () {
	it('should add a new result', function (){
		browser.get('https://sos1617-02-aml-sandbox-sos161702aml.c9users.io/#!/rpc');


//Cojo las estadisticas y una vez cogidas, uso el then para que devuelva 
		element.all(by.repeater('stat in stats')).then(function (initialStats){
				
				//Espera 2 segundos
				browser.driver.sleep(4000);
	
	//ACCIÓN DE ESCRIBIR DENTRO DE LOS INPUTS
				element(by.model('newCountry.country')).sendKeys('Madagascar');
				element(by.model('newCountry.year')).sendKeys('2014');
				element(by.model("newCountry['rpcyear']")).sendKeys('56.238');
				element(by.model("newCountry['rpcvariation']")).sendKeys('2.4');
				
				//SELECCIONO EL BOTON CUYO TEXTO SEA ADD
				element(by.buttonText('POST DATA')).click().then(function (){

					element.all(by.repeater('stat in stats')).then(function (stats){
						expect(stats.length).toEqual(initialStats.length);
					});
				
				});
			
		});
	});
	
});