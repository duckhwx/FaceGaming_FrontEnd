<template>
        <v-app>
            <v-content>
            <Nav></Nav>
            <router-view
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
			}
		}
	},
	mounted () {
		this.setDarkTheme();
	},
	methods: {
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
