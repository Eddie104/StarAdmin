<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
    	<el-row type="flex" class="row-bg" justify="end" style="margin-bottom: 10px">
			 <el-date-picker :clearable="false" :editable="false" v-model="dateVal" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="handleDateChanged" />
    	</el-row>
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="id" label="ID" width="160" />
			<el-table-column prop="productName" label="游戏名" show-overflow-tooltip />
			<el-table-column prop="newlyAdded" label="新增" />
			<!-- <el-table-column prop="appleID" label="苹果appID" width="180" /> -->
			<!-- <el-table-column prop="bundleID" label="bundleID" width="240" show-overflow-tooltip /> -->
			<el-table-column label="操作" width="120">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleBeforeData(scope.$index, scope.row)">查看历史</el-button>
				</template>
			</el-table-column>
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
			handleBeforeData(index, row) {
				this.$message.error('哈哈，还没有做( •̀ ω •́ )y');
			},
			handleDateChanged(date) {
				this.fetchGameData(date);
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
			fetchGameData(dateStr) {
				let now = 0;
				if (dateStr) {
					const arr = dateStr.split('-');
					now = new Date(arr[0], parseInt(arr[1]) - 1, parseInt(arr[2]) + 1).getTime() + 1000;
				} else {
					now = new Date().getTime();
				}
				// 当前时间再减掉2天
				net.get(api.getAllGamesData(utils.getUserInfo().id, now - 86400000 * 2, now - 86400000, 1, this.count), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						for (let i = 0; i < result.data.gameData.length; i++) {
							result.data.gameData[i].productName = utils.getItemFromArray(result.data.games, 'id', result.data.gameData[i].productID).name;
						}
						// serieses = result.data.series;
						this.tableData = result.data.gameData;
						this.total = result.data.count;
						// const templates = result.data.templates.slice();
						// templates.unshift({name: "全部", id: 0});
						// this.form.templates = templates;
						// this.form.template = 0;
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
			this.fetchGameData();
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