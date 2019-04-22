import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import "./stylus/main.styl"
import VueSwal from 'vue-swal';
import axios from "axios"

axios.defaults.baseURL = 'http://localhost:3000';
Vue.prototype.$axios = axios;

Vue.use(VueSwal);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');