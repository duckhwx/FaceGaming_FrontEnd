// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Axios from 'axios'
import JwtDecode from 'jwt-decode'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios;
Vue.prototype.$jwt = JwtDecode;
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
	icons: {
		iconfont: 'fa'
	},
	el: '#app',
	router,
	vuetify: new Vuetify(),
	components: { App },
	template: '<App/>'
})
