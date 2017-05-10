/*global angular*/
/*global bootbox*/

angular
    .module("G2ManagerApp")
    .controller("rpc-list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/rpc-stats";
        $scope.currentPage = 0;
        $scope.pageSize = 2;
        $scope.pages=[];
        console.log("Controller initialized ");
      
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                $scope.errorMessage = bootbox.alert("Countries added, Apikey correct.");
                console.log("Load initial data: OK");
                refresh();
            });
        };
        
    function refresh(){
        
            $http
                .get($scope.url+"?apikey="+ "GVAODcH3" +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data;
                    console.log(response.data);
                    $scope.configPages();
                });
            }   
            
    
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getStats = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.stats = response.data;
                    console.log(response.data);
                   alert("Apikey correct");
                    refresh();
                    
                   
                    
                }, function(response){
                    
                     if(response.status == 401){
                        
                       alert("First, enter an apikey.");
                    
                    }
                    if (response.status == 403) {
                        alert("Apikey incorrect");
                    }
                });
            
        } ;
        
        
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.postStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log($scope.newCountry.country + "rpc added." );
                    if (response.status == 422)
                        alert("Mal formato en el pais");
                    refresh();
                }),function(response){
                    
                    if (response.status == 422 | response.status == 409){
                        alert("Mal formato en el pais");
                    }
                };
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log( $scope.newCountry.country + "rpc has been succesfully modified. "  );
                    refresh();
                });
        };
        
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
                     var x=[];
                     x.push(response.data);
                    console.log("The search of: "+$scope.newCountry.country +" in year "+ $scope.newCountry.year+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = x; 
                  
    
                });
        }
        
        refresh();
        //METODO PARA LA PAGINACION
        
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
};
$scope.setPage = function(index) {
   $scope.currentPage = index - 1;
};
           
}]).filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});