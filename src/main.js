import Vue from 'vue'
import App from './App.vue'

import Vant from 'vant';

import 'vant/lib/index.css'

import api from '@/api/index'


import router from "@/router";
Vue.use(Vant);

Vue.prototype.$api = api

let app_form;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
