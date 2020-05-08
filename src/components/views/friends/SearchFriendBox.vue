<template>
	<v-menu
	v-model="searchBoxTrigger"
	offset-y
	offset-x
	left
	:close-on-content-click="false"
	transition="slide-x-reverse-transition">
		<template v-slot:activator="{ on }">
			<v-btn
				dark
				fab
				fixed
				right
				bottom
				v-on="on"
				class="ml-4">
					<v-icon>fas fa-plus</v-icon>
			</v-btn>
		</template>

		<v-card
		class="pt-2 pl-2"
		width="650">
			<v-form
			ref="form">
				<v-layout
				align-start>
					<v-flex
					class="textField">
						<v-text-field
						v-model="searchNickname"
						:rules="rules"
						filled
						rounded
						dense
						placeholder="Digite um nome de um usuário..."
						>
						</v-text-field>
					</v-flex>
					<v-flex>
						<v-btn
						@click="inviteUser">
						Adicionar
						</v-btn>
					</v-flex>
				</v-layout>
			</v-form>
		</v-card>
	</v-menu>
</template>
<script>
export default {
	props: {
	},
	data () {
		return {
			searchNickname: '',
			searchBoxTrigger: false,
			rules: [
				v => !!v || 'Nickname requisitado',
				v => v.length <= 24 || 'Nickname deve ter no maximo 24 caracteres',
				v => /^[A-Za-z ]+$/.test(v) || 'Apenas caracteres do alfabeto',
				v => v !== this.username || 'Este é seu nome de usuário'
			],
			token: JSON.parse(localStorage.userData)
		}
	},
	methods: {
		inviteUser () {
			const decoded = this.$jwt(this.token);
			const userData = decoded.userData;

			if (this.$refs.form.validate()) {
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
								color: 'red darken-4',
								message: response.data.message
							});
							return;
						}

						this.$refs.form.reset();
						this.searchBoxTrigger = false;

						this.$emit('setPedingFriend', {
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

						this.$socket.emit('inviteUser', {
							userSenderId: userData.ID,
							socketUserId: response.data.data.ID
						});
					});
			}
		}
	},
	watch: {
		searchBoxTrigger () {
			if (!this.searchBoxTrigger) {
				this.$refs.form.resetValidation();
				this.searchNickname = '';
			}
		}
	}
}
</script>
