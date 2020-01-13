	
		
			
		var users_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/users';
		var id = 1;
		var message = "";

		var rooms_url = 'https://private-d70ba-pwachat.apiary-mock.com/v1/rooms';
		
	
		const connection = new WebSocket('ws://localhost:19957');


		connection.onopen = (data) => {
			console.log('opening new connection');
			u = JSON.parse(localStorage.getItem('user'));
			connection.send(u._id);
		};


		connection.onmessage = (event) => {

			received_data = JSON.parse(event.data);

			console.log(received_data.type);
			
			switch(received_data.type) {
				case '#UPDATE-USERS':
  					app.loadUsers();
					break;
				case '#NEW-MESSAGE':
  					app.getMessagesByWebSocket(received_data.data.sender);
  					break;
  				case '#UPDATE-AVATARS':
  					app.loadAvatars();
				default:
					console.log('Invalid protokol id');
					break;
			} 
		};

		var app = new Vue({
			el: '.app',
			data () {
				return {
					logged: false,
					id: "",
					password: "",
					user: null,
					avatars: [],
					states: [],
					state: "online",
					users: [],
					rooms: [],
					conversation: [],
					receiver: null,
					message: null,
					oposite_name: null,
					avatar: null,
				}
			},

			methods: {
				recoveryFromStorage: function() {
					u = JSON.parse(localStorage.getItem('user'));
					if(u) {
            			this.user = u;
            			this.logged = true;
            			console.log('mame');
            		} else {
            			this.user = null;
            			this.logged = false;
            			console.log('nic nemame');
            		}
				},
				login: async function (event) {
					try {
						const response = await axios.post('http://localhost:3000/v1/auth/login/', {id: this.id, password: this.password});
						if(response.status == 200) {
							this.logged = true;
							this.user = response.data.data;
							localStorage.setItem('user', JSON.stringify(this.user));
						} else {

						}
					} catch(err) {
						console.log(err);
					}
				},
				logout: async function(event) {
					try {
						const response = await axios.put('http://localhost:3000/v1/auth/logout', {id: this.id});
						console.log(response);
						if(response.status == 200) {
							this.logged = false;
						} else {

						}
					} catch(err) {
						console.log(err);
					}
				},
				loadAvatars() {
					axios
						.get('http://localhost:3000/v1/avatars/')
						.then(response => {
							this.avatars = response.data
						})
						.catch(error => {
							console.log(error)
						})
				},
				loadStates() {
					axios
						.get('http://localhost:3000/v1/states/')
						.then(response => {
							this.states = response.data
						})
						.catch(error => {
							console.log(error)
						})
				},
				loadUsers: function () {
					axios
						.get('http://localhost:3000/v1/users/')
						.then(response => {
							listOfUsers = [];
							response.data.forEach((user) => {
								//nechceme vykreslit sebe
								if(user._id != this.user._id) {
									listOfUsers.push(user);
								}
							});
							this.users = listOfUsers;
						})
						.catch(error => {
							console.log(error)
						})
 	 			},
				hasActiveClass(avatar_id) {
					return avatar_id == this.user.avatar._id ? "active" : "none";
				},
				changeUserAvatar(avatar_id) {
					this.updateUser({
						avatar: avatar_id
					});
					this.avatar = avatar_id;
				},
				changeUserState() {
					this.updateUser({
						status: this.state
					});
				},
				changeUserName() {
					this.updateUser({
						name: this.userName
					});
				},
				updateUser(data) {
					axios
						.put('http://localhost:3000/v1/users/' + this.userId, data)
	    				.then(function (response) {
	    					connectedUser = response.data;
	    				})
    					.catch(function (error) {
							console.log(error);
						})
				},
				loadRooms: function () {
 					axios
 						.get('http://localhost:3000/v1/rooms/')
						.then(response => {
							this.rooms = response.data;
						})
						.catch(error => {
							console.log(error)
						})
 				},
				loadMessages(receiver) {
					console.log('doo');
					console.log('http://localhost:3000/v1/messages/' + this.user._id + '/' + receiver._id);
					axios
 						.get('http://localhost:3000/v1/messages/' + this.user._id + '/' + receiver._id)
						.then(response => {
							this.conversation = response.data;
						})
						.catch(error => {
							console.log(error)
						});

					this.receiver = receiver;	
					this.oposite_name = receiver.name;	
				},
				getAvatarSrc(avatar_id) {
					return "sources/images/avatars/avatar" + avatar_id + '.png';
				},
				createRoom() {
					axios
 						.post('http://localhost:3000/v1/rooms/create/' + this.user._id)
						.then(response => {
							console.log(response.data);
						})
						.catch(error => {
							console.log(error)
						})
				},
				chatSide(userId) {
					return userId == this.user._id ? "chat-left" : "chat-right";
				},
				convertDate(date) {
					d = new Date(date);
					return d.toLocaleString();
				},

				sendMessage() {
					const data = {
						receiver_id: this.receiver._id,
						text: this.message
					};


					console.log('odesilam: ', data);

					axios
	    				.post('http://localhost:3000/v1/messages/' + this.user._id, data)
	    				.then(function (response) {	
	    					console.log('odeslano');

	    					if (connection.isOpen()) {
	    						console.log('otevreno');
								connection.send(data.message);
	    					} else {
	    						console.log('zavreno');
	    					}
						})
						.catch(function (error) {
							console.log(error);
						});

					this.conversation.push();


				},
				getMessagesByWebSocket(sender_id) {
					console.log('from socket: ' + sender_id);
					console.log('ME socket: ' + this.user._id);
					axios
 						.get('http://localhost:3000/v1/messages/' + sender_id + '/' + this.user._id)
						.then(response => {

							this.conversation = response.data;
							console.log(response.data);
						})
						.catch(error => {
							console.log(error)
						});
				}
			},
			created: function() {
				this.recoveryFromStorage();
				this.loadAvatars();
				this.loadStates();
				this.loadUsers();
				//sthis.loadRooms();
			}
		});

		
		// var user_container = new Vue({
		// 	el: '.user-container',
		// 	data () {
		// 		return {
		// 			id: "",
		// 			password: "",
		// 			logged: false,
		// 			user: null,
		// 			avatars: [],
		// 			states: [],
		// 			userName: JSON.parse(localStorage.getItem('user')).name,
		// 			userId: JSON.parse(localStorage.getItem('user'))._id,
		// 			state: "online",
		// 			avatar: JSON.parse(localStorage.getItem('user')).avatar,
		// 		}
		// 	},
		// 	methods: {
		// 		login: async function (event) {
		// 			try {
		// 				const response = await axios.post('http://localhost:3000/v1/auth/login/', {id: this.id, password: this.password});
		// 				if(response.status == 200) {
		// 					this.logged = true;
		// 					this.user = response.data.data;

		// 					this.userLogged = true;


		// 				} else {

		// 				}
		// 			} catch(err) {
		// 				console.log(err);
		// 			}
		// 		},
		// 		logout: async function(event) {
		// 			try {
		// 				const response = await axios.put('http://localhost:3000/v1/auth/logout', {id: this.id});
		// 				console.log(response);
		// 				if(response.status == 200) {
		// 					this.logged = false;
		// 				} else {

		// 				}
		// 			} catch(err) {
		// 				console.log(err);
		// 			}
		// 		},
		// 		loadAvatars() {
		// 			axios
		// 				.get('http://localhost:3000/v1/avatars/')
		// 				.then(response => {
		// 					this.avatars = response.data
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
		// 		},
		// 		loadStates() {
		// 			axios
		// 				.get('http://localhost:3000/v1/states/')
		// 				.then(response => {
		// 					this.states = response.data
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
		// 		},
		// 		hasActiveClass(avatar_id) {
		// 			return avatar_id == this.user.avatar._id ? "active" : "none";
		// 		},
		// 		changeUserAvatar(avatar_id) {
		// 			this.updateUser({
		// 				avatar: avatar_id
		// 			});
		// 			this.avatar = avatar_id;
		// 		},
		// 		changeUserState() {
		// 			this.updateUser({
		// 				status: this.state
		// 			});
		// 		},

		// 		changeUserName() {
		// 			this.updateUser({
		// 				name: this.userName
		// 			});
		// 		},

		// 		updateUser(data) {
		// 			axios
		// 				.put('http://localhost:3000/v1/users/' + this.userId, data)
	 //    				.then(function (response) {
	 //    					connectedUser = response.data;
	 //    				})
  //   					.catch(function (error) {
		// 					console.log(error);
		// 				})
		// 		}
		// 	},
		// 	created: function() {
		// 		this.loadAvatars();
		// 		this.loadStates();
		// 	}
		// });



		// var users_and_rooms = new Vue({
		// 	el: '.users-and-rooms',
		// 	data () {
		// 		return {
		// 			users: [],
		// 			rooms: [],
		// 			user: JSON.parse(localStorage.getItem('user')),
		// 			conversation: [],
		// 			receiver: null,
		// 			message: null,
		// 			oposite_name: null
		// 		}
		// 	},
		// 	methods: {
		// 		getRoomAvatars(room) {
		// 			avatars_srcs = [];
		// 			room.users.forEach((user_id, index) => {
		// 				axios
		// 				.get('http://localhost:3000/v1/users/' + user_id)
		// 				.then(response => {
		// 					avatars_srcs.push(response.data.avatar_id);
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
  //   				});
  //   				return avatars_srcs;
		// 		},
		// 		loadUsers: function () {

		// 			axios
		// 				.get('http://localhost:3000/v1/users/')
		// 				.then(response => {
		// 					listOfUsers = [];
		// 					response.data.forEach((user) => {
		// 						//nechceme vykreslit sebe
		// 						if(user._id != this.user._id) {
		// 							listOfUsers.push(user);
		// 						}
		// 					});
		// 					this.users = listOfUsers;
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
 	// 			},
 	// 			loadRooms: function () {
 	// 				axios
 	// 					.get('http://localhost:3000/v1/rooms/')
		// 				.then(response => {
		// 					this.rooms = response.data;
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
 	// 			},
		// 		loadMessages(receiver) {
		// 			console.log('doo');
		// 			console.log('http://localhost:3000/v1/messages/' + this.user._id + '/' + receiver._id);
		// 			axios
 	// 					.get('http://localhost:3000/v1/messages/' + this.user._id + '/' + receiver._id)
		// 				.then(response => {
		// 					this.conversation = response.data;
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				});

		// 			this.receiver = receiver;	
		// 			this.oposite_name = receiver.name;	
		// 		},
		// 		getAvatarSrc(avatar_id) {
		// 			return "sources/images/avatars/avatar" + avatar_id + '.png';
		// 		},
		// 		createRoom() {
		// 			axios
 	// 					.post('http://localhost:3000/v1/rooms/create/' + this.user._id)
		// 				.then(response => {
		// 					console.log(response.data);
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				})
		// 		},
		// 		chatSide(userId) {
		// 			return userId == this.user._id ? "chat-left" : "chat-right";
		// 		},
		// 		convertDate(date) {
		// 			d = new Date(date);
		// 			return d.toLocaleString();
		// 		},
		// 		sendMessage() {
		// 			const data = {
		// 				receiver_id: this.receiver._id,
		// 				text: this.message
		// 			};


		// 			console.log('odesilam: ', data);

		// 			axios
	 //    				.post('http://localhost:3000/v1/messages/' + this.user._id, data)
	 //    				.then(function (response) {	
	 //    					console.log('odeslano');

	 //    					if (connection.isOpen()) {
	 //    						console.log('otevreno');
		// 						connection.send(data.message);
	 //    					} else {
	 //    						console.log('zavreno');
	 //    					}
		// 				})
		// 				.catch(function (error) {
		// 					console.log(error);
		// 				});

		// 			this.conversation.push()


		// 		},
		// 		getMessagesByWebSocket(sender_id) {
		// 			console.log('from socket: ' + sender_id);
		// 			console.log('ME socket: ' + this.user._id);
		// 			axios
 	// 					.get('http://localhost:3000/v1/messages/' + sender_id + '/' + this.user._id)
		// 				.then(response => {

		// 					this.conversation = response.data;
		// 					console.log(response.data);
		// 				})
		// 				.catch(error => {
		// 					console.log(error)
		// 				});
		// 		}
		// 	},

		// 	created: function() {
		// 		this.loadUsers();
		// 		this.loadRooms();
		// 	}
		// });


		//test
		var title = new Vue({
			el: '.appname',
			data: {
				title: 'PWAChat'
			}
		});

		// var conversation = new Vue({
		// 	el: "#thread-panel",
		// 	data () {
		// 		return {
		// 			conversation: null,
		// 			user_id: null,
		// 			oposite_id: null,
		// 			message: null
		// 		}
		// 	},
		// 	methods: {
		// 		chatSide(userId) {
		// 			return userId == 1 ? "chat-left" : "chat-right";
		// 		},
		// 		convertDate(date) {
		// 			d = new Date(date);
		// 			return d.toLocaleString();
		// 		},

		// 		sendMessage() {
		// 			const data = {
		// 				receiver_id: this.oposite_id,
		// 				text: this.message
		// 			};

		// 			axios
	 //    				.post('http://localhost:3000/v1/messages/' + connectedUser._id, data)
	 //    				.then(function (response) {	
		// 					connection.send(data.message);
		// 				})
		// 				.catch(function (error) {
		// 					console.log(error);
		// 				})


		// 		}
		// 	}
		// });

		

		// $("#loading").hide();
		// $("#main-container").show();
