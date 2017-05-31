/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("OWMGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataOWM = {};
        $scope.dataSMI = {};
        var dataCacheOWM = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //OWM
        $scope.maximos = [];
        $scope.minimos = [];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS SEVICI/////
            ////////////////////
                
     $http.get("/api/v2/smi-stats/proxy2/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheOWM = response.data;
                $scope.dataOWM =dataCacheOWM;
                console.log("Datos OWM: "+$scope.dataOWM.list[0].main.temp_min);
                
                for(var i=0; i<10; i++){
                    $scope.categorias.push($scope.dataOWM.list[i].dt_txt);
                    $scope.minimos.push(Number($scope.dataOWM.list[i].main.temp_min-270));
                    $scope.maximos.push(Number($scope.dataOWM.list[i].main.temp_max-270));
                }
                
                console.log("Datos OWM: "+$scope.dataOWM);
                
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
                  /*  Highcharts.chart('container',{
                        title: {
                            text: 'WORLD SMI integrated with SEVICI'
                        },
                        chart: {
                            type: 'column'
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
                            name: 'Temp. Máxima',
                            data: $scope.maximos,
                        },
                        {
                            name: 'Temp. Mínima',
                            data: $scope.minimos,
                        },
                        {
                            name: 'SMI Year Variation',
                            data: $scope.smivariation
                        }]
                    });*/
                var trace1 = {
                  x: $scope.categorias, 
                  y:  $scope.maximos, 
                  name: 'Temp. Máxima', 
                  type: 'bar'
                };
                
                var trace2 = {
                  x: $scope.categorias, 
                  y:  $scope.minimos, 
                  name: 'Temp. Mínima', 
                  type: 'bar'
                };
                
                var trace3 = {
                  x: $scope.categorias, 
                  y:  $scope.smivariation, 
                  name: 'SMI Year Variation', 
                  type: 'bar'
                };
                
                
                
                var data = [trace1, trace2,trace3];
                
                var layout = {barmode: 'group'};
                
                Plotly.newPlot('container', data, layout);
                
                
                
            });
         
     });
               

}]);