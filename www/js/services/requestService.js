var RequestService = function($http, $location){

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
                idUsuario : obj.idUsuario,
                fechaHora : obj.fechaHora,
                };

            if (data) {
                return $http.post(route, data).then(function(response){});
            }
        },

    };

    return serviceFunctions;

};
module.exports = ['$http', '$location',RequestService];