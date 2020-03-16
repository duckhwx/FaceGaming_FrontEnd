<template>
        <v-app>
            <v-content>
            <Nav></Nav>
            <router-view/>
        </v-content>
        </v-app>
</template>

<script>

import Nav from '@/components/views/navigations/HomeNavigation'

export default {
	name: 'home',
	components: {
		Nav: Nav
	},
	mounted () {
		this.test();
	},
	methods: {
		test () {
			this.$vuetify.theme.dark = true
		}
	}
}

</script>
