<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 游戏数据</el-breadcrumb-item>
				<el-breadcrumb-item to="incomeDataList" replace>收入统计</el-breadcrumb-item>
				<el-breadcrumb-item>添加</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="账号">
					<el-select v-model="user" placeholder="请选择">
						<el-option v-for="item in users" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="日期">
					<el-date-picker :clearable="false" :editable="false" v-model="dateVal" type="date" placeholder="选择日期" :picker-options="pickerOptions" />
				</el-form-item>
				<el-form-item label="yomob收入">
					<el-input-number v-model="yomob" :min="0" :max="99999" />
				</el-form-item>
				<el-form-item label="畅思收入">
					<el-input-number v-model="chance" :min="0" :max="99999" />
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
	import * as utils from '../../utils';

	export default {
		data: function() {
			return {
				users: [],
				user: 0,
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() >= Date.now() - 8.64e7;
					}
				},
				dateVal: utils.dateFormat(utils.yesterday(), 'yyyy-MM-dd'),
				yomob: 0,
				chance: 0
			}
		},
		methods: {
			onSubmit() {
				net.get(api.addIncome(utils.getUserInfo().id, this.user, this.yomob, this.chance, new Date(this.dateVal).getTime()), r => {
					if (r.status === 1) {
						this.$message.success('提交成功！');
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.$message.error("有错误");
				});
			},
			onCancel() {
				this.$router.replace('/incomeDataList');
			}
		},
		mounted: function () {
			net.get(api.getRootUsers(0, 0), r => {
				if (r.status === 1) {
					this.users = r.data.users;
					this.user = r.data.users[0].id;
				} else {
					this.$message.error(result.data);
				}
			}, err => {
				this.$message.error("有错误");
			});
		}
	}
</script>