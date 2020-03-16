<template>
  <v-container>
		<v-layout row align-center justify-center class="margin-t50 margin-b50">
      <v-flex xs12 sm6 class="text-center">
      </v-flex>
		</v-layout>

	<v-layout flex align-center justify-center>
		<v-flex xs12 sm6>
				<v-card class="mx-auto" dark>
					<v-card-title class="justify-center display-1">Login</v-card-title>

					<v-divider></v-divider>

					<v-snackbar class="snackbar"
					v-model="successRegister"
					:right="true"
					:top="true">{{message}}</v-snackbar>

					<v-form ref="formulario" autocomplete="new-password">
						<v-container>
							<v-row>
								<v-col cols="11" class="mx-auto">
									<v-text-field autocomplete="new-password"
									v-model="value1"
									placeholder="Usuário"
									:rules="nameRules"
									type="text"
									outlined
									required
									></v-text-field>

									<v-text-field autocomplete="new-password"
									v-model="value2"
									placeholder="Senha"
									:rules="passwordRules"
									:type="'password'"
									outlined
									required
									></v-text-field>

									<v-btn @click="getLogin">Logar</v-btn>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-card>
      </v-flex>
	</v-layout>
  </v-container>
</template>

<script>
export default {
	name: 'login',
	data () {
		return {
			value1: '',
			nameRules: [
				v => !!v || 'Usuário requisitado',
				v => (v && v.length <= 24) || 'O usuário deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'O usuário deve ter mais de 6 caracteres'
			],
			value2: '',
			passwordRules: [
				v => !!v || 'Senha requisitada',
				v => (v && v.length <= 24) || 'A senha deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'A senha deve ter mais de 6 caracteres'
			],
			successRegister: false,
			message: '',
			rules: [
				v => !!v || 'Campo Obrigatório.'

			]
		}
	},
	methods: {
		getLogin () {
			if (this.$refs.formulario.validate()) {
				const newObject = {
					login: this.value1,
					senha: this.value2
				}

				this.$axios
					.post('http://localhost:8081/' + 'Login', {
						newObject
					}).then((response) => {
						if (response.data.error) {
							this.message = response.data.message
							this.successRegister = true
							return
						}
						localStorage.userData = JSON.stringify(response.data.data.TOKEN)
						this.$router.push({path: '/inicio'})
					})
			}
		}
	},
	mounted () {
		if (this.$route.params.message !== undefined) {
			this.message = this.$route.params.message
			this.successRegister = true
		}
	}
}
</script>

<style>
	.margin-t50 {
		margin-top: 100px;
	}
	.margin-b50 {
		margin-bottom: 50px;
	}
	#btnLogin {
		margin-top: 20px;
	}
	#texto {
		color: white;
	}
	.snackbar{
		margin-top: 60px;
	}
</style>
