import Vue from 'vue'
import Router from 'vue-router'
import Log from '@/components/LogView'
import Login from '@/components/views/Login'
import Register from '@/components/views/Register'
import Home from '@/components/HomeView'
import Begin from '@/components/views/begin/Begin'
import Profile from '@/components/views/user/Profile'
import EditProfile from '@/components/views/dashboards/EditProfile'
import Friends from '@/components/views/dashboards/Friends'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/log',
			name: 'Log',
			component: Log,
			children: [
				{ path: '/register', name: 'Register', component: Register },
				{ path: '/login', name: 'Login', component: Login }
			]
		},
		{
			path: '', redirect: '/login'
		},
		{
			path: '/',
			name: 'Home',
			component: Home,
			children: [
				{path: '/inicio', name: 'Inicio', component: Begin},
				{path: '/profile', name: 'Profile', component: Profile},
				{path: '/editProfile', name: 'EditProfile', component: EditProfile},
				{path: '/friends', name: 'Friends', component: Friends},
				{path: '*', redirect: '/inicio'}
			]
		}
	]
})

router.beforeEach((to, from, next) => {
	const publicPages = ['Login', 'Register', 'Log']
	const authRequired = !publicPages.includes(to.name);
	const logedIn = localStorage.getItem('userData')
	const userData = JSON.parse(logedIn)
	const instance = router.app

	if (authRequired && !logedIn) {
		return next('/login')
	}

	if (publicPages.includes(to.name) && logedIn) {
		return next('/inicio')
	}

	if (authRequired) {
		instance.$axios
			.get('http://localhost:8081/' + 'Login/checktoken', {headers: {token: userData}})
			.catch(() => {
				localStorage.clear()
				return next('/login')
			})
	}
	next();
})

export default router;
