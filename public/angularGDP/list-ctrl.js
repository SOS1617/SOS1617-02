angular
    .module("GdpManagerApp")
    .controller("list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v2/gdp-population-stats";
        $scope.offset = 0;
        $scope.limit = 2;
        console.log("List controller initialized ");
        
        //Load initial data
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
            
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
        
        
        
        //Add an element
        $scope.addData = function(){
        $http
            .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
            .then(function(response){
                console.log($scope.newCountry.country + "Data added." );
            });
        } 
        
        //Edit an element
        $scope.editData = function(){
            $http
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log("editData OK");
                });
        }
        
        
        //Delete every element
        $scope.deleteAllData = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("deleteAllData OK");
                });
        }
        
        //Delete an element
        $scope.deleteOneData = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("deleteOneData OK");
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