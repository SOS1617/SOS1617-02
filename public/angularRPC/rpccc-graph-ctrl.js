/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCCCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        $scope.res=[
            { label: "España",  y: 10  },
				{ label: "Grecia", y: 15  },
				{ label: "Australia", y: 25  },
				{ label: "Marruecos",  y: 30  },
				{ label: "Gibraltar",  y: 28  },
				{ label: "Venezuela",  y: 28  }];
        $scope.ee=[{ label: "España",  y: 10  },
				{ label: "Grecia", y: 15  },
				{ label: "Australia", y: 25  },
				{ label: "Marruecos",  y: 30  },
				{ label: "Gibraltar",  y: 28  },
				{ label: "Venezuela",  y: 28  }];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data =dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.rpcyear.push(Number($scope.data[i].rpcyear));
                $scope.rpcvariation.push(Number($scope.data[i].rpcvariation));
                
                console.log($scope.data[i].country);

            }
            
            for(var i=0; i<response.data.length; i++){
                $scope.res.push({ "label": $scope.data[i].country,  "y":$scope.data[i].rpcyear});
            }
        });    
           
        console.log("Controller initialized");
        
       
    var chart = new CanvasJS.Chart("chartContainer", {
  title: {
    text: "RPC Year"
  },
  axisX: {
    title: "Countries"
  },
  axisY: {
    title: "Rpc variation"
  },
  data: [{
    type: "bar",
    dataPoints:$scope.res
  }]
});
	chart.render();

    }]);