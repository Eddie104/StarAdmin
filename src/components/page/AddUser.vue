<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item to="userList" replace>账号管理</el-breadcrumb-item>
				<el-breadcrumb-item>添加</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="手机号">
					<el-input v-model="form.phone" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="form.password" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="form.mail" />
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

	export default {
		data: function() {
			return {
				form: {
					phone: '',
					password: '',
					mail: ''
				}
			}
		},
		methods: {
			onSubmit() {
				const { phone, password, mail } = this.form;
				if (!utils.isPhone(phone)) {
					this.$message.error(`手机号有误:${phone}`);
					return;
				}
				if (!utils.isEmail(mail)) {
					this.$message.error(`邮箱格式有误:${mail}`);
					return;
				}
				net.get(api.register(phone, password, mail), result => {
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
		}
	}
</script>