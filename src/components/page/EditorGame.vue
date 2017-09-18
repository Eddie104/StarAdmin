<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item to="gameList" replace>游戏列表</el-breadcrumb-item>
				<el-breadcrumb-item>编辑</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box" style="width: 100%">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="基础信息">
					<el-row>
						<el-col :span="8">
							ID: {{ form.id }}
						</el-col>
						<el-col :span="8">
							模板: {{ template ? template.name : "" }}
						</el-col>
						<el-col :span="8">
							系列: {{ series ? series.name : "" }}
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							bundleID: {{ form.bundleID }}
						</el-col>
						<el-col :span="12">
							苹果开发者账号: {{ getAppStoreAccount(form.appStoreAccount) }}
						</el-col>
					</el-row>
				</el-form-item>
				<!-- <el-form-item label="包名">
					{{ form.bundleID }}
				</el-form-item> -->
				<el-form-item label="游戏名称">
					<el-input v-model="form.name" />
				</el-form-item>
				<!-- <el-form-item label="苹果开发者账号">
					 <el-select v-model="form.appStoreAccount" placeholder="请选择">
						<el-option v-for="item in appStoreAccount" :label="item.account" :value="item.id" />
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="版本号">
					<el-row>
						<el-col :span="12">
							<el-input-number v-model="form.version" :min="1.0" :max="10.0" :step="0.1" />
						</el-col>
						<el-col :span="12">
							<el-input-number v-model="form.buildVersion" :min="1" :max="10" />
						</el-col>
					</el-row>
				</el-form-item> -->
				<!-- <el-form-item label="iTunesURL地址">
					<el-input v-model="form.iTunesURL" />
				</el-form-item> -->
				<el-form-item label="苹果APP ID">
					<el-input v-model="form.appleID" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="form.status" placeholder="请选择">
						<el-option v-for="item in gameStatusData" :label="item.key" :value="item.val" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" :rows="2" placeholder="请输入备注内容" v-model="form.remarks" />
				</el-form-item>
				<el-form-item label="启动页">
					<!-- 750 * 1334 -->
					<imageUploader :requiredWidth="750" :requiredHeight="1334" :imageName="'cover.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
				</el-form-item>
				<el-form-item label="ICON">
					<el-row type="flex" align="bottom">
						<el-col :span="4">
							<!-- 20 * 20 -->
							<imageUploader :requiredWidth="20" :requiredHeight="20" :imageName="'icon20.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="4">
							<!-- 29 * 29 -->
							<imageUploader :requiredWidth="29" :requiredHeight="29" :imageName="'icon29.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="4">
							<!-- 40 * 40 -->
							<imageUploader :requiredWidth="40" :requiredHeight="40" :imageName="'icon40.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="4">
							<!-- 58 * 58 -->
							<imageUploader :requiredWidth="58" :requiredHeight="58" :imageName="'icon58.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="4">
							<!-- 60 * 60 -->
							<imageUploader :requiredWidth="60" :requiredHeight="60" :imageName="'icon60.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="4">
							<!-- 76 * 76 -->
							<imageUploader :requiredWidth="76" :requiredHeight="76" :imageName="'icon76.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
					</el-row>
					<el-row type="flex" align="bottom">
						<el-col :span="6">
							<!-- 80 * 80 -->
							<imageUploader :requiredWidth="80" :requiredHeight="80" :imageName="'icon80.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="6">
							<!-- 87 * 87 -->
							<imageUploader :requiredWidth="87" :requiredHeight="87" :imageName="'icon87.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="6">
							<!-- 120 * 120 -->
							<imageUploader :requiredWidth="120" :requiredHeight="120" :imageName="'icon120.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="6">
							<!-- 152 * 152 -->
							<imageUploader :requiredWidth="152" :requiredHeight="152" :imageName="'icon152.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
					</el-row>
					<el-row type="flex" align="bottom">
						<el-col :span="8">
							<!-- 167 * 167 -->
							<imageUploader :requiredWidth="167" :requiredHeight="167" :imageName="'icon167.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<!-- 180 * 180 -->
							<imageUploader :requiredWidth="180" :requiredHeight="180" :imageName="'icon180.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<!-- 1024 * 1024 -->
							<imageUploader :requiredWidth="1024" :requiredHeight="1024" :imageName="'icon1024.png'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="iphone宣传图">
					<el-row type="flex" align="bottom">
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2208 : 1242) : 180" :requiredHeight="template ? (template.isLandscape ? 1242 : 2208) : 180" :imageName="'iphone1.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2208 : 1242) : 180" :requiredHeight="template ? (template.isLandscape ? 1242 : 2208) : 180" :imageName="'iphone2.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2208 : 1242) : 180" :requiredHeight="template ? (template.isLandscape ? 1242 : 2208) : 180" :imageName="'iphone3.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="ipad宣传图">
					<el-row type="flex" align="bottom">
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2732 : 2048) : 180" :requiredHeight="template ? (template.isLandscape ? 2048 : 2732) : 180" :imageName="'ipad1.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2732 : 2048) : 180" :requiredHeight="template ? (template.isLandscape ? 2048 : 2732) : 180" :imageName="'ipad2.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
						<el-col :span="8">
							<imageUploader :requiredWidth="template ? (template.isLandscape ? 2732 : 2048) : 180" :requiredHeight="template ? (template.isLandscape ? 2048 : 2732) : 180" :imageName="'ipad3.jpg'" :templateCode="template ? template.code : null" :creator="series ? series.creator : 0" :seriesID="series ? series.id : 0" :appStoreAccount="appStoreAccountAccount" />
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="图片压缩包">
					<el-upload class="upload-demo" drag :action="uploadAPI" accept=".zip" :data="uploadData" :on-success="handleUploadScucess" :on-error="handleUploadError">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传zip文件</div>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click="onCancel">取消</el-button>
					<el-button type="info" icon="arrow-left" @click="onPrev">上一个</el-button>
					<el-button type="info" @click="onNext">下一个<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';
	import * as config from '../../config';

	import imageUploader from '../common/ImageUploader.vue';

	let gameID = 0;
	let prevGameID = 0, nextGameID = 0;

	export default {
		components: { imageUploader },
		data: function() {
			return {
				form: {
					id: -1,
					name: "",
					bundleID: "",
					appStoreAccount: 1,
					status: "",
					// iTunesURL: "",
					// version: "",
					// buildVersion: "",
					rootSeries: "",
					rootTemplate: "",
					remarks: ''
				},
				// appleAppID: "null",
				appStoreAccount: [],
				template: null,
				series: null,
				appStoreAccountAccount: "",
				uploadAPI: config.BUILD_ADMIN_HOST + '/updateGameImgsZip',
				// 状态 0:未上传 1:已上传 2:准备提交 3：待审核 4：审核中 5：已上架 6：被打回
				gameStatusData: [
					{
						key: '未上传',
						val: 0
					},
					{
						key: '已上传',
						val: 1
					},
					{
						key: '待审核',
						val: 3
					},
					{
						key: '审核中',
						val: 4
					},
					{
						key: '已上架',
						val: 5
					},
					{
						key: '被打回',
						val: 6
					}
				]
			}
		},
		computed: {
			uploadData() {
				return {
					uid: utils.getUserInfo().id,
					templateCode: this.template ? this.template.code : '',
					seriesID: this.series ? this.series.id : '',
					appStoreAccount: this.appStoreAccountAccount
				};
			}
		},
		methods: {
			onSubmit() {
				net.post(api.modifyGame(), Object.assign({uid: utils.getUserInfo().id}, this.form), result => {
					if (result.status === 1) {
						this.$message.success('提交成功！');
						// this.onCancel();
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.$message.error("有错误");
				});
			},
			onCancel() {
				this.$router.replace('/gameList');
			},
			getAppStoreAccount(id) {
				for (let i = 0; i < this.appStoreAccount.length; i++) {
					if (this.appStoreAccount[i].id === id) {
						return this.appStoreAccount[i].account;
					}
				}
				return '';
			},
			handleUploadScucess(res, file) {
				 this.$message({
					message: '图片压缩包上传成功！',
					type: 'success'
				});
			},
			handleUploadError(err) {
				this.$message.error("图片压缩包上传失败！");
			},
			onPrev() {
				if (prevGameID > 0) {
					this.fetchGame(prevGameID);
				} else {
					this.$message({
						message: '没有更新的游戏了哦！',
						type: 'warning'
					});
				}
			},
			onNext() {
				if (nextGameID > 0) {
					this.fetchGame(nextGameID);
				} else {
					this.$message({
						message: '没有更旧的游戏了哦！',
						type: 'warning'
					});
				}
			},
			fetchGame(gameID) {
				net.get(api.getGame(utils.getUserInfo().id, gameID), result => {
					if (result.status === 1) {
						this.form = result.data.game;
						this.appStoreAccount = result.data.appStoreAccount;
						this.template = result.data.template;
						this.series = result.data.series;
						prevGameID = result.data.prevGameID;
						nextGameID = result.data.nextGameID;
						console.log(result.data);

						for (var i = 0; i < result.data.appStoreAccount.length; i++) {
							if (result.data.appStoreAccount[i].id === result.data.game.appStoreAccount) {
								this.appStoreAccountAccount = result.data.appStoreAccount[i].account;
								break;
							}
						}
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.$message.error("有错误");
				});
			}
		},
		mounted: function () {
			this.fetchGame(gameID);
		},
		beforeMount: function() {
			gameID = this.$route.query.id;
		}
	}
</script>