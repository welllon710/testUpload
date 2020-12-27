import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
	routes:[
		{
			path:'/home',
			component:()=>import('@/views/home.vue')
		},
		{
			path:'/text',
			component:()=>import('@/views/text.vue')
		}
	],
	mode:'history'
})
export default router