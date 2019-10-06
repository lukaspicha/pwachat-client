	$(document).ready(function(){
		
		var listOfUsers = listOfRooms = [];
		var users_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/users';

		var rooms_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/rooms';
		
		

		var users_and_rooms = new Vue({
			el: '#users-and-rooms',
			data: {
				users: listOfUsers,
				rooms: listOfRooms
			},
			methods: {
				getAllAvatars(room) {
					console.log(room);
					var avatars = [];
					$.each(room.users, function(index, user) {
						avatars.push({
        					"avatar": user.avatar,
        					"name": user.name
        				});
    				});
    				return avatars;
				}
			}
		});

		loadMyRooms();
		loadUsers();







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
				},
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

		function loadMyRooms() {
			$.ajax({
			    url: rooms_url,
			    type: 'get',
			    async: false,
			    dataType: "json",
			    success: function(data) {
			    	users_and_rooms.rooms = data;
			    }
			});
		}

		function loadUsers() {
			$.ajax({
			    url: users_url,
			    type: 'get',
			    async: false,
			    dataType: "json",
			    success: function(data) {
			    	users_and_rooms.users = data;
			    }
			});
		}
	});

	