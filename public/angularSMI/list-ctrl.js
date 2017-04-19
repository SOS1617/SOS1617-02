//Obtengo el modulo y creo el controlador sobre él
angular
    .module("SMIManagerApp")
    .controller("ListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/smi-stats";

        console.log("Controller initialized ");
        
        //CARGAR DATOS
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                refresh();
            })
        }
        
    function refresh(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                   
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    console.log("all"+ JSON.stringify($scope.stats));
                });
            }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    console.log("APIKEY is correct.");
                    
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    console.log("All stats are send.");
                });
            
        } 
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log($scope.newCountry.country + "stats added." );
                    refresh();
                });
        } 
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.editStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log( $scope.newCountry.country + "stats has been modified. "  );
                    refresh();
                });
        }
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        }
        
        //MÉTODO PARA BORRAR UN PAÍS
        $scope.deleteOneCountry = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("Country stats delete: "+ country);
                    refresh();
                });
        } 
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&country="+$scope.newCountry.country+"&year="+$scope.newCountry.year)
                .then(function(response){
                    console.log("The search of: "+$scope.newCountry.country +" in year "+ $scope.newCountry.year+ " works correctly");
                    var x = [];
                    x.push(response.data);
                    
                    $scope.data = JSON.stringify(x, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats =$scope.data;
                    //$scope.index = $scope.newCountry._id;
                  console.log("search"+ $scope.stats);
                });
        }
           
}]);  