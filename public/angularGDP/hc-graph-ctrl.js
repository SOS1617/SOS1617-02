/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GDPHCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.gdpyear = [];

      
        console.log("GDP HC Controller initialized");
        $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push($scope.data[i].country);
                $scope.gdpyear.push(Number($scope.data[i]["gdp-year"]));
                console.log($scope.gdpyear);
                }
            
        //Highchart de GDP por país para éste año
            Highcharts.chart('container',{
                title: {
                    text: 'WORLD GDP 2017'
                },
                chart: {
                    type: 'bar'
                },
                xAxis: {
                    categories: $scope.categorias
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'GDP in Millions of Euros',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                series:[{
                    name: 'GDP 2017',
                    data: $scope.gdpyear
                }]
            });
    });
}]);