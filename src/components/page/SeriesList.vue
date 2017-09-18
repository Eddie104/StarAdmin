<template>
	<div>
		<div class="table">
			<div class="crumbs">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
					<el-breadcrumb-item>系列列表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-row type="flex" justify="end" align="middle" style="marginBottom: 10px">
				<el-col v-if="isAdmin" :span="24">
					创建者
					<el-select style="marginLeft: 10px" v-model="selectedUser" placeholder="请选择" @change="handleCreatorChanged">
						<el-option v-for="item in users" :label="item.name" :value="item.id" />
					</el-select>
				</el-col>
				<el-col :span="24">
					<el-row type="flex" justify="end" align="middle" style="marginBottom: 10px">
						<el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
					</el-row>
				</el-col>
			</el-row>
			<el-table :data="tableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
				<el-table-column prop="id" label="ID" width="140" sortable />
				<el-table-column prop="name" label="名称" show-overflow-tooltip />
				<el-table-column v-if="isAdmin" prop="creatorName" label="创建者" width="180" sortable />
				<el-table-column prop="template.name" label="模板" width="140" sortable />
				<el-table-column label="操作" width="440">
					<template scope="scope">
						<el-button size="small" type="success" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
						<el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="info" @click="handleTest(scope.$index, scope.row)">打测试包</el-button>
						<el-button size="small" type="danger" @click="handleReset(scope.$index, scope.row)">重置模板</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						<a style="marginLeft: 10px" :href="downloadUrl(scope.$index, scope.row)" download="resource.zip">下载</a>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination layout="prev, pager, next" :total="total" :page-size="count" @current-change="handleCurrentPageChange" />
			</div>
		</div>
		<el-dialog title="提示" v-model="resetTemplateDialogVisible" size="tiny">
			<span>重置模板之后，之前修改过的游戏资源就都失效了！</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleResetTemplateDialog(false)">我再想想</el-button>
				<el-button type="primary" @click="handleResetTemplateDialog(true)">确定重置</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" v-model="deleteSeriesDialogVisible" size="tiny">
			<span>确定要删除该游戏系列？删除系列的同时，该系列下的所有游戏也将一并删除！</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleDeleteSeriesDialog(false)">我再想想</el-button>
				<el-button type="primary" @click="handleDeleteSeriesDialog(true)">确定删除</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';
	import * as config from '../../config';

	let resetSeries = null;
	let deleteSeries = null;

	let curPage = 1;

	export default {
		data() {
			return {
				tableData: [],
				users: [],
				selectedUser: 0,
				isShowLoading: true,
				count: 10,
				total: 0,
				resetTemplateDialogVisible: false,
				deleteSeriesDialogVisible: false,
				isAdmin: utils.isAdmin()
			}
		},
		methods: {
			handleEdit(index, row) {
				this.$router.push({ path: 'addGameSeries', query: { isEditor: row.id } });
			},
			handlePreview(index, row) {
				window.open(`${config.BUILD_PREVIEW_HOST}/${row.creator}/${row.template.code}/${row.id}/index.html`, row.template.name, row.template.isLandscape ? "fullscreen=1,height=640,width=960" : "fullscreen=1,height=960,width=640");
			},
			handleAdd() {
				this.$router.push({ path: 'addGameSeries' });
			},
			downloadUrl(index, row) {
				return `${config.BUILD_PREVIEW_HOST}/${row.creator}/${row.template.code}/${row.id}/resource.zip`;
			},
			handleReset(index, row) {
				resetSeries = row;
				this.resetTemplateDialogVisible = true;
			},
			handleResetTemplateDialog(reset) {
				this.resetTemplateDialogVisible = false;
				if (reset && resetSeries) {
					net.get(`${config.BUILD_ADMIN_HOST}/initSeries/${resetSeries.creator}/${resetSeries.template.code}/${resetSeries.id}`, r => {
						if (r.status === 1) {
							this.$message.success('模板重置成功！');
						} else {
							this.$message.error(r.data);
						}
					}, err => {
						this.$message.error('在打包机管理服务器上重置系列的模板时出错了，您老不会现在没有呆在文渊楼503吧？');
					});
				}
			},
			handleDelete(index, row) {
				deleteSeries = row;
				this.deleteSeriesDialogVisible = true;
			},
			handleDeleteSeriesDialog(isDelete) {
				this.deleteSeriesDialogVisible = false;
				if (isDelete) {
					net.get(api.deleteGameSeries(utils.getUserInfo().id, deleteSeries.id), r => {
						if (r.status === 1) {
							this.$message.success('系列删除成功！');
							for (let i = 0; i < this.tableData.length; i++) {
								if (this.tableData[i].id === deleteSeries.id) {
									this.tableData.splice(i, 1);
									break;
								}
							}
						} else {
							this.$message.error(r.data);
						}
					}, err => {
						this.$message.error(err);
					});
				}
			},
			handleTest(index, row) {
				net.post(api.addTask(), {
					uid: utils.getUserInfo().id,
					mail: utils.getUserInfo().mail,
					templateID: row.template.id,
					seriesID: row.id,
					templateName: row.template.name,
					templateCode: row.template.code,
					seriesName: row.name,
					games: [
						{
							id: -1,
							name: `${row.name}测试包`,
							appStoreAccount: "32968210@qq.com",
							// 苹果开发者账号的teamID
							teamID: '',
							supportUrl: '',
							surname: '',
							// 名字
							userName: '',
							phone: '',
							bundleID: `com.${utils.getUserInfo().id}.${row.template.code}${row.id}.test`,
							version: '1.0',
							buildVersion: 1
						}
					],
					keywords: '',
					des: '',
					talkingDataID: row.talkingDataID,
					yomobAppID: row.yomobAppID,
					yomobAdsID: row.yomobAdsID,
					chanceID: row.chanceID,
					isTest: true,
					isLandscape: row.template.isLandscape
				}, r => {
					if (r.status === 1) {
						this.$message.success('打测试包任务提交成功！');
					} else {
						this.$message.error(r.data);
					}
				});
			},
			handleCurrentPageChange(page) {
				curPage = page;
				this.isShowLoading = true;
				net.get(api.getGameSeries(utils.getUserInfo().id, page, this.count, this.selectedUser), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						this.total = result.data.count;
						if (this.isAdmin) {
							result.data.users.unshift({
								name: '全部',
								id: 0
							});
						}
						this.users = result.data.users;
						const series = result.data.series.slice();
						let u = null;
						for (let i = 0; i < series.length; i++) {
							for (let j = 0; j < result.data.templates.length; j++) {
								if (result.data.templates[j].id === series[i].template) {
									series[i].template = result.data.templates[j];
									break;
								}
							}
							if (this.isAdmin) {
								u = utils.getItemFromArray(this.users, 'id', series[i].creator);
								series[i].creatorName = u ? u.name : series[i].creator;
							}
						}
						this.tableData = series;
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					console.log(err);
					this.isShowLoading = false;
					this.$message.error("有错误");
				});
			},
			handleCreatorChanged(id) {
				this.handleCurrentPageChange(curPage);
			}
		},
		mounted: function () {
			this.handleCurrentPageChange(1);
		}
	}
</script>