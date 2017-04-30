/*global Materialize*/
/* global angular */

//Obtengo el modulo y creo el controlador sobre él
angular
    .module("G2ManagerApp")
    .controller("SMIListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/smi-stats";
        // $scope.offset = 0;
        //$scope.limit = 2;
        console.log("List controller initialized ");
        
        
        //PAGINACIÓN
        $scope.currentPage = 0;
        $scope.pageSize = 4; // Esta la cantidad de registros que deseamos mostrar por página
        $scope.pages = [];
        
        
        //CARGAR DATOS
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                
                Materialize.toast("Correct. All countries have been add.", 4000, 'rounded');
                console.log("Load initial data: OK");
                refresh();
            })
        }
        
    function refresh(){
            $http
                .get($scope.url)
                .then(function(response){
                    
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    $scope.configPages();
                    console.log("all"+ JSON.stringify($scope.stats));
                });
    }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("APIKEY is correct.");
                    Materialize.toast('APIKEY Correct! All stats are sent.', 4000, 'rounded');
                    
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    $scope.configPages();
                    console.log("All stats are send.");
                },function(response){
                    if(response.status==401){
                        
                        Materialize.toast('APIKEY is necesary (401).', 4000, 'rounded');
                    
                    }
                    if (response.status == 403) {
                        Materialize.toast('APIKEY is not correct.', 4000, 'rounded');
                    }
                    
                    
                });
            
        } 
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    
                    Materialize.toast("Correct. The country "+$scope.newCountry.country+" have been add.", 4000, 'rounded');
                   
                    console.log($scope.newCountry.country + "stats added." );
                    refresh();
                    
                },function(response) {
                        $scope.stats = [];
                        if (response.status == 422) {
                            
                           Materialize.toast("Fields can not be empty.", 4000, 'rounded');

                        }
                        if (response.status == 409) {
                            
                            Materialize.toast("Stats of "+$scope.newCountry.country+ " already exists", 4000, 'rounded');
                            
                        }
                        if (response.status == 403) {
                            Materialize.toast('APIKEY is not correct.', 4000, 'rounded');
                        }
             });
            
        } 
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.editStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    
                    console.log( $scope.newCountry.country + " stats has been modified. "  );
                    Materialize.toast('Correct. The country '+$scope.newCountry.country+' have been updated.', 4000, 'rounded');
                    refresh();
                },function(response){
                   
                        if (response.status == 422) {
                            Materialize.toast('Country empty.', 4000, 'rounded');
                        }
                        if (response.status == 404) {
                            Materialize.toast('Country not exists.', 4000, 'rounded');
                        }
                        if (response.status == 403) {
                            Materialize.toast('APIKEY is not correct.', 4000, 'rounded');
                        }
                    
                });
        }
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    Materialize.toast('Correct. All stats have been delete.', 4000, 'rounded');
                    
                    console.log("All stats delete");
                    refresh();
                });
        }
        
        //MÉTODO PARA BORRAR UN PAÍS
        $scope.deleteOneCountry = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    
                    Materialize.toast("Correct. The country "+country+" have been delete.", 4000, 'rounded');
                    
                    console.log("Country stats delete: "+ country);
                    refresh();
                });
        } 
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
       $scope.searches = function(){
            var results = "";

            if ($scope.newSearch.country !== undefined && $scope.newSearch.country !== ""
            && $scope.newSearch.year !== undefined && $scope.newSearch.year !== "") {
                
                results = results + "&country=" + $scope.newSearch.country;
                results = results + "&year=" + $scope.newSearch.year;
                
                $http
                .get($scope.url+"?apikey="+$scope.apikey+results)
                .then(function(response){
                    console.log("The search of: "+$scope.newSearch.country +" in year "+ $scope.newSearch.year+ " works correctly");
                    var x = [];
                    x.push(response.data);
                  //  $scope.data = JSON.stringify(x, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats =x;
                    Materialize.toast("Country found: "+$scope.newSearch.country, 4000, 'rounded');
                    $scope.configPages();
                    
                  console.log($scope.stats);
                },
                function(response){
                   
                        if (response.status == 422) {
                            Materialize.toast("Country and year search empty", 4000, 'rounded');
                        }
                        if (response.status == 404) {
                            Materialize.toast("Country not exists", 4000, 'rounded');
                        }
                        if (response.status == 403) {
                            Materialize.toast('APIKEY is not correct.', 4000, 'rounded');
                        }
                    
                });
                
            }else{
                Materialize.toast('Country and year search empty', 4000, 'rounded');
            }

            
        }
        
        
        //PAGINACIÓN
        $scope.configPages = function() {
           $scope.pages.length = 0;
           var ini = $scope.currentPage - 4;
           var fin = $scope.currentPage + 5;
           
           if (ini < 1) {
              ini = 1;
              if (Math.ceil($scope.stats.length / $scope.pageSize) > 10) fin = 10;
              else fin = Math.ceil($scope.stats.length / $scope.pageSize);
           } else {
              if (ini >= Math.ceil($scope.stats.length / $scope.pageSize) - 10) {
                 ini = Math.ceil($scope.stats.length / $scope.pageSize) - 10;
                 fin = Math.ceil($scope.stats.length / $scope.pageSize);
              }
           }
           if (ini < 1) ini = 1;
          
           for (var i = ini; i <= fin; i++) {
              $scope.pages.push({ no: i });
           }
           if ($scope.currentPage >= $scope.pages.length)
              $scope.currentPage = $scope.pages.length - 1;
        
        if (fin > $scope.pages.length) fin = $scope.pages.length;      
         
        console.log("Pagination is working correctly: "+$scope.pages.length + " PAGINAS")      
        };
        
        $scope.setPage = function(index) {
           $scope.currentPage = index - 1;
        };
        
       refresh(); 
        
           
}]).filter('startFromGrid', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start =+ start;
        return input.slice(start);
    }
});  