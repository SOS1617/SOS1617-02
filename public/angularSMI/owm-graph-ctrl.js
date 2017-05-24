/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("OWMGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataOWM = [];
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
                
     $http.get("https://api.openweathermap.org/data/2.5/forecast?q=sevilla&APPID=5391617c203ef792feebc0037f3202ba").then(function(response){
                
                dataCacheOWM = response.data;
                $scope.dataSevici =dataCacheOWM;
                
                for(var i=0; i<5; i++){
                    $scope.categorias.push($scope.dataOWM[0].list[i].day);
                    $scope.minimos.push(Number($scope.dataOWM[0].list[i].temp_min));
                    $scope.maximos.push(Number($scope.dataOWM[0].list[i].temp_max));
                }
                
                console.log("Datos OWM: "+$scope.dataOWM[0]);
                
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
                            name: 'Temp. Máxima:',
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
                    });});
         
     });
               

}]);