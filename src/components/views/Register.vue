<template>
  <div>
    <v-app id="inspire" style=" background: #171717">
      <v-layout flex align-center justify-center>

        <v-flex xs12 sm6>
          <v-card class="mx-auto" dark>
            <v-card-title class="justify-center display-1">Cadastrar</v-card-title>

            <v-divider></v-divider>

			<v-snackbar class="snackbar"
			v-model="error"
			:right="true"
			:top="true">{{message}}</v-snackbar>

            <v-form ref="formulario" autocomplete="new-password">
              <v-container>
                <v-row>
                  <v-col cols="11" class="mx-auto">
                    <v-text-field v-model="userName"
					placeholder="Usuário"
					autocomplete="new-password"
					:rules="nameRules"
					outlined
					required></v-text-field>

                    <v-text-field v-model="email"
					placeholder="E-Mail"
					autocomplete="new-password"
					:rules="emailRules"
					outlined
					required></v-text-field>

					<v-text-field v-model="password"
					placeholder="Senha"
					autocomplete="new-password"
					:rules="passwordRules"
					:type="'password'"
					outlined
					required></v-text-field>

                    <v-btn @click="getData">Cadastrar</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-app>
  </div>
</template>
<script>

export default {
	data () {
		return {
			userName: '',
			nameRules: [
				v => !!v || 'Usuário requisitado',
				v => (v && v.length <= 24) || 'O usuário deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'O usuário deve ter mais de 6 caracteres'
			],
			email: '',
			emailRules: [
				v => !!v || 'E-mail requisitado',
				v => /.+@.+\..+/.test(v) || 'E-mail deve ser valido',
				v => (v && v.length <= 64) || 'E-mail deve ter menos de 64 caracteres',
				v => (v && v.length >= 10) || 'O E-mail deve ter mais de 10 caracteres'
			],
			password: '',
			passwordRules: [
				v => !!v || 'Senha requisitada',
				v => (v && v.length <= 24) || 'A senha deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'A senha deve ter mais de 6 caracteres'
			],
			error: false,
			message: '',
			rules: [
				v => !!v || 'Campo Vazio'
			]
		}
	},
	methods: {
		getData () {
			if (this.$refs.formulario.validate()) {
				const newObject = {
					userName: this.userName,
					email: this.email,
					password: this.password
				}

				this.$axios
					.post('http://localhost:8081/' + 'Register', {
						newObject
					}).then((response) => {
						if (response.data.error) {
							this.message = response.data.message
							this.error = true
							return
						}
						this.$router.push({name: 'Login', params: {message: 'Cadastrado com sucesso'}})
					})
			}
		}
	}
}
</script>
<style>
	.snackbar{
		margin-top: 54px
	}
</style>
