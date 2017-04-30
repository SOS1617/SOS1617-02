/* global angular */
/* global Materialize */

//Obtengo el modulo y creo el controlador sobre él
angular
    .module("SMIManagerApp")
    .controller("EditCtrl",["$scope", "$http","$routeParams","$location", function($scope, $http,$routeParams,$location){
        
        $scope.url = "/api/v1/smi-stats/";
        $scope.apikey="rXD8D2b1vP";
        console.log("Edit controller initialized ");

        
    function refresh(){
            $http
                .get($scope.url+$routeParams.country+"?apikey="+ $scope.apikey)
                .then(function(response){
                   
                    //$scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.updatedCountry = response.data[0];
                    //delete $scope.updatedCountry._id;
                    //console.log("all"+ JSON.stringify($scope.stats));
                });
    }   
    
     //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.editStats = function(){
            
            //Elimino el campo ID porque el objeto que le paso para editar tiene que venir ir sin el ID
            delete $scope.updatedCountry._id;
            
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url+ $routeParams.country + "?apikey="+ $scope.apikey, $scope.updatedCountry)
                .then(function(response){
                    
                    console.log( $routeParams.country + " stats has been modified. "  );
                    Materialize.toast('Correct. The country '+$routeParams.country+' have been updated.', 4000, 'rounded');
                    
                    $location.path("/");
                    
                },function(response){
                   
                        if (response.status == 422) {
                            Materialize.toast('Country empty.', 4000, 'rounded');
                        }
                        if (response.status == 404) {
                            Materialize.toast('Country not exists.', 4000, 'rounded');
                        } 
                    
                }
                
                );
        }
    
    refresh();
}]);