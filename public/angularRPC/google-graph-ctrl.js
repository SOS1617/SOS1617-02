/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GoogleGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.dataGoogle = {};
        $scope.dataRPC = {};
        var dataCacheGoogle = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Google
        $scope.areas = [];
        
        //RPCrpc
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        $scope.rpcvariationdata = {};
         
        console.log("Google graph initialized");
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS Google/////
            ////////////////////
                
     $http.get("https://restcountries.eu/rest/v2/all").then(function(response){
                console.log("entro");
                dataCacheGoogle = response.data;
                $scope.dataGoogle =dataCacheGoogle;
                
                for(var i=0; i<10; i++){
                    $scope.categorias.push($scope.dataGoogle[i].name);
                    $scope.areas.push($scope.dataGoogle[i].area);
                    
                }
                
                console.log("Datos Google: "+$scope.dataGoogle[0]);
                
                  ////////////////////
            /////DATOS RPC/////
            ////////////////////
            $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheRPC = response.data;
                $scope.dataRPC =dataCacheRPC;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataRPC[i].country);
                    $scope.rpcyear.push(Number($scope.dataRPC[i].rpcyear));
                    $scope.rpcvariation.push(Number($scope.dataRPC[i].rpcvariation));
                }
                    console.log("Datos RPC: "+$scope.dataRPC);


                    ////////////////////////////
                    ////COMPARATIVA RPC 2017////
                    ////////////////////////////
                    Highcharts.chart('container',{
                        title: {
                            text: 'WORLD RPC integrated with SEVICI'
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
                            name: 'Countries:',
                            data: $scope.categorias,
                        },
                        {
                            name: 'Area',
                            data: $scope.areas,
                        },
                        {
                            name: 'RPC Year Variation',
                            data: $scope.rpcvariation
                        }]
                    });});
         
     });
     
     
     
     //console.log(rpcvariationdata);
     
     FusionCharts.ready(function () {
    var salesChart = new FusionCharts({
    type: 'MSColumn2D',
    renderAt: 'chart-container',
    width: '600',
    height: '400',
    dataFormat: 'json',
    dataSource: {
        "chart": {
            "caption": "Sales report of Apple products",
            "subcaption": "In Billion $",
            "yaxismaxvalue": "250",
            "decimals": "0",
            "numberprefix": "$",
            "numbersuffix": "B",
            "placevaluesinside": "1",
            "rotatevalues": "0",
            "divlinealpha": "50",
            "plotfillalpha": "80",
            "drawCrossLine": "1",
            "crossLineColor": "#cc3300",
            "crossLineAlpha": "100",
            "theme": "zune"
        },
        "categories": [{
            "category": [{
                    "label": "2012"
                },
                {
                    "label": "2013"
                },
                {
                    "label": "2014"
                },
                {
                    "label": "2015"
                },
                {
                    "label": "2016"
                }
            ]
        }],
        "dataset": [{
                "seriesname": "iPod",
                "data": [$scope.rpcvariationdata
                    ]
            },
            {
                "seriesname": "iPhone",
                "data": [{
                        "value": "125.04"
                    },
                    {
                        "value": "150.26"
                    },
                    {
                        "value": "169.22"
                    },
                    {
                        "value": "231.22"
                    },
                    {
                        "value": "285.67"
                    }
                ]
            },
            {
                "seriesname": "iPad",
                "data": [{
                        "value": "58.31"
                    },
                    {
                        "value": "71.04"
                    },
                    {
                        "value": "67.99"
                    },
                    {
                        "value": "54.85"
                    },
                    {
                        "value": "60.53"
                    }
                ]
            }
        ]
    }
})
    .render();
});
               

}]);