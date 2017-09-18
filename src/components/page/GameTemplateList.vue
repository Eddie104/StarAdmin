<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item>模板列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
			<el-table-column prop="id" label="ID" width="100" />
			<el-table-column prop="name" label="名称" width="200" />
			<el-table-column prop="des" label="描述" show-overflow-tooltip />
			<el-table-column prop="code" label="编号" width="160" />
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<el-button size="small" type="success" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
					<el-button size="small" type="info" @click="handleDoc(scope.$index, scope.row)">文档</el-button>
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
			handlePreview(index, row) {
				window.open(row.url, row.name, row.isLandscape ? "fullscreen=1,height=640,width=960" : "fullscreen=1,height=960,width=640");
			},
			handleDoc(index, row) {
				window.open(row.doc);
			}
		},
		mounted: function () {
			net.get(api.getGameTemplate(), result => {
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