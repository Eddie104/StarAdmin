<template>
	<div>
		<el-upload v-bind:style="iconUploader" :action="uploadHost" :data="imageData" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
			<img :src="imgUrl" v-bind:style="iconStyle">
			<!-- <i v-else class="el-icon-plus" v-bind:style="iconUploaderIcon" /> -->
		</el-upload>
		{{ requiredWidth}} * {{ requiredHeight}}
	</div>
</template>

<script>
	import * as config from '../../config';	

	export default {
		data() {
			return {
				uploadHost: config.BUILD_ADMIN_HOST + '/updateIcon',
				randomNum: Math.random(),
				iconUploader: {
					border: '1px dashed #d9d9d9',
					'border-radius': '6px',
					cursor: 'pointer',
					position: 'relative',
					overflow: 'hidden',
					width: `${this.requiredWidth > 180 ? 180 : this.requiredWidth}px`,
					height: `${this.requiredHeight > 180 ? 180 : this.requiredHeight}px`
				},
				iconUploaderIcon: {
					'font-size': '10px',
					color: '#8c939d',
					width: `${this.requiredWidth > 180 ? 180 : this.requiredWidth}px`,
					height: `${this.requiredHeight > 180 ? 180 : this.requiredHeight}px`,
					'text-align': 'center'
				},
				iconStyle: {
					width: `${this.requiredWidth > 180 ? 180 : this.requiredWidth}px`,
					height: `${this.requiredHeight > 180 ? 180 : this.requiredHeight}px`,
					display: 'block'
				}
			}
		},
		props: ['requiredWidth', 'requiredHeight', 'templateCode', 'seriesID', 'appStoreAccount', 'imageName', 'creator' ],
		computed: {
			imgUrl() {
				return this.templateCode ? `${config.BUILD_PREVIEW_HOST}/${this.creator}/${this.templateCode}/${this.seriesID}/gameImgs/${this.appStoreAccount}/${this.imageName}?r=` + this.randomNum : null;
			},
			imageData() {
				return {
					uid: this.creator,
					templateCode: this.templateCode,
					seriesID: this.seriesID,
					appStoreAccount: this.appStoreAccount,
					requiredWidth: this.requiredWidth,
					requiredHeight: this.requiredHeight,
					imageName: this.imageName
				};
			}
		},
		methods: {
			handleAvatarScucess(res, file) {
				const image = new Image();
				const self = this;
				image.onload = function() {
					if (image.width !== self.requiredWidth || image.height !== self.requiredHeight) {
						self.$message.error(`icon尺寸不对，应为${self.requiredWidth}*${self.requiredHeight}！`);
					}
					self.randomNum = Math.random() + 1;
				};
				image.src = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				// const isPng = file.type === 'image/png';
				// // const isLt2M = file.size / 1024 / 1024 < 2;
				// if (!isPng) {
				// 	this.$message.error('上传图片只能是 PNG 格式!');
				// }
				// // if (!isLt2M) {
				// // 	this.$message.error('上传头像图片大小不能超过 2MB!');
				// // }
				// return isPng;
				
				return true;
			}
		}
	}
</script>
<style scoped>
	.icon-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
</style>
