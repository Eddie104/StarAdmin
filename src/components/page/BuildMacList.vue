<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item>打包机列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-row v-if="isAdmin" type="flex" justify="end" align="middle" style="marginBottom: 10px">
			<el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
		</el-row>
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="id" label="ID" width="100" />
			<el-table-column prop="name" label="名称" width="160" />
			<el-table-column prop="ip" label="IP" width="200" />
			<el-table-column prop="des" label="描述" show-overflow-tooltip />
			<el-table-column prop="status" label="状态" width="120" />
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" type="success" @click="handleUpdateStatus(scope.$index, scope.row)">更新状态</el-button>
					<el-button v-if="isAdmin" size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';

	function getStatusStr(status) {
		return status === 0 ? '未链接' : (status === 1 ? "空闲中" : "忙碌中");
	}

	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true,
				isAdmin: utils.isAdmin()
			}
		},
		methods: {
			handleUpdateStatus(index, row) {
				net.get(`http://${row.ip}:3001/getStatus`, r => {
					if (r.status === 1) {
						for (let i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].id === row.id) {
								this.tableData[i].status = getStatusStr(r.data === 0 ? 1 : 2);
								break;
							}
						}
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.$message.error('无法链接到打包机，您老不在文渊楼503吧？');
				});
			},
			handleEdit(index, row) {
				this.$router.push({ path: 'editBuildMac', query: { id: row.id } });
			},
			handleAdd() {
				this.$router.push({ path: 'addBuildMac' });
			}
		},
		mounted: function () {
			net.get(api.getBuildMac(), result => {
				this.isShowLoading = false;
				if (result.status === 1) {
					for (let i = 0; i < result.data.length; i++) {
						result.data[i].status = getStatusStr(result.data[i].status);
					}
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