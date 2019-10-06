$(document).ready(function(){

	var members = new Vue({
		el: '#app',
		data: {
			users: [
				{
					id: 1,
					name: "Pepa Reckziegel",
					avatar: "https://www.bootdey.com/img/Content/avatar/avatar3.png",
					status: "online"
				},
				{
					id: 2,
					name: "Martin Tejkl",
					avatar: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
					status: "away"
				}
			]
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