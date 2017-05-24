/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("G02GraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikeySMI = "rXD8D2b1vP";
        $scope.apikeyGDP = "GVAODcH3";
        $scope.apikeyRPC = "GVAODcH3";
        $scope.dataGDP = {};
        $scope.dataSMI = {};
        $scope.dataSRPC = {};
        var dataCacheGDP = {};
        var dataCacheSMI = {};
        var dataCacheRPC = {};
        
        $scope.categorias = [];
        $scope.categorias1 = [];
        $scope.categorias2 = [];
        //GDP
        $scope.gdpyear = [];
        $scope.populationyear = [];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];
        //RPC
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS GDP/////
            ////////////////////
                
     $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikeyGDP).then(function(response){
                
                dataCacheGDP = response.data;
                $scope.dataGDP =dataCacheGDP;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataGDP[i].country);
                    $scope.gdpyear.push(Number($scope.dataGDP[i]["gdp-year"]));
                    $scope.populationyear.push(Number($scope.dataGDP[i]["population-year"]));
                }
                
                console.log("Datos GDP: "+$scope.dataSevici);
                
            ////////////////////
            /////DATOS SMI/////
            ////////////////////
            $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikeySMI).then(function(response){
                
                dataCacheSMI = response.data;
                $scope.dataSMI =dataCacheSMI;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataSMI[i].country);
                    $scope.smiyear.push(Number($scope.dataSMI[i]["smi-year"]));
                    $scope.smivariation.push(Number($scope.dataSMI[i]["smi-year-variation"]));
                }
                    console.log("Datos SMI: "+$scope.dataSMI);
                    
                    ////////////////////
                    /////DATOS RPC/////
                    ////////////////////
                    $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikeyRPC).then(function(response){
                
                        dataCacheRPC = response.data;
                        $scope.dataRPC =dataCacheRPC;
                        
                        for(var i=0; i<response.data.length; i++){
                            $scope.categorias2.push($scope.dataRPC[i].country);
                            $scope.rpcyear.push(Number($scope.dataRPC[i].rpcyear));
                            $scope.rpcvariation.push(Number($scope.dataRPC[i].rpcvariation));
                        }
                            console.log("Datos RPC: "+$scope.dataSMI);
                            
                            
                            ////////////////////////////
                        ////COMPARATIVA GDP-SMI-RPC////
                        ////////////////////////////
                        Highcharts.chart('container',{
                            title: {
                                text: 'GROUP 02 APIs INTEGRATION'
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
                                name: 'SMI YEAR',
                                data: $scope.smiyear,
                            },
                            {
                                name: 'RPC YEAR',
                                data: $scope.rpcyear,
                            },
                            {
                                name: 'GDP YEAR',
                                data: $scope.gdpyear
                            }]
                        });
                        
                    });//FIN RPC
                    
            });//FIN SMI
         
     });//FIN GDP
               

}]);