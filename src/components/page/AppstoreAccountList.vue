<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item>苹果开发者账号管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-table :data="tableData" border style="width: 100%" v-loading="isShowLoading" element-loading-text="数据加载中" :row-class-name="tableRowClassName">
			<el-table-column type="expand">
				<template scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="姓氏">
							<span>{{ props.row.surname }}</span>
						</el-form-item>
						<el-form-item label="名字">
							<span>{{ props.row.userName }}</span>
						</el-form-item>
						<el-form-item label="电话">
							<span>{{ props.row.phone }}</span>
						</el-form-item>
						<el-form-item label="技术支持">
							<span>{{ props.row.supportUrl }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" width="100" />
			<el-table-column prop="account" label="账号" />
			<el-table-column prop="teamID" label="teamID" width="180" />
			<!-- <el-table-column prop="surname" label="姓氏" width="150" /> -->
			<!-- <el-table-column prop="userName" label="名字" width="150" /> -->
			<!-- <el-table-column prop="phone" label="电话" width="200" show-overflow-tooltip/> -->
			<!-- <el-table-column prop="supportUrl" label="技术支持" show-overflow-tooltip /> -->
			<el-table-column label="操作" width="120">
				<template scope="scope">
					<el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true
			}
		},
		methods: {
			handleEdit(index, row) {
				this.$router.push({ path: 'appstoreAccountEditor', query: { id: row.id } });
			},/*
			handleDelete(index, row) {
				this.$message.error('删除第'+(index+1)+'行');
			}*/
			tableRowClassName(row, index) {
				if (!row.isEnabled) {
					return 'unEnabled';
				}
				return '';
			}
		},
		mounted: function () {
			net.get(api.getAppStoreAccount(), result => {
				this.isShowLoading = false;
				if (result.status === 1) {
					this.tableData = result.data;
				} else {
					this.$message.error(result.data);
				}
			}, err => {
				this.isShowLoading = false;
				this.$message.error("有错误");
			});
		}
	}
</script>
<style>
	.demo-table-expand {
		font-size: 0;
	}
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	.el-table .unEnabled {
		background: #D3DCE6;
	}
</style>