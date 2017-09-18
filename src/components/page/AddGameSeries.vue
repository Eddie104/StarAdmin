<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
				<el-breadcrumb-item to="seriesList" replace>系列列表</el-breadcrumb-item>
				<el-breadcrumb-item>{{ isEditor ? "编辑" : "添加" }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- <el-steps :space="360" :active="1" style="marginBottom: 10px">
			<el-step title="填写基本配置" icon="edit" />
			<el-step title="上传游戏资源" icon="upload" />
			<el-step title="完成" icon="circle-check" />
		</el-steps> -->
		<div class="form-box" v-loading="isShowLoading" element-loading-text="正在创建或者修改游戏系列，请稍等">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="游戏模板">
					<el-row type="flex" justify="end">
						<el-col :span="24">
							<el-select v-model="selectedTemplate" placeholder="请选择">
								<el-option v-for="item in templateData" :label="item.name" :value="item.id" />
							</el-select>
						</el-col>
						<el-col :span="0">
							<el-button type="success" @click="handlePreview">预览</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="系列名称">
					<el-input placeholder="请输入系列名称" v-model="form.name" />
				</el-form-item>
				<el-form-item label="游戏描述">
					<el-input type="textarea" :rows="10" placeholder="请输入游戏描述" v-model="form.des" />
				</el-form-item>
				<el-form-item label="游戏关键字">
					<el-input type="textarea" :rows="4" placeholder="请输入游戏关键字" v-model="form.keywords" />
				</el-form-item>
				<el-form-item label="talkingDataID">
					<el-input placeholder="请输入talkingDataID" v-model="form.talkingDataID" />
				</el-form-item>
				<el-form-item label="yomob广告">
					<el-col :span="11">
						<el-input placeholder="请输入yomob APP ID" v-model="form.yomobAppID" />
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-input placeholder="请输入yomob广告场景ID" v-model="form.yomobAdsID" />
					</el-col>
				</el-form-item>
				<el-form-item label="畅思广告ID">
					<el-input placeholder="请输入畅思广告ID" v-model="form.chanceID" />
				</el-form-item>
				<el-form-item label="游戏资源" v-if="isEditor">
					<el-upload class="upload-demo" drag :action="uploadAPI" accept=".zip" :data="uploadData" :on-success="handleUploadScucess" :on-error="handleUploadError">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传zip文件</div>
					</el-upload>
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
	import * as regUtil from '../../utils/regUtil';

	export default {
		data: function() {
			return {
				templateData: [],
				selectedTemplate: 1,
				form: {
					id: -1,
					name: "",
					des: "",
					keywords: "",
					talkingDataID: "",
					yomobAppID: "",
					yomobAdsID: "",
					chanceID: ""
				},
				isEditor: false,
				uploadData: {
					uid: -1,
					templateCode: "",
					seriesID: -1
				},
				uploadAPI: config.BUILD_ADMIN_HOST + '/updateGameZip',
				isShowLoading: false
			}
		},
		methods: {
			onSubmit() {
				const { name, des, keywords, talkingDataID, yomobAppID, yomobAdsID, chanceID } = this.form;
				if (name === '') {
					this.$message.error('系列名称不能为空');
					return;
				}
				if (des.length < 10) {
					this.$message.error('游戏描述字数不能小于10');
					return;
				}
				if (keywords.length > 100) {
					this.$message.error('游戏关键字字数不能大于100');
					return;
				}
				if (!regUtil.isTalkingDataID(talkingDataID)) {
					this.$message.error('talkingDataID有误！应为32位大写字母和数字的组合！');
					return;
				}
				if (yomobAppID !== "" && !regUtil.isYomobAppID(yomobAppID)) {
					this.$message.error('yomob APP ID有误！应为20位字母和数字的组合！');
					return;
				}
				if (yomobAdsID !== "" && !regUtil.isYomobAdsID(yomobAdsID)) {
					this.$message.error('yomob 广告场景 ID有误！应为19位字母和数字的组合！');
					return;
				}
				if (chanceID !== "" && !regUtil.isChanceID(chanceID)) {
					this.$message.error('畅思广告ID有误！');
					return;
				}
				this.isShowLoading = true;
				net.post(api.addGameSeries(), Object.assign({template: this.selectedTemplate, creator: utils.getUserInfo().id, isEditor: this.isEditor}, this.form), result => {
					if (result.status === 1) {
						let template = null;
						for (let i = 0; i < this.templateData.length; i++) {
							if (this.selectedTemplate === this.templateData[i].id) {
								template = this.templateData[i];
								break;
							}
						}
						// 新添加数据到线上服务器了，然后通知打包管理服务器初始化刚刚添加好的系列的游戏资源
						net.get(`${config.BUILD_ADMIN_HOST}/initSeries/${utils.getUserInfo().id}/${template.code}/${result.data.series.id}`, r => {
							this.isShowLoading = false;
							if (r.status === 1) {
								this.$message.success('提交成功！');
								this.onCancel();
							} else {
								this.$message.error(r.data);
							}
						}, err => {
							this.isShowLoading = false;
							this.$message.success('在打包机管理服务器上初始化新系列的时候出错了，您老不会现在没有呆在文渊楼503吧？');
						});
					} else {
						this.isShowLoading = false;
						this.$message.error(result.data);
					}
				}, err => {
					this.isShowLoading = false;
					this.$message.error("有错误");
				});
			},
			onCancel() {
				this.$router.replace('/seriesList');
			},
			handlePreview(index, row) {
				for (let i = 0; i < this.templateData.length; i++) {
					if (this.selectedTemplate === this.templateData[i].id) {
						const template = this.templateData[i];
						window.open(template.url, template.name, template.isLandscape ? "fullscreen=1,height=640,width=960" : "fullscreen=1,height=960,width=640");
						break;
					}
				}
			},
			handleUploadScucess(res, file) {
				 this.$message({
					message: '资源上传成功！',
					type: 'success'
				});
			},
			handleUploadError(err) {
				this.$message.error("资源上传失败！");
			}
		},
		mounted: function () {
			net.get(api.getGameTemplate(), result => {
				this.isShowLoading = false;
				if (result.status === 1) {
					this.templateData = result.data;
					if (this.isEditor) {
						net.get(api.getGameSeriesByID(this.$route.query.isEditor), result => {
							if (result.status === 1) {
								this.selectedTemplate = result.data.series.template;
								this.form = result.data.series;
								// 找出上传资源要用到的数据
								let templateCode = "";
								for (let i = 0; i < this.templateData.length; i++) {
									if (this.templateData[i].id === result.data.series.template) {
										templateCode = this.templateData[i].code;
										break;
									}
								}
								this.uploadData = {
									uid: utils.getUserInfo().id,
									templateCode,
									seriesID: this.$route.query.isEditor
								};
								console.log(this.uploadData);
							} else {
								this.$message.error(result.data);
							}
						});
					}
				} else {
					this.$message.error(result.data);
				}
			}, err => {
				this.isShowLoading = false;
				this.$message.error("有错误");
			});
		},
		beforeMount: function() {
			this.isEditor = this.$route.query.isEditor > 0;
		}
	}
</script>