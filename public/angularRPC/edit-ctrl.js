angular.module("RPCManagerApp").controller("edit-ctrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    
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
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url + $routeParams.country + "?apikey="+ $scope.apikey, $scope.updatedCountry)
                .then(function(response){
                    console.log( $scope.updatedCountry.country + "rpc has been succesfully modified. "  );
                    refresh();
                });
        }
            
   
    refresh();
        
    
    
}]);