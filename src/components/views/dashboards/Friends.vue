<template>
  <div>
		<v-card>
			<v-tabs
			fixed-tabs
			dark
			v-model="tab"
			centered
			icons-and-text>
				<v-tabs-slider></v-tabs-slider>
				<v-tab href="#tab-1">Pendentes</v-tab>
				<v-tab href="#tab-2">Amigos</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item :value="'tab-1'">
						<v-container>
							<v-row>
								<v-layout flex justify-center v-for="friend in friends" v-bind:key="friend.ID" align-center>
									<v-flex xs12 sm6>
										<v-card dark class="mx-auto">
											<v-list>
												<v-list-item>
													<v-list-item-avatar size="65">
														<v-img src="https://scontent.ffln2-1.fna.fbcdn.net/v/t1.0-9/17759737_587434668117902_4071095319899858470_n.jpg?_nc_cat=101&_nc_ohc=yVS6u26sDYYAX-Suc-k&_nc_ht=scontent.ffln2-1.fna&oh=3238e757ed57458c90538d45fb433c69&oe=5ECED5F9"></v-img>
													</v-list-item-avatar>
													<v-list-item-content>
														<v-text class="text-md-left">{{friend.NAME}} {{friend.LASTN}}</v-text>
													</v-list-item-content>
												</v-list-item>
											<v-btn @click="acceptFriends(friend.ID)">Aceitar</v-btn>
											<v-btn @click="cancelFriends(friend.ID)">Recusar</v-btn>
											</v-list>
										</v-card>
									</v-flex>
								</v-layout>
							</v-row>
						</v-container>
				</v-tab-item>
				<v-tab-item :value="'tab-2'" class="tabFriend">
					<v-container>
						<v-card flat class="cardFriend">
							<v-layout justify-center v-for="friend2 in friends2" v-bind:key="friend2.ID" align-center>
								<v-flex xs12 sm6>
									<v-card dark>
										<v-list>
											<v-list-item>
												<v-list-item-avatar size="65">
													<v-img src="https://scontent.ffln2-1.fna.fbcdn.net/v/t1.0-9/17759737_587434668117902_4071095319899858470_n.jpg?_nc_cat=101&_nc_ohc=yVS6u26sDYYAX-Suc-k&_nc_ht=scontent.ffln2-1.fna&oh=3238e757ed57458c90538d45fb433c69&oe=5ECED5F9"></v-img>
												</v-list-item-avatar>
												<v-list-item-content>
													<v-text class="text-md-left">{{friend2.NAME}} {{friend2.LASTN}}</v-text>
												</v-list-item-content>
											</v-list-item>
										<v-btn @click="cancelFriends(friend2.ID)">Desfazer amizade</v-btn>
										</v-list>
									</v-card>
								</v-flex>
							</v-layout>
						</v-card>
					</v-container>
				</v-tab-item>
			</v-tabs-items>
		</v-card>
  </div>
</template>

<script>
export default {
	name: 'Friends',
	components: {
	},
	data () {
		return {
			friends: [],
			friends2: [],
			token: JSON.parse(localStorage.userData),
			tab: 'tab-1',
			indexTab: 0
		}
	},
	mounted () {
		this.listFriends();
		this.updateFriends();
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
		listFriends () {
			this.$axios
				.get('http://localhost:8081/' + 'Friends/listFriendss', {
					headers: { token: this.token }
				})
				.then((response) => {
					this.friends2 = response.data.data;
				})
		},
		acceptFriends (data) {
			const params = {
				friendId: data
			};
			this.$axios
				.put('http://localhost:8081/' + 'Friends/acceptFriends', params, {
					headers: { token: this.token }
				})
				.then((response) => {
					this.friends = response.data.data;
				})
			console.log(data);
		},
		cancelFriends (data) {
			const params = {
				friendId: data
			};
			this.$axios
				.put('http://localhost:8081/' + 'Friends/cancelFriends', params, {
					headers: { token: this.token }
				})
				.then((response) => {
					this.friends = response.data.data;
					this.friends2 = response.data.data;
				})
			console.log(data);
		}
	}
}
</script>

<style>
  .friends{
    padding: 15px;
		width: auto;
		max-width: 800px;
  }
  .botao{
	top: -50px;
  }
</style>
