angular
    .module("GdpManagerApp")
    .controller("edit-ctrl",["$scope", "$http", function($scope, $http){
        console.log("Edit controller initialized!");
        $scope.url = "/api/v2/gdp-population-stats";
        
        function refresh(){
            $http
                .get($scope.url + "/Alemania")
                .then(function (response){
                    $scope.updatedCountry = response.data[0];
                });
        }
        refresh();
}]);  