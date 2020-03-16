<template>
    <div>
        <v-app-bar fixed color="grey darken-4" app>
            <v-toolbar-title class="white--text">FaceGaming</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed class="font-weight-regular" :to="buttonRouter">{{buttonMessage}}</v-btn>
        </v-app-bar>
    </div>
</template>
<script>
export default {
	data () {
		return {
			buttonRouter: '/register',
			buttonMessage: 'Cadastrar'
		}
	},
	watch: {
		'$route.name' (value) {
			if (value === 'Register') {
				this.buttonRouter = '/login'
				this.buttonMessage = 'Login'
				return
			}
			this.buttonRouter = '/register'
			this.buttonMessage = 'Cadastrar'
		}
	}

}
</script>
