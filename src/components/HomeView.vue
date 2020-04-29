<template>
        <v-app>
            <v-content>
            <Nav></Nav>
            <router-view
			v-if="socket"
			@callSnackbar="summonSnackbar"
			/>
			<Snackbar
			@resetSnackbar="resetSnackbar"
			:presets="snackbarPresets"
			></Snackbar>
        </v-content>
        </v-app>
</template>

<script>
import Vue from 'vue'
import socketio from 'socket.io-client';
import Nav from '@/components/views/navigations/HomeNavigation'
import Snackbar from '@/components/views/miscellaneous/Snackbar'

export default {
	name: 'home',
	components: {
		Nav: Nav,
		Snackbar: Snackbar
	},
	data () {
		return {
			snackbarPresets: {
				trigger: false,
				color: '',
				message: ''
			},
			socket: undefined,
			token: JSON.parse(localStorage.userData)
		}
	},
	mounted () {
		this.setDarkTheme();
		this.setSocket();
	},
	methods: {
		setSocket () {
			Vue.prototype.$socket = socketio('http://localhost:8081');
			this.socket = this.$socket;
			this.$socket.on('connect', () => {
				this.$socket.emit('register', this.token);
			});
		},
		setDarkTheme () {
			this.$vuetify.theme.dark = true
		},
		summonSnackbar (presets) {
			this.snackbarPresets = {
				trigger: presets.trigger,
				color: presets.color,
				message: presets.message
			}
		},
		resetSnackbar () {
			this.snackbarPresets = {
				trigger: false,
				color: '',
				message: ''
			}
		}
	}
}

</script>
