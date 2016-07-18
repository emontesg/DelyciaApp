function NotificationService($rootScope, RequestService){

	var self = this;

	self.createNotification = function(id, dishName, date)
	{
		var message = 'Hey, acuerdese de ir por ' + dishName;
	    
		cordova.plugins.notification.local.schedule({
			id: id,
			text: message,
			at: date,
			led: "FF0000",
			sound: null
		});
	};

	self.cancelNotification = function(id)
	{
		cordova.plugins.notification.local.cancel(id, function () {
    	// Notification was cancelled
		}, $rootScope);
	};

	self.updateNotification = function(id, dishName, date)
	{
		self.cancelNotification(id);
		self.createNotification(id, dishName, date);
	};

	self.knowIsNotified = function(){
		cordova.plugins.notification.local.on("trigger", function(notification) {
	    	$rootScope.$broadcast('updateState',{ id: notification.id});
	    	var obj = {
						idPlatillo : notification.id,
						reminder : 0
					};
					RequestService.setReminder(obj);
		});
	};

	return self;
}

module.exports = ['$rootScope','RequestService', NotificationService];