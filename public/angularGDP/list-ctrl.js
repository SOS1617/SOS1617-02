angular
    .module("G2ManagerApp")
    .controller("gdp-list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v2/gdp-population-stats";
        $scope.offset = 0;
        $scope.limit = 20;
        $scope.apikey = "GVAODcH3";
        console.log("List controller initialized ");
        
        function checkApiKey(){
             if(!$scope.apikey){
             $.notify("Error! API Key was empty!", "warn");
             }else{
                 if($scope.apikey != "GVAODcH3"){
                    $.notify("Error! API Key was incorrect!", "error");
                }
             }
        }
        
        function refresh(){
             $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        refresh();
        
        //Load initial data
        $scope.loadInitialData= function(){
            checkApiKey();
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                $.notify("Load Initial data Complete!", "success");
                refresh();
            })
        }
            
        //Get every element
        $scope.getAllData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    $.notify("Get all data complete!", "success");
                    console.log("GetAllData OK");
                });
            
        } 
      
        
        //Add an element
        $scope.addData = function(){
        $http
            .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
            .then(function(response){
                console.log($scope.newCountry.country + "Data added." );
                 $.notify("Data added", "success");
                 refresh();
            });
        } 
        
        
        //Edit an element
        $scope.editData = function(){
            $http
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log("editData OK");
                     $.notify("Data updated", "success");
                    refresh();
                });
        }
        
        
        //Delete every element
        $scope.deleteAllData = function(){
            checkApiKey();
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("deleteAllData OK");
                    $.notify("All Data was deleted", "info");
                    refresh();
                });
        }
        
        //Delete an element
        $scope.deleteOneData = function(country,year){
            checkApiKey();
            $http
                .delete($scope.url +"/"+ country +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("deleteOneData OK");
                   $.notify("Load Initial data Complete!", "info");
                    refresh();
                });
        } 
        
        
        //Search!!
        $scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&country="+$scope.newCountry.country+"&year="+$scope.newCountry.year)
                .then(function(response){
                    if(response.statusCode == 404){
                        $.notify("Error 404: Not found!", "error");
                    }else{
                        console.log("search OK");
                        $.notify("Search OK", "info");
                        $scope.data = JSON.stringify(response.data, null, 2);
                        $scope.countries = response.data[0];
                    }
                });
        };
           
        //Pagination
        
        $scope.getDataPaginated = function(){
           
            checkApiKey();
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
            
        };
        
        $scope.getPreviousPage = function(){
            if($scope.offset === 0){
                return;
            }
            $scope.offset -= 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        $scope.getNextPage = function(){
            $scope.offset += 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        function getNumberOfPages(){
            
        }
}]);  