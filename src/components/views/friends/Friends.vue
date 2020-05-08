<template>
	<div>
		<v-tabs
		v-model="tabs"
		background-color="#121212"
		grow>
			<v-tabs-slider></v-tabs-slider>
				<v-tab>
					Pendentes
				</v-tab>
				<v-tab>
					Amigos
				</v-tab>
		</v-tabs>

		<v-tabs-items
		v-model="tabs"
		class="transparent">
			<v-tab-item
			dark
			class="py-4 px-4 tabItem"
			>
				<v-layout
				class="mt-6"
				justify-center>
					<span class="title" v-if="pedingFriends.length < 1">
						{{pendingFriendsMessage.message}}
					</span>
				</v-layout>

				<v-layout
				v-for="(pFriend, index) in pedingFriends"
				:key="pFriend.userId"
				class="my-4"
				justify-center>
					<v-card
					width="500"
						>
						<v-container
						class="py-0">
							<v-row>
								<v-col
								class="ml-2 mr-3"
								cols="2">
									<v-avatar
									color="grey darken-1"
									height="70"
									width="70">
										<v-img
										:src="pFriend.userImage">
										</v-img>
									</v-avatar>
								</v-col>
								<v-col>
									<v-row>
										<div
										class="title">
											{{pFriend.userName}}
										</div>
									</v-row>
									<v-row
									class="mt-1">
										<v-layout
										v-if="pFriend.type === 'S'"
										justify-end>
											<v-btn
											class="mx-1"
											@click="addFriend(pFriend.userId, index)">Aceitar</v-btn>
											<v-btn
											color="red darken-4"
											class="mx-2"
											@click="refuseFriend(pFriend.userId, index)">Recusar</v-btn>
										</v-layout>

										<v-layout
										v-if="pFriend.type === 'R'"
										class="text--disabled mr-3 mt-4"
										justify-end
										subtitle-1>
											Enviado
										</v-layout>
									</v-row>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-layout>
			</v-tab-item>

			<v-tab-item
			class="py-4 px-4 tabItem"
			>
				<v-layout
				class="mt-6"
				justify-center>
					<span class="title" v-if="addedFriends.length < 1">
						{{addedFriendsMessage.message}}
					</span>
				</v-layout>

				<v-layout
				v-for="(friend, index) in addedFriends"
				:key="friend.userId"
				class="my-4"
				justify-center>
					<v-card
					width="500"
						>
						<v-container
						class="py-0">
							<v-row>
								<v-col
								class="ml-2 mr-3"
								cols="2">
									<v-avatar
									color="grey darken-1"
									height="70"
									width="70">
										<v-img
										v-if="friend.userImage !== ''"
										:src="friend.userImage">
										</v-img>
										<v-icon
										size="40"
										v-else>
											fas fa-user
										</v-icon>
									</v-avatar>
								</v-col>
								<v-col>
									<v-row>
										<div
										class="title">
											{{friend.userName}}
										</div>
									</v-row>
									<v-row>
										<v-layout
										justify-end>
											<v-btn
											color="red darken-4"
											class="mr-5"
											@click="deleteFriend(friend.userId, index)">Excluir</v-btn>
										</v-layout>
									</v-row>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-layout>
			</v-tab-item>
		</v-tabs-items>

		<searchFriendBox
		@callSnackbar="callSnackbar"
		@setPedingFriend="setPedingFriend">
		</searchFriendBox>
	</div>
</template>
<script>
import CreateBtn from '@/components/views/miscellaneous/CreateButton';
import searchFriendBox from '@/components/views/friends/SearchFriendBox';

