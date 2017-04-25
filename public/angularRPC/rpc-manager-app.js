angular.module("RPCManagerApp",["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when('/',{
        templateUrl:"/angularRPC/lists.html",
        controller:"list-ctrl"
        
    }).when('/edit/:country',{
        templateUrl:"/angularRPC/edit.html",
        controller:"edit-ctrl"
    }).when('/edit',{
        templateUrl:"/angularRPC/edit.html",
        controller:"edit-ctrl"
    });
    
    console.log("App initialized! & configured");
});
            