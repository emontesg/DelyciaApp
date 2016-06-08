var RequestService = function($http, $location, $rootScope){

    var self = this;
    //var url = $location.absUrl(),
    var url = 'http://localhost/',
    backEnd = 'delycia/back-end/app/';

    self.myPublicFunction = function()
    {
        myPrivateFunction();  
    };
    
    function myPrivateFunction()
    {
        
    }

    var serviceFunctions = {

        getAll: function(){
            var route = url + backEnd + 'getAll';
            return $http.get(route);
        },

        addFavorite : function(obj){
            var route = url + backEnd + 'addFavorite';
            data = {   
                idPlatillo : obj.idPlatillo,
                idUsuario : obj.idUsuario
                };

            if (data) {
                return $http.post(route, data).then(function(response){});
            }
        },

        getAllFavorites : function(idUsuario){
            var route = url + backEnd + 'getAllFavorites';
            //$rootScope.allData = [];
            data = {
                idUsuario : idUsuario
            };

            // if (data) {
            //     $http.post(route, data).then(function(response){
            //         $rootScope.allData = response.data;
            //         console.log($rootScope.allData);
            //     });
            // }else{
            //     console.log("no estoy entrando");
            // }
            // console.log($rootScope.allData);
            if (data) {
                return $http.post(route, data);
            }
        }

    };

    return serviceFunctions;

};
module.exports = ['$http', '$location', '$rootScope',RequestService];