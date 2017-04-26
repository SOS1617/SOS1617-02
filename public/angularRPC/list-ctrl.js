angular
    .module("RPCManagerApp")
    .controller("list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/rpc-stats";

        console.log("Controller initialized ");
      
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
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data;
                });
            }   
            
              function refreshOne(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&country="+ $scope.newCountry.country +"&year="+$scope.newCountry.year)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data[0];
                });
            }   
    
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getStats = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.stats = response.data;
                });
            
        } 
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.postStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log($scope.newCountry.country + "rpc added." );
                    refresh();
                });
        } 
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log( $scope.newCountry.country + "rpc has been succesfully modified. "  );
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
        
        $scope.getSearch = function(country,year){
            $http.get($scope.url+"/" + country + "?apikey="+ $scope.apikey).
                then(function(response) {
                   console.log("The search has aported succesfully results" +country);
                   
                });
            
        }
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
       $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&country="+$scope.newCountry.country+"&year="+$scope.newCountry.year)
                .then(function(response){
                    console.log("The search of: "+$scope.newCountry.country +" in year "+ $scope.newCountry.year+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data[0]; 
                    console.log(response.data);
                    refreshOne();
                });
        }
           
}]);  