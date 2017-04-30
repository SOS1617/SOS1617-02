angular
    .module("G2ManagerApp")
    .controller("gdp-list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v2/gdp-population-stats";
        $scope.offset = 0;
        $scope.limit = 2;
        console.log("List controller initialized ");
        
        function checkApiKey(){
             if(!$scope.apikey){
             $scope.errorMessage = bootbox.alert("Error!! API Key is blank");
             }else{
                 if($scope.apikey != "GVAODcH3"){
                    $scope.errorMessage = bootbox.alert("Error!! API Key is not correct");
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
        
        
        //Load initial data
        $scope.loadInitialData= function(){
            checkApiKey();
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                $scope.errorMessage = bootbox.alert("Done! Initial Data was created.");
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
                    console.log("GetAllData OK");
                });
            
        } 
        
        
        /*
        //Add an element
        $scope.addData = function(){
        $http
            .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
            .then(function(response){
                console.log($scope.newCountry.country + "Data added." );
            });
        } 
        */
        
        //Edit an element
        $scope.editData = function(){
            $http
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log("editData OK");
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
                    $scope.errorMessage = bootbox.alert("All data was deleted.");
                    refresh();
                });
        }
        
        //Delete an element
        checkApiKey();
        $scope.deleteOneData = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("deleteOneData OK");
                    $scope.errorMessage = bootbox.alert("The stat was deleted.");
                    refresh();
                });
        } 
        
        
        //Search!!
        $scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&country="+$scope.newCountry.country+"&year="+$scope.newCountry.year)
                .then(function(response){
                    console.log("search OK");
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.countries = response.data;
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
}]);  