<template>
	<div>
		<div class="table">
			<div class="crumbs">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item><i class="el-icon-menu"></i> 淘金农场</el-breadcrumb-item>
					<el-breadcrumb-item>今日收益</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- <el-table :data="nowData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
				<el-table-column prop="ProductName" label="名称" width="120" />
				<el-table-column prop="Price" label="当前价格" />
				<el-table-column prop="OpenPrice" label="开盘价格" />
				<el-table-column prop="Increase" label="涨额" />
				<el-table-column prop="IncreaseRate" label="涨幅" />
			</el-table> -->
			<el-row type="flex" justify="center" style="margin-top: 10px; margin-bottom: 10px">
				今日收益 => {{ income }}
			</el-row>
			<el-table :data="harvest" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
				<el-table-column prop="name" label="名称" width="140" />
				<el-table-column prop="count" label="数量" />
				<el-table-column prop="price" label="当前价格" />
				<el-table-column prop="income" label="收益" />
			</el-table>
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
				nowData: [
				/*
				HighestPrice:0.01649
				Increase:0.0003
				IncreaseRate:0.01852995676343422
				LimitDown:0.01589
				LimitUp:0.01649
				LowestPrice:0.01618
				OpenPrice:0.01619
				Price:0.01649
				ProductCode:"800001"
				ProductId:30099
				ProductImage:null
				ProductName:"种子"
				Volume:424100
				 */
				],
				harvest: [],
				isShowLoading: true,
				income: 0
			}
		},
		methods: {
			
		},
		mounted: function () {
			// this.handleCurrentPageChange(1);
			// <img class="user-logo" src="../../../static/img/img.jpg">
			net.get(api.getTaoJinFarmIncome('om7enkl0ftf4g2feqecpjccnk0'), result => {
				if (result.status === 1) {
					console.log(result.data);
					for (let i = 0; i < result.data.nowData.length; i++) {
						result.data.nowData[i].IncreaseRate = utils.toDecimal2(result.data.nowData[i].IncreaseRate * 100) + '%';
					}
					let income = 0;
					for (let i = 0; i < result.data.harvest.length; i++) {
						if (result.data.harvest[i].name === '消耗种子') {
							result.data.harvest[i].price = 0.01649;
						} else {
							result.data.harvest[i].price = utils.getItemFromArray(result.data.nowData, 'ProductName', result.data.harvest[i].name).Price;
						}
						income += result.data.harvest[i].income;
						result.data.harvest[i].income = utils.toDecimal2(result.data.harvest[i].income);
					}
					this.income = utils.toDecimal2(income);
					this.nowData = result.data.nowData;
					this.harvest = result.data.harvest;
					this.isShowLoading = false;
				} else {
					this.$message.error(result.data);
				}
			}, e => {
				this.$message.error("有错误");
			});
			

			// net.get('http://www.taojinlt.com/jisuanqi/ajax.php', r => {
			// 	console.log(r);
			// }, e => {
			// 	console.log(e);
			// });
		}
	}
</script>