/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SEVICIGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataSevici = {};
        $scope.dataSMI = {};
        var dataCacheSevici = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //SEVICI
        $scope.bicis = [];
        $scope.plazas = [];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS SEVICI/////
            ////////////////////
                
     $http.get("https://api.jcdecaux.com/vls/v1/stations/?contract=Seville&apiKey=6fa39265431480ca0b5f3393cd78f29e2d436882").then(function(response){
                
                dataCacheSevici = response.data;
                $scope.dataSevici =dataCacheSevici;
                
                for(var i=0; i<10; i++){
                    $scope.categorias.push($scope.dataSevici[i].name);
                    $scope.plazas.push(Number($scope.dataSevici[i].available_bike_stands));
                    $scope.bicis.push(Number($scope.dataSevici[i].available_bikes));
                }
                
                console.log("Datos Sevici: "+$scope.dataSevici);
                
                  ////////////////////
            /////DATOS SMI/////
            ////////////////////
            $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheSMI = response.data;
                $scope.dataSMI =dataCacheSMI;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataSMI[i].country);
                    $scope.smiyear.push(Number($scope.dataSMI[i]["smi-year"]));
                    $scope.smivariation.push(Number($scope.dataSMI[i]["smi-year-variation"]));
                }
                    console.log("Datos SMI: "+$scope.dataSMI);


                    ////////////////////////////
                    ////COMPARATIVA SMI 2017////
                    ////////////////////////////
                    Highcharts.chart('container',{
                        title: {
                            text: 'WORLD SMI integrated with SEVICI'
                        },
                        chart: {
                            type: 'area'
                        },
                        xAxis: {
                            categories: $scope.categorias
                        },
                        legend: {
                            layout: 'vertical',
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            //align: 'left',
                            verticalAlign: 'top',
                            align: 'right',
                            y: 20,
                            x: 0
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br/>' +
                                   this.x + ': ' + this.y;
                            }
                        },
                        series:[{
                            name: 'Bicis disponibles:',
                            data: $scope.bicis,
                        },
                        {
                            name: 'Plazas disponibles',
                            data: $scope.plazas,
                        },
                        {
                            name: 'SMI Year Variation',
                            data: $scope.smivariation
                        }]
                    });});
         
     });
               

}]);