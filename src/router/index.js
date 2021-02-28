import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path:'/main',
        name:'main',
        component:() => import("@/pages/main/index")
    },
    {
        path:'/',
        name:'main',
        component:() => import("@/pages/main/index")
    },
    {
        path:'/logs',
        name:'logs',
        component:() => import("@/pages/log/index")
    },
    {
        path:'/history',
        name:'history',
        component:() => import("@/pages/history/index")
    }
]

const router = new VueRouter({
    routes
})

export default router