export default {
	name: 'Friends',
	components: {
		searchFriendBox: searchFriendBox,
		CreateBtn: CreateBtn
	},
	data () {
		return {
			tabs: null,
			pedingFriends: [],
			addedFriends: [],
			addedFriendsMessage: '',
			pendingFriendsMessage: '',
			triggerAddFriend: true,
			dialogData: {
				trigger: false,
				text: ''
			},
			token: JSON.parse(localStorage.userData),
			tab: 'tab-1',
			indexTab: 0,
			// Fazer diferenciação com username
			username: ''
		}
	},
	mounted () {
		this.getAddedFriends();
		this.getPedingFriends();

		this.$socket.on('inviteUser', (id) => {
			this.getFriendData(id);
		});

		this.$socket.on('inviteResponse', (object) => {
			for (let index = 0; index < this.pedingFriends.length; index += 1) {
				const pFriend = this.pedingFriends[index];

				if (pFriend.userId === object.userSenderId) {
					if (object.type === 'A') {
						pFriend.type = 'A';
						this.addedFriends.unshift(pFriend);
					}

					this.pedingFriends.splice(index, 1);

					if (object.type === 'D') {
						break;
					}
				}
			}
		});

		this.$socket.on('deleteFriend', (object) => {
			for (let index = 0; index < this.addedFriends.length; index += 1) {
				const aFriend = this.addedFriends[index];

				if (aFriend.userId === object.userSenderId) {
					this.addedFriends.splice(index, 1);
				}
			}
		});
	},
	methods: {
		getFriendData (id) {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/getFriendData/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: response.data.message
						});
						return;
					}

					this.pedingFriends.unshift({
						userId: response.data.data.ID,
						userName: response.data.data.NAME,
						userImage: response.data.data.PROFILE_IMG,
						type: 'S'
					});
				});
		},
		getPedingFriends () {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/getPedingFriends', {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.pendingFriendsMessage = response.data.message;
						return;
					}

					if (response.data.total < 1) {
						this.pendingFriendsMessage = {
							show: true,
							message: response.data.message
						}
						return;
					}

					for (let index = 0; index < response.data.data.length; index += 1) {
						const friend = response.data.data[index];

						this.pedingFriends.push({
							userId: friend.ID,
							userName: friend.NAME,
							userImage: friend.PROFILE_IMG,
							type: friend.TYPE
						});
					}
				});
		},
		getAddedFriends () {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/getAddedFriends', {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.addedFriendsMessage = response.data.message;
						return;
					}

					if (response.data.total < 1) {
						this.addedFriendsMessage = {
							show: true,
							message: response.data.message
						}
						return;
					}

					for (let index = 0; index < response.data.data.length; index += 1) {
						const friend = response.data.data[index];
						this.addedFriends.push({
							userId: friend.ID,
							userName: friend.NAME,
							userImage: friend.PROFILE_IMG
						});
					}
				})
		},
		addFriend (id, index) {
			const object = {
				friendId: id
			};
			const userData = this.decodeToken();

			this.$axios
				.put('http://localhost:8081/' + 'Friends/AddFriend', object, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: response.data.message
						});
						return;
					}

					this.pedingFriends[index].type = 'A';
					this.addedFriends.unshift(this.pedingFriends[index]);
					this.pedingFriends.splice(index, 1);

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: response.data.message
					});

					this.$socket.emit('inviteResponse', {
						type: 'A',
						socketUserId: id,
						userSenderId: userData.ID
					});
				});
		},
		refuseFriend (id, index) {
			const userData = this.decodeToken();

			this.$axios
				.delete('http://localhost:8081/' + 'Friends/deleteFriend/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: response.data.message
						});
						return;
					}

					this.pedingFriends.splice(index, 1);

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: 'Pedido de amizade negado'
					});

					this.$socket.emit('inviteResponse', {
						type: 'D',
						socketUserId: id,
						userSenderId: userData.ID
					});
				});
		},
		deleteFriend (id, index) {
			const userData = this.decodeToken();

			this.$axios
				.delete('http://localhost:8081/' + 'Friends/deleteFriend/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: response.data.message
						});
						return;
					}

					this.addedFriends.splice(index, 1);

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: response.data.message
					});

					this.$socket.emit('deleteFriend', {
						socketUserId: id,
						userSenderId: userData.ID
					});
				});
		},
		decodeToken () {
			const decoded = this.$jwt(this.token);
			return decoded.userData;
		},
		callSnackbar (presets) {
			this.$emit('callSnackbar', presets);
		},
		setPedingFriend (friend) {
			this.pedingFriends.unshift(friend);
		}
	}
}
</script>
<style>
	.textField{
		width: 70%;
	}
	.searchFriends{
		background-color: #252525;
	}
	.tabItem{
		background-color: #121212;
	}
</style>
