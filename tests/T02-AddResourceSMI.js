describe('Add result', function () {
	it('should add a new result', function (){
		browser.get('https://sos1617-02.herokuapp.com/#!/smi/');


//Cojo las estadisticas y una vez cogidas, uso el then para que devuelva 
		element.all(by.repeater('stat in stats')).then(function (initialStats){
				
				//Espera 2 segundos
				browser.driver.sleep(4000);
	
	//ACCIÓN DE ESCRIBIR DENTRO DE LOS INPUTS
				element(by.model('newCountry.country')).sendKeys('Rusia');
				element(by.model('newCountry.year')).sendKeys('2014');
				element(by.model("newCountry['smi-year']")).sendKeys('2000€');
				element(by.model("newCountry['smi-year-variation']")).sendKeys('30%');
				
				//SELECCIONO EL BOTON CUYO TEXTO SEA ADD
				element(by.buttonText('add')).click().then(function (){

					element.all(by.repeater('dataUnit in data')).then(function (stats){
						expect(stats.length).toEqual(initialStats.length+1);
					});
				
				});
			
		});
	});
	
});