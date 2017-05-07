/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMIGCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.smiyear = [];
        $scope.smivariation = [];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data =dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.smiyear.push(Number($scope.data[i]["smi-year"]));
                $scope.smivariation.push(Number($scope.data[i]["smi-year-variation"]));
                
                console.log($scope.data[i].country);

            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            //////////////////////////////
            /////GOOGLE CHARTS////////////
            //////////////////////////////
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                function drawRegionsMap() {
                    var myData = [['Country','Smi Year', 'SMI Year Variation']];
                    response.data.forEach(function (d){
                        myData.push([d.country,Number(d["smi-year"]),Number(d["smi-year-variation"])]);

                    });
                    var data = google.visualization.arrayToDataTable(myData);
                    var options = {
                        
                    };
                    var chart = new google.visualization.GeoChart(document.getElementById('map'));
                    chart.draw(data, options);
                }
            });
    }]);