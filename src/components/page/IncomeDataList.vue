<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item>收入统计</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
    	<el-row type="flex" class="row-bg" justify="end" style="margin-bottom: 10px">
			<el-date-picker :clearable="false" :editable="false" v-model="dateVal" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="handleDateChanged" />
			<el-button style="margin-left: 10px" size="small" type="primary" @click="handleAdd">添加</el-button>
    	</el-row>
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="date" label="日期" width="160" />
			<el-table-column prop="yomob" label="yomob收入" show-overflow-tooltip />
			<el-table-column prop="chance" label="畅思收入" />
			<el-table-column prop="total" label="合计" />
			<!-- <el-table-column label="操作" width="120">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleBeforeData(scope.$index, scope.row)">查看历史</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<div class="pagination">
			<el-pagination layout="prev, pager, next" :total="total" :page-size="count" @current-change="handleCurrentPageChange" />
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';

	let serieses = null;

	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true,
				total: 0,
				count: 10,
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() >= Date.now() - 8.64e7;
					}
				},
				dateVal: utils.dateFormat(utils.yesterday(), 'yyyy-MM-dd')
				// 多选的数据
				// multipleSelection: []
			}
		},
		methods: {
			handleAdd() {
				this.$router.push({ path: 'addIncome' });
			},
			handleBeforeData(index, row) {
				this.$message.error('哈哈，还没有做( •̀ ω •́ )y');
			},
			handleDateChanged(date) {
				this.fetchIncomeData(date);
			},
			handleCurrentPageChange(page) {
				// net.get(api.getAllGames(userInfo.id, page, this.count), result => {
				// 	this.isShowLoading = false;
				// 	if (result.status === 1) {
				// 		this.tableData = result.data.games;
				// 	} else {
				// 		this.$message.error(result.data);
				// 	}
				// }, err => {
				// 	this.isShowLoading = false;
				// 	this.$message.error("有错误");
				// });
			},
			fetchIncomeData(dateStr) {
				let now = 0;
				if (dateStr) {
					const arr = dateStr.split('-');
					now = new Date(arr[0], parseInt(arr[1]) - 1, parseInt(arr[2]) + 1).getTime() + 1000;
				} else {
					now = new Date().getTime();
				}
				net.get(api.getIncome(utils.getUserInfo().id, utils.getUserInfo().id, now - 86400000 * 2, now - 86400000, 1, this.count), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						for (let i = 0; i < result.data.income.length; i++) {
							result.data.income[i].date = result.data.income[i].date.split('T')[0];
							result.data.income[i].total = result.data.income[i].yomob + result.data.income[i].chance;
						}
						this.tableData = result.data.income;
						this.total = result.data.count;
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
			this.fetchIncomeData();
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
</style>