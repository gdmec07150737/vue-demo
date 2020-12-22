// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store from './store/store'
import axios  from  'axios'
// import  VueAxios  from 'vue-axios'
Vue.config.productionTip = false

// Vue.component(FormModel.name, FormModel)
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  // render: h => h(App),
  // VueAxios,
  // axios,
  template: '<App/>'
})
