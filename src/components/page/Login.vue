<template>
	<div class="login-wrap">
		<div class="ms-title">消灭星星管理后台</div>
		<div class="ms-login">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm" v-loading="isShowLoading" element-loading-text="拼命登录中">
				<el-form-item prop="username">
					<el-input v-model="ruleForm.username" placeholder="username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
				</div>
				<!--<p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>-->
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	export default {
		data() {
			return {
				ruleForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{
							// 验证用户名
							validator: (rule, value, callback) => {
								if (value === '') {
									callback(new Error('请输入用户名'));
								} else {
									callback();
								}
							},
							required: true,
							trigger: 'blur'
						}
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				isShowLoading: false
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.isShowLoading = true;
						net.get(api.login(this.ruleForm.username, this.ruleForm.password), (result) => {
							this.isShowLoading = false;
							if (result.status === 1) {
								localStorage.setItem('userInfo', JSON.stringify(result.data));
								this.$router.push('/index');
							} else {
								this.isShowLoading = false;
								this.$message.error(result.data);
							}
						}, err => {
							this.isShowLoading = false;
							this.$message.error('有错误');
						});
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped>
	.login-wrap{
		position: relative;
		width:100%;
		height:100%;
	}
	.ms-title{
		position: absolute;
		top: 50%;
		width: 100%;
		margin-top: -230px;
		text-align: center;
		font-size:30px;
		color: #fff;
	}
	.ms-login{
		position: absolute;
		left: 50%;
		top: 50%;
		width: 300px;
		height: 160px;
		margin: -150px 0 0 -190px;
		padding: 40px;
		border-radius: 5px;
		background: #fff;
	}
	.login-btn {
		text-align: center;
	}
	.login-btn button {
		width: 100%;
		height: 36px;
	}
</style>