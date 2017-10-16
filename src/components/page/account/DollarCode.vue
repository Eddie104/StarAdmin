<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏管理</el-breadcrumb-item>
				<el-breadcrumb-item>金币兑换码</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- <el-row type="flex" justify="end" align="middle" style="marginBottom: 10px">
			<el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
		</el-row> -->
		<!-- <div class="form-box">
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
		</div> -->
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="id" label="ID" width="120" />
			<el-table-column prop="code" label="兑换码" width="150" />
			<el-table-column prop="dollar" label="金币" width="150" />
			<el-table-column prop="date" label="创建日期" width="150" />
			<el-table-column prop="usedDate" label="使用日期" width="150" />
			<el-table-column prop="isUsed" label="是否使用" />
			<!-- <el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<div class="pagination">
			<el-pagination
					layout="prev, pager, next"
					@current-change="handleCurrentChange"
					:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import * as net from '../../../net';
	import * as api from '../../../api';
	import * as utils from '../../../utils';

	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true,
				total: 500,
				// isAdmin: utils.isAdmin(),
				// form: {
				// 	name: '',
				// 	des: '',
				// 	ip: ''
				// }
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
				this.$router.push({ path: 'editUser', query: { accountID: row.accountID } })
			},
			// handleDelete(index, row) {
			// 	this.$message.error('删除第'+(index+1)+'行');
			// }
			handleAdd() {
				this.$router.push({ path: 'addUser' });
			},
			handleCurrentChange(val) {
				// 获取账号数据
				net.get(api.getDollarCode(val, 10), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						for (let i = 0; i < result.data.results.length; i++) {
							result.data.results[i].date = utils.dateFormat(new Date(result.data.results[i].date), 'yyyy-MM-dd');
							result.data.results[i].usedDate = utils.dateFormat(new Date(result.data.results[i].usedDate), 'yyyy-MM-dd');
							result.data.results[i].isUsed = result.data.results[i].isUsed ? '是' : '否';
						}
						this.tableData = result.data.results;
						this.total = result.data.total;
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.isShowLoading = false;
					this.$message.error("有错误");
				});
			}
		},
		mounted: function () {
			this.handleCurrentChange(1);
		}
	}
</script>