/*global angular*/
angular.module("G2ManagerApp").controller("rpc-edit-ctrl",["$scope","$http","$routeParams","$location",function($scope,$http,$routeParams,$location){
    
    console.log("Edit controller initialized");
    $scope.url="/api/v1/rpc-stats/";
    function refresh(){
            $http
                .get($scope.url+$routeParams.country+"?apikey=GVAODcH3")
                .then(function(response){
                    console.log("Calling refresh");
                    $scope.updatedCountry = response.data[0];
                });
            } 
            
    $scope.updateStats = function(){
        delete $scope.updatedCountry._id;
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url + $routeParams.country + "?apikey="+ $scope.apikey, $scope.updatedCountry)
                .then(function(response){
                    console.log( $scope.updatedCountry.country + "rpc has been succesfully modified. "  );
                    $location.path("/");
                    
                });
        }
            
   
    refresh();
        
    
    
}]);