<template>
	<div class="sidebar">
		<el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
			<!--
			<el-menu-item index="index">
				<i class="el-icon-setting"></i>自述
			</el-menu-item>
			<el-submenu index="2">
				<template slot="title"><i class="el-icon-menu"></i>表格</template>
				<el-menu-item index="basetable">基础表格</el-menu-item>
				<el-menu-item index="vuetable">Vue表格组件</el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"><i class="el-icon-date"></i>表单</template>
				<el-menu-item index="baseform">基本表单</el-menu-item>
				<el-menu-item index="vueeditor">编辑器</el-menu-item>
				<el-menu-item index="markdown">markdown</el-menu-item>
				<el-menu-item index="upload">文件上传</el-menu-item>
			</el-submenu>
			<el-submenu index="4">
				<template slot="title"><i class="el-icon-star-on"></i>图表</template>
				<el-menu-item index="basecharts">基础图表</el-menu-item>
				<el-menu-item index="mixcharts">混合图表</el-menu-item>
			</el-submenu>
			-->
			<el-menu-item index="index">
				<i class="el-icon-star-on"></i>自述
			</el-menu-item>
			<el-submenu index="2">
				<template slot="title"><i class="el-icon-menu"></i>游戏数据</template>
				<el-menu-item index="userList">用户概览</el-menu-item>
				<el-menu-item index="userDetailList">用户信息</el-menu-item>
				<el-menu-item index="userLoginList">登录信息</el-menu-item>
				<el-menu-item index="levelDataList">关卡信息</el-menu-item>
				<el-menu-item index="dollarRecord">金币记录</el-menu-item>
				<el-menu-item index="diamondsRecord">钻石记录</el-menu-item>
				<el-menu-item index="itemRecord">道具记录</el-menu-item>
				<el-menu-item index="pay">充值记录</el-menu-item>
				<!-- <el-menu-item index="appstoreAccountList">苹果发开者账号管理</el-menu-item>
				<el-menu-item index="gameDataList">数据统计</el-menu-item>
				<el-menu-item index="incomeDataList">收入统计</el-menu-item> -->
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"><i class="el-icon-menu"></i>游戏管理</template>
				<el-menu-item index="dollarCode">金币兑换码</el-menu-item>
				<el-menu-item index="activityNotice">活动通知</el-menu-item>
				<el-menu-item index="findAccount">找回账号</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	import * as utils from '../../utils';

	export default {
		data() {
			return {
				isMe: utils.isMe()
			}
		},
		computed:{
			onRoutes(){
				return this.$route.path.replace('/','');
			}
		}
	}
</script>

<style scoped>
	.sidebar{
		display: block;
		position: absolute;
		width: 250px;
		left: 0;
		top: 70px;
		bottom: 0;
		background: #2E363F;
	}
	.sidebar > ul {
		height: 100%;
	}
</style>
