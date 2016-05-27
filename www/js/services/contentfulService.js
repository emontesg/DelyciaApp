var contentful = require('contentful'); 


function ContentfulService($rootScope){
	var self = this;
	var platos = [];

	var client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: 'jeecg2rod0h5',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: 'e1e84ff039e7a97a5dd97ba4104682f57f10ca912016f42d000bf22cd4f0ceee'
	});
	//640*1136

	client.getEntries({
			'content_type':'plato'
		})
		.then(function(entries){
			//console.log(entries);
			platos = entries;
			$rootScope.$broadcast('ready',entries.items);
		});

	self.getPlatos = function(){
		
		return platos;
	};

	return self;
}

module.exports = ['$rootScope',ContentfulService];