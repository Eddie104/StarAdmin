<template>
	<div>
		<div class="table">
			<div class="crumbs">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item><i class="el-icon-menu"></i> 自动打包</el-breadcrumb-item>
					<el-breadcrumb-item>打包任务列表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-card>
				<el-row type="flex" class="row-bg" justify="center" style="marginBottom: 10px;marginTop: 10px">
					进行中任务
				</el-row>
				<el-table :data="doingTaskTableData" border style="width: 100%" stripe>
					<el-table-column prop="id" label="ID" width="120" />
					<el-table-column prop="templateName" label="模板" width="160" />
					<el-table-column prop="seriesName" label="系列" width="280" />
					<el-table-column prop="creatorName" label="创建者" width="160" />
					<el-table-column prop="mac.name" label="mac" width="160" />
					<el-table-column prop="birthday" label="创建时间" show-overflow-tooltip />
				</el-table>
			</el-card>

			<el-card style="marginTop: 10px">
				<el-row type="flex" class="row-bg" justify="center" style="marginBottom: 10px;marginTop: 10px">
					等待中任务
				</el-row>
				<el-table :data="waitingTaskTableData" border style="width: 100%" stripe>
					<el-table-column prop="id" label="ID" width="120" />
					<el-table-column prop="templateName" label="模板" width="160" />
					<el-table-column prop="seriesName" label="系列" width="280" />
					<el-table-column prop="creatorName" label="创建者" width="160" />
					<el-table-column prop="mac.name" label="mac" width="160" />
					<el-table-column prop="birthday" label="创建时间" show-overflow-tooltip />
				</el-table>
			</el-card>
			
			<el-card style="marginTop: 10px">
				<el-row type="flex" class="row-bg" justify="center" style="marginBottom: 10px;marginTop: 10px">
					所有任务
				</el-row>
				<el-select v-if="isAdmin" style="marginBottom: 10px" v-model="user" placeholder="请选择" @change="handleUserChanged">
					<el-option v-for="item in users" :label="item.name" :value="item.id" />
				</el-select>
				<el-table :data="taskTableData" border style="width: 100%" stripe v-loading="isShowLoading" element-loading-text="数据加载中">
					<el-table-column prop="id" label="ID" width="120" />
					<el-table-column prop="templateName" label="模板" width="160" />
					<el-table-column prop="seriesName" label="系列" width="280" />
					<el-table-column v-if="isAdmin" prop="creatorName" label="创建者" width="160" />
					<el-table-column prop="mac.name" label="mac" width="160" />
					<el-table-column prop="birthday" label="创建时间" show-overflow-tooltip />
					<el-table-column label="状态" width="200">
						<template scope="scope">
							{{ scope.row.statusStr }}
							({{ scope.row.progress }})
							<el-button v-if="scope.row.status===0" size="small" type="danger" @click="handleCancel(scope.$index, scope.row)">取消</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination layout="prev, pager, next" :total="total" :page-size="count" @current-change="handleCurrentPageChange" />
				</div>
			</el-card>
		</div>
		<el-dialog title="提示" v-model="cancelTaskDialogVisible" size="tiny">
			<span>取消打包任务嘛？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCancelTaskDialog(false)">我再想想</el-button>
				<el-button type="primary" @click="handleCancelTaskDialog(true)">确定取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import * as net from '../../net';
	import * as api from '../../api';
	import * as utils from '../../utils';
	import * as config from '../../config';

	let cancelTask = null;
	let macArr = null;

	export default {
		data() {
			return {
				doingTaskTableData: [],
				waitingTaskTableData: [],
				taskTableData: [],
				isShowLoading: true,
				total: 0,
				count: 10,
				cancelTaskDialogVisible: false,
				isAdmin:  utils.isAdmin(),
				users: [{name: '全部', id: 0}],
				user: utils.isAdmin() ? 0 : utils.getUserInfo().id
			}
		},
		methods: {
			handleCurrentPageChange(page) {
				this.isShowLoading = true;
				net.get(api.getTask(utils.getUserInfo().id, 0, 0, page, this.count, this.user), result => {
					this.isShowLoading = false;
					if (result.status === 1) {
						let cur = 0;
						for (let i = 0; i < result.data.task.length; i++) {
							result.data.task[i].birthday = result.data.task[i].birthday.replace('T', ' ').split('.')[0];
							result.data.task[i].mac = utils.getItemFromArray(macArr, 'id', result.data.task[i].mac);
							if (this.isAdmin) {
								result.data.task[i].creatorName = utils.getItemFromArray(this.users, 'id', result.data.task[i].creator).name;
							}
							result.data.task[i].statusStr = result.data.task[i].status === 0 ? '等待中' : (result.data.task[i].status === 1 ? '进行中' : (result.data.task[i].status === -1 ? '已取消' : '已完成'));
							cur = 0;
							for (let j = 0; j < result.data.task[i].games.length; j++) {
								if (result.data.task[i].games[j].status === 2 || typeof(result.data.task[i].games[j].status) === 'undefined') {
									++cur;
								}
							}
							result.data.task[i].progress = `${cur}/${result.data.task[i].games.length}`;
						}
						this.taskTableData = result.data.task;
						if (result.data.count) {
							this.total = result.data.count;
						}
					} else {
						this.$message.error(result.data);
					}
				}, err => {
					this.isShowLoading = false;
					this.$message.error("有错误");
				});
			},
			handleCancel(index, row) {
				cancelTask = row;
				this.cancelTaskDialogVisible = true;
			},
			handleCancelTaskDialog(cancel) {
				this.cancelTaskDialogVisible = false;
				if (cancel) {
					net.get(api.cancelTask(cancelTask.id), r => {
						if (r.status === 1) {
							const tmp = this.taskTableData.slice();
							for (let i = 0; i < tmp.length; i++) {
								if (tmp[i].id === cancelTask.id) {
									tmp[i].status = -1;
									break;
								}
							}
							this.taskTableData = tmp;
							this.$message.success('任务删除成功');
						} else {
							this.$message.error(r.data);
						}
					}, err => {
						this.$message.error("有错误");
					});
				}
			},
			handleUserChanged(creator) {
				this.handleCurrentPageChange(1);
			}
		},
		// computed: {
		// 	birthdayDate() {
		// 		return "dsfdf";
		// 	}
		// },
		mounted: function () {
			// 先获取所有用户的数据，然后再获取等待中和进行中的任务数据，最后获取所有任务列表
			net.get(api.getRootUsers(0, 0), r => {
				if (r.status === 1) {
					r.data.users.unshift({
						name: '全部',
						id: 0
					});
					this.users = r.data.users;
					net.get(api.getWaitingTask(), r => {
						if (r.status === 1) {
							const { mac, task } = r.data;
							macArr = mac;
							const doingTaskTableData = [], waitingTaskTableData = [];
							for (let i = 0; i < task.length; i++) {
								task[i].mac = utils.getItemFromArray(mac, 'id', task[i].mac);
								task[i].creatorName = utils.getItemFromArray(this.users, 'id', task[i].creator).name;
								if (task[i].status === 0) {
									waitingTaskTableData.push(task[i]);
								} else if (task[i].status === 1) {
									doingTaskTableData.push(task[i]);
								}
							}
							this.doingTaskTableData = doingTaskTableData;
							this.waitingTaskTableData = waitingTaskTableData;
							// 获取所有任务列表
							this.handleCurrentPageChange(1);
						} else {
							this.$message.error(r.data);
						}
					}, err => {
						this.$message.error("有错误");
					});
				} else {
					this.$message.error(r.data);
				}
			}, err => {
				this.$message.error("有错误");
			});
		}
	}
</script>