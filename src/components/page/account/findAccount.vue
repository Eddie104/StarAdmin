<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏管理</el-breadcrumb-item>
				<el-breadcrumb-item>找回账号</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-row type="flex" justify="start" align="middle" style="marginBottom: 10px">
			<el-col :span="4">
				旧账号：
			</el-col>
			<el-col>
				<el-input placeholder="请输入旧账号" v-model="oldID"></el-input>
			</el-col>
			<el-col :span="4">
				新账号：
			</el-col>
			<el-col>
				<el-input placeholder="请输入新账号" v-model="newID"></el-input>
			</el-col>
		</el-row>
		<el-row type="flex" justify="end" align="middle" style="marginBottom: 10px">
			<el-button type="primary" size="small" @click="handleOK()">确定</el-button>
		</el-row>
	</div>
</template>

<script>
	import * as net from '../../../net';
	import * as api from '../../../api';
	import * as utils from '../../../utils';

	export default {
		data() {
			return {
				oldID: '',
				newID: ''
			}
		},
		methods: {
			handleOK() {
				net.get(api.changeAccount(this.oldID, this.newID), result => {
					if (result.status == 1) {
						this.$message.success('提交成功！');
					} else {
						this.$message.error(result.data);
					}
				});
			}
		},
		mounted: function () {
			
		}
	}
</script>