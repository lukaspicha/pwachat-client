$(document).ready(function(){
	
	var listOfUsers = [];
	var url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/users';
	
	$.ajax({
	    url: url,
	    type: 'get',
	    async: false,
	    dataType: "json",
	    success: function(data) {
	    	listOfUsers = data;
	    }
	});

	var members = new Vue({
		el: '#app',
		data: {
			users: listOfUsers
		}
	});

	//test
	var title = new Vue({
		el: '.appname',
		data: {
			title: 'PWAChat'
		}
	});
});