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
    .when("/integrations",{
        templateUrl:"/integrations.html"
        //We don't need any controller here since this is a static page
    })
    .when("/governance",{
        templateUrl:"/governance.html"
        //We don't need any controller here since this is a static page
    })
    .when("/about",{
        templateUrl:"/about.html"
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
    .when("/smi/proxy-graph",{
        templateUrl: "/angularSMI/proxy-graph.html",
        controller: "SMIPROXYGraphCtrl"
    })
    .when("/smi/cors-graph",{
        templateUrl: "/angularSMI/cors-graph.html",
        controller: "SMICORSGraphCtrl"
    })
    .when("/smi/sevici-graph",{
        templateUrl: "/angularSMI/sevici-graph.html",
        controller: "SEVICIGraphCtrl"
    })
    .when("/smi/paro-graph",{
        templateUrl: "/angularSMI/paro-graph.html",
        controller: "PAROGraphCtrl"
    })
    .when("/smi/owm-graph",{
        templateUrl: "/angularSMI/owm-graph.html",
        controller: "OWMGraphCtrl"
    })
    .when("/smi/health-graph",{
        templateUrl: "/angularSMI/health-graph.html",
        controller: "HTGraphCtrl"
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
    
    .when("/rpc/hc-graph",{
        templateUrl: "/angularRPC/hc-graph.html",
        controller: "RPCHCGraphCtrl"
    })
    
    .when("/rpc/gc-graph",{
        templateUrl: "/angularRPC/gc-graph.html",
        controller: "RPCGCGraphCtrl"
    })
    
    .when("/rpc/cc-graph",{
        templateUrl: "/angularRPC/cc-graph.html",
        controller: "RPCCCGraphCtrl"
    })
    
    .when("/rpc/proxy-graph",{
        templateUrl: "/angularRPC/proxy-graph.html",
        controller: "RPCPROXYGraphCtrl"
    })
    
    .when("/rpc/cors-graph",{
        templateUrl: "/angularRPC/cors-graph.html",
        controller: "RPCCORSGraphCtrl"
    })
    .when("/rpc/google-graph",{
        templateUrl: "/angularRPC/google-graph.html",
        controller: "GoogleGraphCtrl"
    })
    .when("/rpc/netflix-graph",{
        templateUrl: "/angularRPC/netflix-graph.html",
        controller: "NetflixGraphCtrl"
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
    })
    .when("/gdp/cors-graph",{
        templateUrl: "/angularGDP/cors-graph.html",
        controller: "GDPCORSGraphCtrl"
    })
    .when("/gdp/proxy-graph",{
        templateUrl: "/angularGDP/proxy-graph.html",
        controller: "GDPPROXYGraphCtrl"
    })
    .when("/gdp/btc-graph",{
        templateUrl: "/angularGDP/btc-graph.html",
        controller: "BTCGraphCtrl"
    })
    .when("/gdp/price-graph",{
        templateUrl: "/angularGDP/price-graph.html",
        controller: "PRICEGraphCtrl"
    })
    ;
    
    
    console.log("Group 2 APP Initialized");
});
            