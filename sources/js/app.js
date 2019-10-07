	$(document).ready(function(){
		
		var listOfUsers = listOfRooms = [];
		var users_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/users';
		var id = 7;

		var rooms_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/rooms';

		var avatars =  new Vue({
			el: '.avatars-box',
			data: {
				avatars: [	
					{
						"id": 1,
						"path":"sources/images/avatars/avatar1.png"
					},	
					{
						"id": 2,
						"path": "sources/images/avatars/avatar2.png"
					},	
					{
						"id": 3,
						"path": "sources/images/avatars/avatar3.png"
					},	
					{
						"id": 4,
						"path": "sources/images/avatars/avatar4.png"
					},	
					{
						"id": 5,
						"path": "sources/images/avatars/avatar5.png"
					},	
					{
						"id": 6,
						"path": "sources/images/avatars/avatar6.png"
					},	
					{
						"id": 7,
						"path": "sources/images/avatars/avatar7.png"
					}
				]
			},
			methods: {
				hasActiveClass(avatar_id) {
					return avatar_id == id ? "active" : "none";
				}
			}
		});
		
		

		var users_and_rooms = new Vue({
			el: '#users-and-rooms',
			data: {
				users: listOfUsers,
				rooms: listOfRooms
			},
			methods: {
				getAllAvatars(room) {
					var avatars = [];
					$.each(room.users, function(index, user) {
						avatars.push({
        					"avatar": user.avatar,
        					"name": user.name
        				});
    				});
    				return avatars;
				},
				loadThread(user_id) {
					loadThread(user_id);
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
				user_id: null,
				oposite_id: null
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

		$(".message").keypress(function(event) {
			if(event.which == 13) {
				console.log($(this).val());
				$(this).val('');
				$(this).putCursorAtStart();
			}
		});

		function loadThread(to) {
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

		function loadMyRooms() {
			$.ajax({
			    url: rooms_url,
			    type: 'get',
			    async: true,
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
			    async: true,
			    dataType: "json",
			    success: function(data) {
			    	users_and_rooms.users = data;
			    }
			});
		}
	});

	