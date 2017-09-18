<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item to="gameList" replace>游戏列表</el-breadcrumb-item>
				<el-breadcrumb-item>添加</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box" style="width: 100%">
			<el-form ref="form" label-width="120px">
				<el-form-item>
					<el-row>
						<el-col :span="8">模板： {{ templateName }}</el-col>
						<el-col :span="16">系列： {{ seriesName }}</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="广告后台分类">
					<el-col :span="11">
						<el-select v-model="adsMajor" placeholder="请选择广告后台产品大类" style="width: 100%;" @change="handleAdsMajorChangted">
							<el-option v-for="item in adsMajors" :label="item.name" :value="item.mid" />
						</el-select>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-select v-model="adsMinor" placeholder="请选择广告后台产品小类" style="width: 100%;">
							<el-option v-for="item in curAdsMinors" :label="item.name" :value="item.mid" />
						</el-select>
					</el-col>
				</el-form-item>
				<el-form-item label="游戏数量">
					<el-row>
						<el-col :span="8">
							<el-input-number v-model="numGame" :min="0" :max="maxNumGame" />
						</el-col>
						<el-col :span="16">
							<el-button type="primary" @click="onCreateNewGameList">创建新游戏列表</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="新建游戏列表">
					<el-table :data="tableData" border style="width: 100%; marginBottom: 10px" stripe>
						<el-table-column prop="id" label="序列号" width="120" />
						<el-table-column label="游戏名">
							<template scope="scope">
								<el-input v-model="scope.row.name" placeholder="请输入内容" />
							</template>
						</el-table-column>
						<el-table-column label="开发者账号" width="280">
							<template scope="scope">
								<el-select v-model="scope.row.appStoreAccountID" placeholder="请选择" @change="onAppStoreAccountChanged">
									<el-option v-for="item in appStoreAccount" :label="item.account" :value="item.id" :disabled="item.isUsed" />
								</el-select>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click="onCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as config from '../../config';
	import * as utils from '../../utils';

	let template = 0;
	let series = 0;
	// 服务器传来的原始数据
	let appStoreAccount = null;	

	export default {
		data: function() {
			return {
				tableData: [],
				seriesName: "",
				templateName: "",
				appStoreAccount: [],
				numGame: 1,
				maxNumGame: 1,
				// 广告后台的分类数据
				adsMajors: [],
				adsMinors: [],
				curAdsMinors: [],
				adsMajor: 0,
				adsMinor: 0
			}
		},
		methods: {
			onSubmit() {
				if (this.tableData.length > 0) {
					for (let i = 0; i < this.tableData.length; i++) {
						if (this.tableData[i].name === "") {
							this.$message.error(`第${i + 1}个游戏的名字不能为空！`);
							return;
						}
					}
				}
				
				const appStoreAccountIDArr = [];
				const nameArr = [];
				for (let i = 0; i < this.tableData.length; i++) {
					appStoreAccountIDArr[i] = this.tableData[i].appStoreAccountID;
					nameArr[i] = this.tableData[i].name;
				}

				// 先看看有没有重名的
				net.post(api.checkGameNames(), {nameArr}, r => {
					if (r.status === 1) {
						if (config.__DEV__) {
							// 测试的时候，直接创建游戏项目
							net.post(api.createGames(), {
								creator: utils.getUserInfo().id,
								rootTemplate: template,
								rootSeries: series,
								appStoreAccountIDArr,
								nameArr
							}, result => {
								if (result.status === 1) {
									this.$message.success('提交成功！');
									this.onCancel();
								} else {
									this.$message.error(result.data);
								}
							}, err => {
								this.$message.error("有错误");
							});
						} else {
							// 到广告后台去批量新建，广告后台会自动在管理后台新建好项目
							// console.log({
							// 	names: nameArr.join(','),
							// 	major: this.adsMajor,
							// 	minor: this.adsMinor,
							// 	type: 5
							// });
							net.post('http://snpole.com:3200/product/batchAdd', {
								names: nameArr.join(','),
								major: this.adsMajor,
								minor: this.adsMinor,
								type: 5
							}, r => {
								if (r === 1) {
									// 广告后台创建好了，再处理图轻数据里的数据
									net.post(api.createGames(), {
										creator: utils.getUserInfo().id,
										rootTemplate: template,
										rootSeries: series,
										appStoreAccountIDArr,
										nameArr
									}, result => {
										if (result.status === 1) {
											this.$message.success('提交成功！');
										} else {
											this.$message.error(result.data);
										}
									}, err => {
										this.$message.error("有错误");
									});
								} else {
									this.$message.error('广告后台新建产品时出错了！');
								}
							}, null, {
								'Content-Type': 'application/json'
							});
						}
					} else {
						this.$message.error(r.data);
					}
				});
			},
			onCancel() {
				this.$router.replace('/gameList');
			},
			onCreateNewGameList() {
				const tmpAppStoreAccount = utils.deepcopy(appStoreAccount);
				function getAppStoreAccountID() {
					for (let i = 0; i < tmpAppStoreAccount.length; i++) {
						if (!tmpAppStoreAccount[i].isUsed) {
							tmpAppStoreAccount[i].isUsed = true;
							return tmpAppStoreAccount[i].id;
						}
					}
					return -1;
				}
				const tableData = [];
				for (let i = 0; i < this.numGame; i++) {
					tableData[i] = {
						id: i + 1,
						name: "",
						appStoreAccountID: getAppStoreAccountID()
					};
				}
				this.appStoreAccount = tmpAppStoreAccount;
				this.tableData = tableData;
			},
			handleAdsMajorChangted(val) {
				const adsMinors = [];
				for (var i = 0; i < this.adsMinors.length; i++) {
					if (this.adsMinors[i].parent === val) {
						adsMinors.push(this.adsMinors[i]);
					}
				}
				this.curAdsMinors = adsMinors;
				this.adsMinor = adsMinors[0].mid;
			},
			onAppStoreAccountChanged(val) {
				for (var i = 0; i < this.appStoreAccount.length; i++) {
					this.appStoreAccount[i].isUsed = false;
				}
				for (let i = 0; i < this.tableData.length; i++) {
					for (var j = 0; j < this.appStoreAccount.length; j++) {
						if (this.appStoreAccount[j].id === this.tableData[i].appStoreAccountID) {
							this.appStoreAccount[j].isUsed = true;
							break;
						}
					}
				}
			}
		},
		mounted: function () {
			net.get(api.getAppStoreAccountUsed(series), r => {
				if (r.status === 1) {
					appStoreAccount = r.data;
					this.appStoreAccount = utils.deepcopy(appStoreAccount);
					let maxNumGame = 0;
					for (let i = 0; i < r.data.length; i++) {
						maxNumGame += r.data[i].isUsed ? 0 : 1;
					}
					this.maxNumGame = maxNumGame;
					// 获取广告后台的类别分类
					if (config.__DEV__) {
						this.adsMajors = [{"_id":"583414c7472cd419c9c81bdc","mid":0,"name":"默认"},{"_id":"583501a199fcfa52b11cefa7","mid":4,"name":"精品小游戏"},{"_id":"583501af99fcfa52b11cefa8","mid":5,"name":"精品应用"},{"_id":"583501c899fcfa52b11cefa9","mid":6,"name":"吸量应用"},{"_id":"584a1a37ddb6996e7f111c41","mid":7,"name":"测试"},{"_id":"587c66e8c384c9547a3e14ec","mid":8,"name":"广告"}];
						this.adsMinors = [{"_id":"583414c7472cd419c9c81bdd","mid":0,"name":"默认","parent":0,"channels":[],"pushModes":[]},{"_id":"583501e499fcfa52b11cefaa","mid":5,"name":"换装游戏","parent":4,"channels":[],"pushModes":[]},{"_id":"583501ed99fcfa52b11cefab","mid":6,"name":"放置游戏","parent":4,"channels":[],"pushModes":[]},{"_id":"5835020399fcfa52b11cefac","mid":7,"name":"社交类","parent":5,"channels":[],"pushModes":[]},{"_id":"5835020b99fcfa52b11cefad","mid":8,"name":"工具类","parent":5,"channels":[],"pushModes":[]},{"_id":"584a1ba6ddb6996e7f111c48","mid":12,"name":"换装类","parent":6,"channels":[],"pushModes":[]},{"_id":"584a1ba9ddb6996e7f111c49","mid":13,"name":"假装我是小分类","parent":7,"channels":[],"pushModes":[]},{"_id":"5876f074c384c9547a3e146a","mid":14,"name":"娱乐类","parent":5,"channels":[],"pushModes":[]},{"_id":"5876f787c384c9547a3e146b","mid":15,"name":"化妆类","parent":6,"channels":[],"pushModes":[]},{"_id":"587c66f1c384c9547a3e14ee","mid":17,"name":"淘宝电商","parent":8,"channels":[],"pushModes":[]},{"_id":"58a50a3d16e44d364073625b","mid":18,"name":"拼图类","parent":6,"channels":[],"pushModes":[]}];
					} else {
						net.get('http://snpole.com:3200/cates/list', r => {
							this.adsMajors = r.majors;
							this.adsMinors = r.minors;
						});
					}
					this.handleAdsMajorChangted(0);
				} else {
					this.$message.error(result.data);
				}
			});
		},
		beforeMount: function() {
			template = this.$route.query.template;
			this.templateName = this.$route.query.templateName;
			series = this.$route.query.series;
			this.seriesName = this.$route.query.seriesName;
		}
	}
</script>