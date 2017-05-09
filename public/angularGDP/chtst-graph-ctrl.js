/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GDPCHTSTGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.gdpyear = [];
        $scope.populationyear = [];

        
        $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push($scope.data[i].country);
                $scope.gdpyear.push(Number($scope.data[i]["gdp-year"]));
                $scope.populationyear.push(Number($scope.data[i]["population-year"]));
                console.log($scope.gdpyear);
                }
        });    
            
        console.log("GDP HC Controller initialized");
        
        //Chartist
        new Chartist.Line('#chart1', {
               labels: $scope.categorias,
               series: [$scope.gdpyear]
        });
    
        //Chartist with multiple series
        //WHY NOT WORKING? 
        /*
        new Chartist.Line('.ct-chart', {
            labels: $scope.categorias,
             series: [
                 [$scope.gdpyear],
                 [$scope.populationyear]
                 ]
            }, {
                fullWidth: true,
                chartPadding: {
                right: 40
                }
        });*/
}]);