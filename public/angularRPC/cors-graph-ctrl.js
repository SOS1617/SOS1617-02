/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCCORSGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.dataSU = {};
        $scope.dataRPC = {};
        var dataCacheSU = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Irene
        $scope.years = [];
        $scope.totals = [];
        $scope.increases =[];
        $scope.investments =[];
        //RPC
        $scope.rpcyear = [];
        $scope.rpcvariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS IRENE/////
            ////////////////////
                
     $http.get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701").then(function(response){
                
                dataCacheSU = response.data;
                $scope.dataSU =dataCacheSU;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataSU[i].country);
                    $scope.years.push(Number($scope.dataSU[i].year));
                    $scope.totals.push(Number($scope.dataSU[i].total));
                    $scope.increases.push(Number($scope.dataSU[i].increase));
                    $scope.investments.push(Number($scope.dataSU[i].investment));
                }
                
                console.log("Datos Irene: "+$scope.dataSU);
                
                  ////////////////////
            /////DATOS RPC/////
            ////////////////////
            $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheRPC = response.data;
                $scope.dataRPC =dataCacheRPC;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataRPC[i].country);
                    $scope.rpcyear.push(Number($scope.dataRPC[i].rpcyear));
                    $scope.rpcvariation.push(Number($scope.dataRPC[i].rpcvariation));
                }
                    console.log("Datos RPC: "+$scope.dataRPC);


                    ////////////////////////////
                    ////COMPARATIVA RPC 2017////
                    ////////////////////////////
                    
                
                Highcharts.chart('container1', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'World RPC stats ingrated with Start-ups stats'
    },
    subtitle: {
        text: 'Source: RPC-Stats API & startups-stats API'
    },
    xAxis: [{
        categories: $scope.categorias,
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}%',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Investments',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Rpc-Variation',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} $',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [{
        name: 'Investments',
        type: 'column',
        yAxis: 1,
        data: $scope.investments,
        tooltip: {
            valueSuffix: '$'
        }

    }, {
        name: 'Rpc-variation',
        type: 'spline',
        data: $scope.rpcvariation,
        tooltip: {
            valueSuffix: '%'
        }
    }]
});
                
                
        

                
                
                
                
                
                
                
            });
         
     });
               

}]);