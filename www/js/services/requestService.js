var RequestService = function($http, $location, $rootScope){

    var self = this;
    //var url = $location.absUrl(),
    var url = 'http://localhost:8888/',
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
            data = {
                idUsuario : idUsuario
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        removeFavorite : function(obj){
            var route = url + backEnd + 'removeFavorite';
            data = {
                idPlatillo : obj.idPlatillo,
                idUsuario : obj.idUsuario
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        getAllReviews : function(idPlatillo){
            var route = url + backEnd + 'getAllReviews';
            data = {
                idPlatillo : idPlatillo
            };
            if (data) {
                return $http.post(route, data);
            }
        }

    };

    return serviceFunctions;

};
module.exports = ['$http', '$location', '$rootScope',RequestService];