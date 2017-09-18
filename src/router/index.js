import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/index',
			component: resolve => require(['../components/common/Home.vue'], resolve),
			children: [
				{
					path: '/',
					component: resolve => require(['../components/page/Index.vue'], resolve)
				},
				{
					path: '/userList',
					component: resolve => require(['../components/page/account/AccountList.vue'], resolve)
				},
				// {
				// 	path: '/addUser',
				// 	component: resolve => require(['../components/page/AddUser.vue'], resolve)
				// },
				// {
				// 	path: '/editUser',
				// 	component: resolve => require(['../components/page/EditUser.vue'], resolve)
				// },
				// {
				// 	path: '/appstoreAccountList',
				// 	component: resolve => require(['../components/page/AppstoreAccountList.vue'], resolve),
				// 	// children: [
				// 	// 	{
				// 	// 		path: '/appstoreAccountEditor/:id',
				// 	// 		component: resolve => require(['../components/page/AppstoreAccountEditor.vue'], resolve)
				// 	// 	}
				// 	// ]
				// },
				// {
				// 	path: '/appstoreAccountEditor',
				// 	component: resolve => require(['../components/page/EditorAppstoreAccount.vue'], resolve)
				// },
				// {
				// 	path: '/gameTemplateList',
				// 	component: resolve => require(['../components/page/GameTemplateList.vue'], resolve)
				// },
				// {
				// 	path: '/buildMacList',
				// 	component: resolve => require(['../components/page/BuildMacList.vue'], resolve)
				// },
				// {
				// 	path: '/addBuildMac',
				// 	component: resolve => require(['../components/page/AddBuildMac.vue'], resolve)
				// },
				// {
				// 	path: '/editBuildMac',
				// 	component: resolve => require(['../components/page/EditBuildMac.vue'], resolve)
				// },
				// {
				// 	path: '/gameList',
				// 	component: resolve => require(['../components/page/GameList.vue'], resolve)
				// },
				// {
				// 	path: '/addGame',
				// 	component: resolve => require(['../components/page/AddGame.vue'], resolve)
				// },
				// {
				// 	path: '/addGameSeries',
				// 	component: resolve => require(['../components/page/AddGameSeries.vue'], resolve)
				// },
				// {
				// 	path: '/seriesList',
				// 	component: resolve => require(['../components/page/SeriesList.vue'], resolve)
				// },
				// {
				// 	path: '/editorGame',
				// 	component: resolve => require(['../components/page/EditorGame.vue'], resolve)
				// },
				// // {
				// // 	path: '/editSeries',
				// // 	component: resolve => require(['../components/page/EditSeries.vue'], resolve)
				// // },
				// {
				// 	path: '/taskList',
				// 	component: resolve => require(['../components/page/TaskList.vue'], resolve)
				// },
				// {
				// 	path: '/gameDataList',
				// 	component: resolve => require(['../components/page/GameDataList.vue'], resolve)
				// },
				// {
				// 	path: '/incomeDataList',
				// 	component: resolve => require(['../components/page/IncomeDataList.vue'], resolve)
				// },
				// {
				// 	path: '/addIncome',
				// 	component: resolve => require(['../components/page/AddIncome.vue'], resolve)
				// },
				{
					path: '/basetable',
					component: resolve => require(['../components/page/BaseTable.vue'], resolve)
				},
				{
					path: '/vuetable',
					component: resolve => require(['../components/page/VueTable.vue'], resolve)	 // vue-datasource组件
				},
				{
					path: '/baseform',
					component: resolve => require(['../components/page/BaseForm.vue'], resolve)
				},
				{
					path: '/vueeditor',
					component: resolve => require(['../components/page/VueEditor.vue'], resolve)	// Vue-Quill-Editor组件
				},
				{
					path: '/markdown',
					component: resolve => require(['../components/page/Markdown.vue'], resolve)	 // Vue-Quill-Editor组件
				},
				{
					path: '/upload',
					component: resolve => require(['../components/page/Upload.vue'], resolve)	   // Vue-Core-Image-Upload组件
				},
				{
					path: '/basecharts',
					component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-echarts-v3组件
				},
				{
					path: '/mixcharts',
					component: resolve => require(['../components/page/MixCharts.vue'], resolve)	// vue-echarts-v3组件
				},
				{
					path: '/taoJinFarmIncomeData',
					component: resolve => require(['../components/page/TaoJinFarmIncomeData.vue'], resolve)
				}
			]
		},
		{
			path: '/login',
			component: resolve => require(['../components/page/Login.vue'], resolve)
		}
	]
});

router.beforeEach((to, from, next) => {
	if (to.path !== '/login') {
		if (!localStorage.getItem('userInfo')) {
			next('/login');
		} else {
			next();
		}
	} else {
		if (localStorage.getItem('userInfo')) {
			next('/index');
		} else {
			next();
		}
	}
});

export default router;
