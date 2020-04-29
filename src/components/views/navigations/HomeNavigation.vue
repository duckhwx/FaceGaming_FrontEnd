<template>
    <div>
        <v-app-bar fixed dark>
            <v-app-bar-nav-icon
            v-if="resmd < 960"
            @click="navDrawer = !navDrawer">
                <v-icon>
                    fas fa-bars
                </v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title>FaceGaming</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-app-bar-nav-icon v-on="on"
                    class="mx-2"
                    @click="alerts()">
                        <v-icon>fas fa-bell</v-icon>

                    </v-app-bar-nav-icon>
                </template>
                    <span>Notificações</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-app-bar-nav-icon v-on="on"
                    class="ml-2"
                    @click="logout()">
                        <v-icon>fas fa-sign-out-alt</v-icon>
                    </v-app-bar-nav-icon>
                </template>
                    <span>Sair</span>
            </v-tooltip>
        </v-app-bar>

        <v-navigation-drawer
        class="grey darken-4 pt-sm-6 pt-lg-8"
        width="260"
        floating
        clipped
        app
        v-model="navDrawer">
            <v-list class="mt-sm-6 mt-lg-8">
                <v-list-item
                :to="navLink.route"
                v-for="navLink in navLinks"
                :key="navLink.title"
                link>
                    <v-list-item-content>
                        <v-list-item-title class="white--text text-md-left font-weight-thin links">
                            {{navLink.title}}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-layout
        class="navDivider">
        </v-layout>
    </div>
</template>

<script>
export default {
	data () {
		return {
			resmd: window.innerWidth,
			navDrawer: false,
			navLinks: [
				{title: 'Inicio', route: '/inicio'},
				{title: 'Perfil', route: '/profile'},
				{title: 'Amigos', route: '/friends'},
				{title: 'Jogos', route: ''}
			],
			serchIcon: 'fas fa-search'
		}
	},
	mounted () {
		this.sideBarInit();
		onresize = () => {
			this.resmd = window.innerWidth;

			if (this.resmd >= 960) {
				this.navDrawer = true;
			}
		}
	},
	methods: {
		logout () {
			localStorage.clear()
			this.$router.push({path: '/login'})
		},
		sideBarInit () {
			if (this.resmd >= 960) {
				this.navDrawer = true;
				return
			}
			this.navDrawer = false;
		}
	}
}
</script>
<style>
    .links{
        font-size: 19px;
    }

    .headLink{
        font-size: 23px;
    }

    .navDivider{
        margin-bottom: 6%;
    }
</style>
