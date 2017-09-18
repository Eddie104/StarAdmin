<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item>游戏列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form ref="form" :model="form" label-width="80px">
			<el-row type="flex" class="row-bg" justify="end">
				<el-col v-if="isAdmin" :span="6">
					<el-form-item label="创建者">
						<el-select v-model="form.user" placeholder="请选择" @change="handleUserChanged">
							<el-option v-for="item in form.users" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="isAdmin ? 6 : 8">
					<el-form-item label="游戏模板">
						<el-select v-model="form.template" placeholder="请选择" @change="handleTemplateChanged">
							<el-option v-for="item in form.templates" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="isAdmin ? 6 : 8">
					<el-form-item label="游戏系列">
						<el-select v-model="form.series" placeholder="请选择" @change="handleSeriesChanged">
							<el-option v-for="item in form.serieses" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="isAdmin ? 6 : 8">
					<el-form-item>
						<el-row type="flex" justify="end" align="middle">
							<el-button type="success" size="small" @click="handleAdd()">添加</el-button>
							<el-button type="primary" size="small" @click="handleBuild()">提交打包</el-button>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<el-table :data="tableData" border style="width: 100%" v-loading="isShowLoading" element-loading-text="数据加载中" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
			<el-table-column type="expand">
				<template scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<!-- <el-form-item label="苹果appID">
							<span>{{ props.row.appleID }}</span>
						</el-form-item> -->
						<el-form-item label="bundleID">
							<span>{{ props.row.bundleID }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="80" />
			<el-table-column prop="id" label="ID" width="160" />
			<el-table-column prop="name" label="游戏名" show-overflow-tooltip />
			<el-table-column prop="appStoreAccount" label="开发者账号" show-overflow-tooltip />
			<!-- <el-table-column prop="appleID" label="苹果appID" width="180" /> -->
			<!-- <el-table-column prop="bundleID" label="bundleID" width="240" show-overflow-tooltip /> -->
			<el-table-column prop="statusStr" label="状态" width="120" />
			<el-table-column label="操作" width="280">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" type="info" @click="handleChanDaShi(scope.$index, scope.row)">禅大师</el-button>
					<el-button size="small" type="info" @click="handleAppStore(scope.$index, scope.row)">appStore</el-button>
					<!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
	let appStoreAccount = null;	

	const statusStrArr = ['未上传', '已上传', '准备提交', '待审核', '审核中', '已上架', '被打回'];

	function initGameAppStoreAccount(games) {
		let tmpAppSotreAccount = 0;
		for (let j = 0; j < games.length; j++) {
			tmpAppSotreAccount = games[j].appStoreAccount;
			games[j].appStoreAccount = '没有找到开发者账号';
			for (let i = 0; i < appStoreAccount.length; i++) {
				if (appStoreAccount[i].id === tmpAppSotreAccount) {
					 games[j].appStoreAccount = appStoreAccount[i].account;
					 break;
				}
			}
			// 状态 0:未上传 1:已上传 2:准备提交 3：待审核 4：审核中 5：已上架 6：被打回
			games[j].statusStr = statusStrArr[games[j].status];
		}
	}

	export default {
		data() {
			return {
				tableData: [],
				isShowLoading: true,
				total: 0,
				count: 10,
				form: {
					templates: [{name: "全部", id: 0}],
					template: 0,
					serieses: [{name: "全部", id: 0}],
					series: 0,
					users: [{name: "全部", id: 0}],
					user: 0
				},
				// 多选的数据
				multipleSelection: [],
				isAdmin: utils.isAdmin()
			}
		},
		methods: {
			handleEdit(index, row) {
				this.$router.push({ path: 'editorGame', query: { id: row.id } });
			},
			handleAdd() {
				const { template, series } = this.form;
				if (template < 1) {
					this.$message.error("请先选择一个游戏模板！");
					return;
				}
				if (series < 1) {
					this.$message.error("请先选择一个游戏系列！");
					return;
				}
				let templateName = null;
				let seriesName = null;
				for (let i = 0; i < this.form.templates.length; i++) {
					if (this.form.templates[i].id === template) {
						templateName = this.form.templates[i].name;
						break;
					}
				}
				for (let i = 0; i < this.form.serieses.length; i++) {
					if (this.form.serieses[i].id === series) {
						seriesName = this.form.serieses[i].name;
						break;
					}
				}
				this.$router.push({ path: 'addGame', query: {template, series, seriesName, templateName } });
			},
			handleBuild() {
				// 一个游戏的数据： id: Number, name: String, appStoreAccount: String, bundleID: String
				const games = [];
				let templateID = -1, seriesID = -1;
				if (this.multipleSelection.length > 0) {
					for (let i = 0; i < this.multipleSelection.length; i++) {
						if (templateID === -1) {
							templateID = this.multipleSelection[i].rootTemplate;
						} else {
							if (templateID !== this.multipleSelection[i].rootTemplate) {
								this.$message.error('请选择同一个系列的游戏进行打包！');
								return;
							}
						}
						if (seriesID === -1) {
							seriesID = this.multipleSelection[i].rootSeries;
						} else {
							if (seriesID !== this.multipleSelection[i].rootSeries) {
								this.$message.error('请选择同一个系列的游戏进行打包！');
								return;
							}
						}
						let appStoreAccountData = utils.getItemFromArray(appStoreAccount, 'account', this.multipleSelection[i].appStoreAccount);
						games[i] = {
							id: this.multipleSelection[i].id,
							name: this.multipleSelection[i].name,
							appStoreAccount: appStoreAccountData.account,
							// 苹果开发者账号的teamID
							teamID: appStoreAccountData.teamID,
							supportUrl: appStoreAccountData.supportUrl,
							surname: appStoreAccountData.surname,
							// 名字
							userName: appStoreAccountData.userName,
							phone: appStoreAccountData.phone,
							bundleID: this.multipleSelection[i].bundleID,
							version: this.multipleSelection[i].version,
							buildVersion: this.multipleSelection[i].buildVersion
						};
					}
				}
				if (games.length > 0) {
					let templateName = null, templateCode = null, isLandscape = false;
					let seriesName = null, keywords = null, des = null, talkingDataID = null, yomobAppID = null, yomobAdsID = null, chanceID = null;
					for (let i = 0; i < this.form.templates.length; i++) {
						if (this.form.templates[i].id === templateID) {
							templateName = this.form.templates[i].name;
							templateCode = this.form.templates[i].code;
							isLandscape = this.form.templates[i].isLandscape;
							break;
						}
					}
					for (let i = 0; i < serieses.length; i++) {
						if (serieses[i].id === seriesID) {
							seriesName = serieses[i].name;
							keywords = serieses[i].keywords;
							des = serieses[i].des;
							talkingDataID = serieses[i].talkingDataID;
							yomobAppID = serieses[i].yomobAppID;
							yomobAdsID = serieses[i].yomobAdsID;
							chanceID = serieses[i].chanceID;
							break;
						}
					}

					net.post(api.addTask(), {
						uid: utils.getUserInfo().id,
						mail: utils.getUserInfo().mail,
						templateID,
						seriesID,
						templateName,
						templateCode,
						seriesName,
						games,
						keywords,
						des,
						talkingDataID,
						yomobAppID,
						yomobAdsID,
						chanceID,
						isTest: false,
						isLandscape
					}, r => {
						if (r.status === 1) {
							this.$message.success('提交成功！');
						} else {
							this.$message.error(r.data);
						}
					});
				} else {
					this.$message.error('请选择至少一个游戏，才能提交打包！');
				}
			},
			handleTemplateChanged(templateID) {
				const seriesArr = [];
				for (let i = 0; i < serieses.length; i++) {
					if (serieses[i].template === templateID) {
						seriesArr.push(serieses[i]);
					}
				}
				seriesArr.unshift({name: "全部", id: 0});
				this.form.serieses = seriesArr;
				this.form.series = 0;
				this.fetchGames();
			},
			handleSeriesChanged(seriesID) {
				this.fetchGames();
			},
			handleUserChanged(creator) {
				this.fetchGames();
			},
			fetchGames() {
				this.isShowLoading = true;
				net.get(api.getGames(utils.getUserInfo().id, this.form.template, this.form.series, this.form.user), r => {
					this.isShowLoading = false;
					if (r.status === 1) {
						initGameAppStoreAccount(r.data.games);
						this.tableData = r.data.games;
						this.total = r.data.count;
					} else {
						this.$message.error(r.data);
					}
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleCurrentPageChange(page) {
				this.isShowLoading = true;
				net.get(api.getAllGames(utils.getUserInfo().id, page, this.count, this.form.user), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						if (page === 1) {
							serieses = result.data.series;
							appStoreAccount = result.data.appStoreAccount;

							this.total = result.data.count;
							const templates = result.data.templates.slice();
							templates.unshift({name: "全部", id: 0});
							this.form.templates = templates;
							this.form.template = 0;

							result.data.users.unshift({name: "全部", id: 0});
							this.form.users = result.data.users;
						}
						initGameAppStoreAccount(result.data.games);
						this.tableData = result.data.games;
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.isShowLoading = false;
					this.$message.error("有错误");
				});
			},
			tableRowClassName(row, index) {
				// if (row.status === 1) {
				// 	return 'uploaded';
				// }
				return '';
			},
			handleChanDaShi(index, row) {
				if (row.appleID) {
					window.open(`https://www.chandashi.com/apps/view/appId/${row.appleID}/country/cn.html`);
				} else {
					this.$message.error("请先填写该游戏的apple ID");
				}
			},
			handleAppStore(index, row) {
				if (row.appleID) {
					window.open(`https://itunes.apple.com/cn/app/${row.name}/id${row.appleID}?mt=8&ign-mpt=uo%3D4`);
				} else {
					this.$message.error("请先填写该游戏的apple ID");
				}	
			}
		},
		mounted: function () {
			this.handleCurrentPageChange(1);
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
	.el-table .uploaded {
		background: #c9e5f5;
	}
</style>