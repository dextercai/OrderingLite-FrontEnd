import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'AdminIndex',
		component: () => import('../views/admin/layout.vue'),
		meta: {
			title: 'AdminIndex',
			requireAuth: false
		},
		children:[
			{
				path: '/login',
				name: 'Login',
				component: () => import('../views/Login.vue'),
				meta: {
					title: '登录',
					requireAuth: false
				}
			},
			{
				path: '/logout',
				name: 'Logout',
				component: () => import('../views/Logout.vue'),
				meta: {
					title: '注销',
					requireAuth: false
				}
			},
			{
				path: '/order/:tableId',
				name: 'Order',
				component: () => import('../views/core/menu/order.vue'),
				meta: {
					title: '点餐界面',
					requireAuth: false
				}
			},
			{
				path: '/order',
				name: 'OrderToken',
				component: () => import('../views/core/tableToken.vue'),
				meta: {
					title: '点餐口令输入',
					requireAuth: false
				}
			},
			{
				path: '/admin',
				name: 'Admin',
				component: () => import('../views/admin/common/sidebar.vue'),
				meta: {
					title: '管理页',
					requireAuth: true
				},
				children:[
					{
						name: 'user',
						path: 'user',
						component: ()=> import('../views/admin/user.vue'),
						meta:{
							title: '用户管理',
						}
					},
					{
						name: 'table',
						path: 'table',
						component: ()=> import('../views/admin/table.vue'),
						meta:{
							title: '桌台管理',
						}
					},
					{
						name: 'session',
						path: 'session',
						component: ()=> import('../views/admin/session.vue'),
						meta:{
							title: '现场管理',
						}
					}
				]
			}
		]
	}
	
]


const router = new VueRouter({
	routes
})
router.beforeEach((to, from, next) => { //全局钩子函数
	to.matched.some((route) => {
		document.querySelector("body").setAttribute("style", "overflow: auto !important;")
		if (route.meta.requireAuth) { //通过此操作可以判断哪些页面需要登录
			let thisToken = localStorage.getItem('sessionToken');
			if (thisToken == '' || thisToken == null) {
				next({
					name: 'Login'
				})
				return
			} else {
				axios.post(process.env.VUE_APP_API_SRC + '/Auth/TokenCheck', {
						token: thisToken
					})
					.then(function(response) {
						if (response.data.status == 200) { //token有效
							return
						} else if (response.data.status == 401) {
							next({
								name: 'Login'
							})
							return
						} else {
							next({
								name: '500',
								params: {
									message: "其他错误，请联系开发者。"
								}
							})
							return
						}
					})
					.catch(function() {
						next({
							name: '500',
							params: {
								message: "会话错误。"
							}
						})
						return
					});
			}
		}
		if (to.meta.title) {
			document.title = to.meta.title + " - 在线点餐"
		}else{
			document.title = "未命名页面 - 在线点餐"
		}
		next()
	});

});
export default router
