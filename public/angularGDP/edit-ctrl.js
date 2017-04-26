angular
    .module("GdpManagerApp")
    .controller("edit-ctrl",["$scope", "$http","$routeParams","$location", function($scope, $http, $routeParams, $location){
        console.log("Edit controller initialized!");
        $scope.url = "/api/v2/gdp-population-stats/";
        $scope.apikey = "GVAODcH3";
        
        function refresh(){
            $http
                .get($scope.url + $routeParams.name +"?apikey=GVAODcH3")
                .then(function (response){
                    $scope.updatedCountry = response.data[0];
                });
        };
        
        refresh();
        
        $scope.updateData = function(){
            delete $scope.updatedCountry._id;
            
            $http
                .put($scope.url + $routeParams.name +"?apikey=GVAODcH3", $scope.updatedCountry)
                .then(function(response){
                    refresh();
                    console.log($scope.url + $routeParams.name + "?apikey="+ $scope.apikey, $scope.updatedCountry);
                    console.log("editData OK");
                });
        };
}]);  