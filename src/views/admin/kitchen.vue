<template>
	<el-container>
		<el-main>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="现场总览" name="All">
					<el-table :data="allData" style="width: 100%">
						<el-table-column prop="id" label="#"></el-table-column>
						<el-table-column prop="name" label="菜名"></el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<span>
									<el-tag type="info" effect="dark">{{ scope.row.amount }}</el-tag>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="tName" label="下单桌"></el-table-column>
						<el-table-column prop="username" label="服务员"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="待制作" name="pre">
					<el-table :data="preData" style="width: 100%">
						<el-table-column prop="id" label="#"></el-table-column>
						<el-table-column prop="name" label="菜名"></el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<span>
									<el-tag type="info" effect="dark">{{ scope.row.amount }}</el-tag>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="tName" label="下单桌"></el-table-column>
						<el-table-column prop="username" label="服务员"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<span>
									<el-button-group>
										<el-button v-if="scope.row.status == '已下单' && scope.row.isDone == 0" type="success" round @click="change(scope.row.id, '正制作', null)">制作</el-button>
										<el-button v-if="scope.row.status == '正制作' && scope.row.isDone == 0" type="success" round @click="change(scope.row.id, '已出菜', null)">出菜</el-button>
										<el-button v-if="scope.row.isDone == 0" type="danger" @click="change(scope.row.id, '拒单', 0)" round>拒单</el-button>
										<el-button v-if="scope.row.isDone == 1" type="disable" @click="change(scope.row.id, '拒单', 0)" round>仅限拒单</el-button>
									</el-button-group>
								</span>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="已完成" name="done">
					<el-table :data="doneData" style="width: 100%" :row-class-name="tableRowClassName">
						<el-table-column prop="id" label="#"></el-table-column>
						<el-table-column prop="name" label="菜名"></el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<span>
									<el-tag type="info" effect="dark">{{ scope.row.amount }}</el-tag>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="tName" label="下单桌"></el-table-column>
						<el-table-column prop="username" label="服务员"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>
<script>
import request from '../../utils/request.js';
export default {
	data() {
		return {
			activeName: 'pre',
			allData: [],
			preData: [],
			doneData: [],
			timer: {}
		};
	},
	mounted() {
		this.flush();
		let that = this;
		that.timer = window.setInterval(() => {
			setTimeout(() => {
				that.flush();
			}, 0);
		}, 5000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		flush: function() {
			let that = this;
			request({
				url: '/Kitchen/alllist',
				method: 'get'
			})
				.then(function(resp) {
					that.allData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});

			request({
				url: '/Kitchen/prelist',
				method: 'get'
			})
				.then(function(resp) {
					that.preData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
			request({
				url: '/Kitchen/donelist',
				method: 'get'
			})
				.then(function(resp) {
					that.doneData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		change: function(id, status, amount) {
			let that = this;
			request({
				url: '/Kitchen/toPre',
				method: 'post',
				data: {
					id: id,
					status: status,
					amount: amount
				}
			})
				.then(resp => {
					if (resp.data.status == 200) {
						that.flush();
						that.$message(resp.data.message);
					} else {
						that.$message(resp.data.message);
					}
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		tableRowClassName: function({ row }) {
			if (row.status == "拒单") {
				return 'warning-row';
			} else if (row.status == "已出菜") {
				return 'success-row';
			}
			return '';
		}
	}
};
</script>
<style scoped="scoped">
.el-table .warning-row {
	background: oldlace;
}

.el-table .success-row {
	background: #f0f9eb;
}
</style>
