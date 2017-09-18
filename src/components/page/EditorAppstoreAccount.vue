<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item to="appstoreAccountList" replace>苹果开发者账号管理</el-breadcrumb-item>
				<el-breadcrumb-item>编辑</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="ID">
					<el-input v-model="form.id" disabled />
				</el-form-item>
				<el-form-item label="开发者账号">
					<el-input v-model="form.account" disabled />
				</el-form-item>
				<el-form-item label="TeamID">
					<el-input v-model="form.teamID" />
				</el-form-item>
				<el-form-item label="开发者姓氏">
					<el-input v-model="form.surname" />
				</el-form-item>
				<el-form-item label="开发者名字">
					<el-input v-model="form.userName" />
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="form.phone" />
				</el-form-item>
				<el-form-item label="技术支持">
					<el-input v-model="form.supportUrl" />
				</el-form-item>
				<el-form-item label="是否可用">
					<template>
						<el-radio class="radio" v-model="form.isEnabledStr" label="true">可用</el-radio>
						<el-radio class="radio" v-model="form.isEnabledStr" label="false">不可用</el-radio>
					</template>
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
	export default {
		data: function() {
			return {
				form: {
					account: '',
					password: '',
					teamID: '',
					id: -1,
					surname: '',
					userName: '',
					phone: '',
					supportUrl: '',
					isEnabled: false,
					isEnabledStr: 'false'
				}
			}
		},
		methods: {
			onSubmit() {
				this.form.isEnabled = this.form.isEnabledStr === 'true';
				net.post(api.addAppStoreAccount(), this.form, result => {
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
				this.$router.replace('/appstoreAccountList');
			}
		},
		mounted: function () {
			net.get(api.getAppStoreAccountByID(this.$route.query.id), result => {
				if (result.status === 1) {
					result.data.isEnabledStr = result.data.isEnabled ? 'true' : 'false';
					this.form = result.data;
					console.log(this.form);
				} else {
					this.$message.error(result.data);
				}
			}, err => {
				this.$message.error("有错误");
			});
		}
	}
</script>