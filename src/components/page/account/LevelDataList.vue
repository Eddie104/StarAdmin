<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item>关卡信息</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- <el-row v-if="isAdmin" type="flex" justify="end" align="middle" style="marginBottom: 10px">
			<el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
		</el-row> -->
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<!-- 可查看指定用户的关卡详细记录，包含关卡数，关卡打开时间，打开时的道具数量，金币数量
				关卡通过时间，关卡奖励，通关时道具数量，金币数量
 			-->
			<el-table-column prop="id" label="ID" sortable width="120" />
			<el-table-column prop="numLevel" label="关卡数" width="150" />
			<el-table-column prop="startDateStr" label="开始时间" width="150" />
			<el-table-column prop="endDateStr" label="结束时间" width="150" />
			<el-table-column prop="startItems" label="开始道具" width="150" />
			<el-table-column prop="endItems" label="结束道具" width="150" />
			<el-table-column prop="startDollar" label="开始金币" width="150" />
			<el-table-column prop="endDollar" label="结束金币" width="150" />
			<el-table-column prop="awards" label="关卡奖励" width="150" />
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
				net.get(api.getUserLevelData(1000, val, 10), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						for (let i = 0; i < result.data.results.length; i++) {
							result.data.results[i].lastLoginDateStr = utils.dateFormat(new Date(result.data.results[i].lastLoginDate), 'yyyy-MM-dd');
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