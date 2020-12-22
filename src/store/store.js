import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {//要设置的全局访问的state对象
        loginstate: false, //设置登录状态:false为未登录，true为登录
        authorization: '', //token
        id: '', //用户id
    },
    getters: {//实时监听state值得变化(最新状态)
        isLogin(state){//承载变化的loginstate的值
            return state.loginstate
        },
        getAuthorization(state) {
            return state.authorization
        },
        getId(state) {
            return state.id
        }
    },
    mutations: {
        setAuthorization(state, token) {
            state.authorization = token
        },
        login(state, status) {
            state.loginstate = status
        },
        setId(state, id) {
            state.id = id
        }
    }
})