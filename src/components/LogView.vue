<template>
    <div>
        <v-app  style="background: #171717">
            <Nav></Nav>
            <router-view/>
        </v-app>
    </div>
</template>

<script>

import Nav from '@/components/views/navigations/Navigation'
import Login from '@/components/views/Login'
import Register from '@/components/views/Register'

export default {
	name: 'loginView',
	components: {
		Login: Login,
		Nav: Nav,
		Register: Register
	}
}

</script>
