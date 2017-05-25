/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("PAROGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataParo= {};
        $scope.dataSMI = {};
        var dataCacheParo = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //PARO
        $scope.paro = [];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS PARO/////
            ////////////////////
                
     $http.get("/api/v1/smi-stats/proxy3/" + "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheParo = response.data;
                $scope.dataParo =dataCacheParo;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataParo[i].AÃ±o);
                    $scope.paro.push(Number($scope.dataParo[i]["Total paro registrado"]));

                }
                
                console.log("Datos PARO: "+$scope.dataParo);
                
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
                            text: 'SMI WITH PARO Ayuntamiento de Arganda del Rey'
                        },
                        chart: {
                            type: 'area'
                        },
                        xAxis: {
                            categories: $scope.categorias1
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
                        series:[
                            {
                            name: 'Personas en paro',
                            data: $scope.paro,
                        },
                        {
                            name: 'SMI Year Variation',
                            data: $scope.smivariation
                        }]
                    });
                
            });
         
     });
               

}]);