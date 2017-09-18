<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item to="buildMacList" replace>打包机列表</el-breadcrumb-item>
				<el-breadcrumb-item>添加</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="名称">
					<el-input v-model="form.name" />
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="form.des" />
				</el-form-item>
				<el-form-item label="IP">
					<el-input v-model="form.ip" />
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
					name: '',
					des: '',
					ip: ''
				}
			}
		},
		methods: {
			onSubmit() {
				const { name, des, ip } = this.form;
				if (name === '') {
					this.$message.error('打包机名字不能为空');
					return;
				}
				if (ip === '') {
					this.$message.error('打包机IP不能为空');
					return;
				}
				net.post(api.addBuildMac(), this.form, result => {
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
				this.$router.replace('/buildMacList');
			}
		}
	}
</script>