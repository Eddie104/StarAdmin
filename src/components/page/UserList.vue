<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item>账号管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-row v-if="isAdmin" type="flex" justify="end" align="middle" style="marginBottom: 10px">
			<el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
		</el-row>
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="id" label="ID" sortable width="150" />
			<el-table-column prop="name" label="名字" width="280" />
			<el-table-column prop="mail" label="邮箱" width="280" />
			<el-table-column prop="remarks" label="备注" show-overflow-tooltip />
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
					layout="prev, pager, next"
					:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';

	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true,
				total: 500,
				isAdmin: utils.isAdmin()
			}
		},
		methods: {
			// formatter(row, column) {
			// 	return row.address;
			// },
			// filterTag(value, row) {
			// 	return row.tag === value;
			// },
			handleEdit(index, row) {
				console.log(row);
				console.log(row.accountID);
				this.$router.push({ path: 'editUser', query: { accountID: row.accountID } })
			},
			// handleDelete(index, row) {
			// 	this.$message.error('删除第'+(index+1)+'行');
			// }
			handleAdd() {
				this.$router.push({ path: 'addUser' });
			}
		},
		mounted: function () {
			net.get(api.getRootUsers(0, 10), result => {
				this.isShowLoading = false;
				if (result.status === 1) {
					this.tableData = result.data.users;
					this.total = result.data.count;
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