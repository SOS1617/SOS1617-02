/*global angular*/

angular.module("G2ManagerApp",["ngRoute"]).config(function($routeProvider){
    
    
    $routeProvider
    .when("/",{
        templateUrl:"/principal.html"
        //We don't need any controller here since this is a static page
    })
    .when("/analitycs",{
        templateUrl:"/analitycs.html"
        //We don't need any controller here since this is a static page
    })
    
    ///////SMI///////
    .when("/smi",{
        templateUrl:"/angularSMI/list.html",
        controller: "SMIListCtrl"
    })
    
    .when("/smi/hc-graph",{
        templateUrl: "/angularSMI/hc-graph.html",
        controller: "SMIHCGraphCtrl"
    })
    .when("/smi/gc-graph",{
        templateUrl: "/angularSMI/gc-graph.html",
        controller: "SMIGCGraphCtrl"
    })
    .when("/smi/cjs-graph",{
        templateUrl: "/angularSMI/cjs-graph.html",
        controller: "SMICJSGraphCtrl"
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
    })
    .when("/gdp/hc-graph",{
        templateUrl: "/angularGDP/hc-graph.html",
        controller: "GDPHCGraphCtrl"
    })
    .when("/gdp/gc-graph",{
        templateUrl: "/angularGDP/gc-graph.html",
        controller: "GDPGCGraphCtrl"
    })
    .when("/gdp/chtst-graph",{
        templateUrl: "/angularGDP/chtst-graph.html",
        controller: "GDPCHTSTGraphCtrl"
    });
    
    console.log("Group 2 APP Initialized");
});
            