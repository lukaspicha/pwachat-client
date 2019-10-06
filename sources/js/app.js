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
		el: '#list-of-users',
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
	var conversation = new Vue({
			el: "#thread-panel",
			data: {
				conversation: null,
				user_id: null
			},
			methods: {
				chatSide(userId) {
					return userId == 1 ? "chat-left" : "chat-right";
				},
				convertDate(date) {
					d = new Date(date);
					return d.toLocaleString();
				}
			}
		});

	function loadThread(to) {
		console.log(to);
		var thread = [
			{
				"user": {
					"id": 1,
                	"name": "Martin Tejkl",
                	"avatar": "https://www.bootdey.com/img/Content/avatar/avatar3.png",
                	"status": "online"
				},
				"message": "<p>Hello bro, how are you?<br>Can we discuss our semestral project?</p>",
				"created_at": "2014-03-12T13:37:27+00:00"
			},
			{
				"user": {
	                "id": 2,
	                "name": "Pepa Reckziegel",
	                "avatar": "https://www.bootdey.com/img/Content/avatar/avatar2.png",
	                "status": "busy"
            	},
				"message": "<p>No<br>I'm little busy.</p>",
				"created_at": "2014-03-12T13:37:27+00:00"
			}
		];
		conversation.user_id = 1;
		conversation.conversation = thread;
		conversation.oposite_id = to;


		

	}


	$(".person").click(function() {
		loadThread($(this).attr('data-chat'));
	});
});