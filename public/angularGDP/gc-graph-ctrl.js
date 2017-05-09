/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GDPGCGraphCtrl",["$scope","$http",function ($scope, $http){
        
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
        $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
        //Google Charts
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                function drawRegionsMap() {
                    var myData = [['Country','Gdp Year', 'Population Year']];
                    response.data.forEach(function (d){
                        myData.push([d.country,Number(d["gdp-year"]),Number(d["population-year"])]);

                    });
                    var data = google.visualization.arrayToDataTable(myData);
                    var options = {
                        
                    };
                    var chart = new google.visualization.GeoChart(document.getElementById('map'));
                    chart.draw(data, options);
            }
           
    });
}]);