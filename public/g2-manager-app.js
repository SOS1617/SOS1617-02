/*global angular*/

angular.module("G2ManagerApp",["ngRoute"]).config(function($routeProvider){
    
    
    $routeProvider
    .when("/",{
        templateUrl:"/principal.html"
    })
    
    ///////SMI///////
    .when("/smi",{
        templateUrl:"/angularSMI/list.html",
        controller: "SMIListCtrl"
    })
    
    .when("/smi/:country",{
        templateUrl: "/angularSMI/edit.html",
        controller: "SMIEditCtrl"
    })
    
    ///////RPC///////
    .when('/rpc',{
        templateUrl:"/angularRPC/lists.html",
        controller:"rpc-list-ctrl"
        
    })
    
    .when('/rpc/edit/:country',{
        templateUrl:"/angularRPC/edit.html",
        controller:"rpc-edit-ctrl"
    })
    
    ///////GDP///////
    .when("/gdp",{
         templateUrl : "/angularGDP/list.html",
         controller: "gdp-list-ctrl"
      })
      
      .when("/gdp/country/:name",{
         templateUrl : "/angularGDP/edit.html",
         controller: "gdp-edit-ctrl"
      });
    
    console.log("Group 2 APP Initialize");
});
            