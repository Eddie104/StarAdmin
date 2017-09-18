<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item to="userList" replace>账号管理</el-breadcrumb-item>
				<el-breadcrumb-item>编辑</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box" style="width: 100%">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="ID">
					<el-input v-model="form.id" disabled />
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="form.name" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="form.mail" />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remarks" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click="onCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';
	import * as config from '../../config';	

	let accountID = 0;	

	export default {
		data: function() {
			return {
				form: {
					id: -1,
					name: "",
					mail: "",
					remarks: ""
				}
			}
		},
		methods: {
			onSubmit() {
				net.post(api.modifyRootUser(), Object.assign({uid: utils.getUserInfo().id}, this.form), result => {
					if (result.status === 1) {
						this.$message.success('提交成功！');
						this.onCancel();
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.$message.error("有错误");
				});
			},
			onCancel() {
				this.$router.replace('/userList');
			}
		},
		mounted: function () {
			net.get(api.getUserData(accountID), result => {
				if (result.status === 1) {
					this.form = result.data;
				} else {
					this.$message.error(result.data);
				}
			}, err => {
				this.$message.error("有错误");
			});
		},
		beforeMount: function() {
			accountID = this.$route.query.accountID;
		}
	}
</script>