/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("HTGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataHEALTH = {};
        $scope.dataSMI = {};
        var dataCacheHEALTH = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //HEALTH
        $scope.res = [];
        $scope.res1 = [];
        $scope.cantidad = [];
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
                
     $http.get("/api/v2/smi-stats/proxy4/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheHEALTH = response.data;
                $scope.dataHEALTH =dataCacheHEALTH;
                
                for(var i=0; i<10; i++){
                    $scope.categorias.push($scope.dataHEALTH[i].BENEFICIARIO);
                    $scope.cantidad.push(Number($scope.dataHEALTH[i]["SUBVENCIÓN EN EUROS"]));

                    
                        $scope.res.push({ "label": $scope.categorias[i],  "y":$scope.cantidad[i]});
                    
                }
                
                console.log("Datos HEALTH: "+$scope.dataHEALTH);
                
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
                    
                    
                   
                    $scope.res1.push({ "label": $scope.categorias[i],  "y":$scope.smiyear[i]});
                    
                }
                    console.log("Datos SMI: "+$scope.dataSMI);


                    ////////////////////////////
                    ////COMPARATIVA SMI 2017////
                    ////////////////////////////
                    
                    
                    var chart = new CanvasJS.Chart("container",
                    {
                      title:{
                        text: "Integration of the Health grant and G02-SMI API."
                      },
                      animationEnabled: true,
                      legend: {
                        cursor:"pointer",
                        itemclick : function(e) {
                          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                              e.dataSeries.visible = false;
                          }
                          else {
                              e.dataSeries.visible = true;
                          }
                          chart.render();
                        }
                      },
                      axisY: {
                        title: "Subvención en euros"
                      },
                      toolTip: {
                        shared: true,  
                        content: function(e){
                          var str = '';
                          var total = 0 ;
                          var str3;
                          var str2 ;
                          for (var i = 0; i < e.entries.length; i++){
                            var  str1 = "<span style= 'color:"+e.entries[i].dataSeries.color + "'> " + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ; 
                            total = e.entries[i].dataPoint.y + total;
                            str = str.concat(str1);
                          }
                          str2 = "<span style = 'color:DodgerBlue; '><strong>"+e.entries[0].dataPoint.label + "</strong></span><br/>";
                          str3 = "<span style = 'color:Tomato '>Total: </span><strong>" + total + "</strong><br/>";
                          
                          return (str2.concat(str)).concat(str3);
                        }
                
                      },
                      data: [
                      {        
                        type: "bar",
                        showInLegend: true,
                        name: "Subvención en €",
                        color: "gold",
                        dataPoints: $scope.res
                      },
                      {        
                        type: "bar",
                        showInLegend: true,
                        name: "SMI YEAR",
                        color: "silver",          
                        dataPoints: $scope.res1
                      }
                      ]
                    });
                
                chart.render();
                
                
            });
         
     });
               

}]);