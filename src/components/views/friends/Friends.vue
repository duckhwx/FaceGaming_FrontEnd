<template>
	<div>
		<v-row
		class="justify-start searchFriends">
			<v-col
			class="py-2 ml-6"
			cols="8">
				<v-form
				ref="searchUser">
						<v-text-field
						v-model="searchNickname"
						hide-details
						:rules="rules"
						filled
						rounded
						dense
						placeholder="Digite um nome de um usuário..."
						append-icon="fas fa-search"
						></v-text-field>
				</v-form>
			</v-col>
			<v-col
			class="d-inline justify-end">
				<v-layout
				justify-start>
					<v-btn
					@click="inviteUser">Adicionar</v-btn>
				</v-layout>
			</v-col>
		</v-row>

		<v-tabs
		v-model="tab"
		background-color="#121212"
		grow>
			<v-tabs-slider></v-tabs-slider>
			<v-tab>
				Pendentes
			</v-tab>
			<v-tab>
				Amigos
			</v-tab>

			<v-tab-item
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
		</v-tabs>
	</div>
</template>
<script>
export default {
	name: 'Friends',
	data () {
		return {
			pedingFriends: [],
			addedFriends: [],
			addedFriendsMessage: '',
			pendingFriendsMessage: '',
			searchNickname: '',
			rules: [
				v => !!v || 'Nickname requisitado',
				v => v.length <= 24 || 'Nickname deve ter no maximo 24 caracteres',
				v => /^[A-Za-z]+$/.test(v) || 'Apenas caracteres do alfabeto'
			],
			token: JSON.parse(localStorage.userData),
			tab: 'tab-1',
			indexTab: 0
		}
	},
	mounted () {
		this.getAddedFriends();
		this.getPedingFriends();
		// this.updateFriends();

		this.$socket.on('inviteUser', () => {
			this.getPedingFriends();
		});
	},
	methods: {
		updateFriends () {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/selectFriends', {
					headers: { token: this.token }
				})
				.then((response) => {
					this.friends = response.data.data;
				})
		},
		getPedingFriends () {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/getPedingFriends', {
					headers: { token: this.token }
				})
				.then((response) => {
					console.log(response);
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
					this.pedingFriends = [];

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

					this.addedFriends = [];

					for (let index = 0; index < response.data.data.length; index += 1) {
						const friend = response.data.data[index];
						this.addedFriends.push({
							userId: friend.ID,
							userName: friend.NAME,
							userImage: friend.PROFILE_IMG
						});
					}
					// this.friends2 = response.data.data;
				})
		},
		addFriend (id, index) {
			const object = {
				friendId: id
			};

			this.$axios
				.put('http://localhost:8081/' + 'Friends/AddFriend', object, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
							message: response.data.message
						});
						return;
					}

					this.pedingFriends.splice(index, 1);
					this.getAddedFriends();

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: response.data.message
					});
				});
		},
		refuseFriend (id, index) {
			this.$axios
				.delete('http://localhost:8081/' + 'Friends/deleteFriend/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
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
				});
		},
		deleteFriend (id, index) {
			this.$axios
				.delete('http://localhost:8081/' + 'Friends/deleteFriend/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
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
				});
		},
		inviteUser () {
			if (this.$refs.searchUser.validate()) {
				const object = {
					nickname: this.searchNickname
				}

				this.$axios
					.post('http://localhost:8081/' + 'Friends/inviteUser', object, {
						headers: { token: this.token }
					})
					.then((response) => {
						if (response.data.error) {
							this.$emit('callSnackbar', {
								trigger: true,
								color: 'red',
								message: response.data.message
							});
							return;
						}

						this.pedingFriends.unshift({
							userId: response.data.data.ID,
							userName: response.data.data.NAME,
							userImage: response.data.data.PROFILE_IMG,
							type: 'R'
						});

						this.$emit('callSnackbar', {
							trigger: true,
							color: 'dark',
							message: response.data.message
						});

						this.$socket.emit('inviteUser', response.data.data.ID);
					});
			}
		}
	}
}
</script>

<style>
	.searchFriends{
		background-color: #252525;
	}
	.tabItem{
		background-color: #121212;
	}
</style>
