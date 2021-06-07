<template>
	<el-container>
		<el-main>
			<el-row :gutter="20">
				<el-col :span="7" v-for="item in tableData" :key="item.id">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<el-tag v-if="item.session" size="mini" effect="dark" type="danger">忙</el-tag>
							<el-tag v-if="!item.session" size="mini" effect="dark" type="success">空</el-tag>
							<span>&nbsp;{{ item.name }}</span>
							<el-button style="float: right; padding: 3px 0" type="text" @click="pay(item.dish, item.session.id)" v-if="item.session">结账</el-button>
						</div>
						<div v-if="item.session">
							<div class="text item">桌台口令：{{ item.token }}</div>
							<div class="text item">开始时间：{{ getTimeD(item.session.starttime) }}分钟前</div>
							<div class="text item">桌台服务员：{{ item.user.username }}</div>
							<div class="text item">桌台已下单：{{ calcDishAmount(item.dish) }} 份</div>
							<el-button type="success" icon="el-icon-finished" @click="showTableDetail(item.dish)">点餐详情</el-button>
						</div>
						<div v-else><el-button type="primary" @click="start(item.id)">开台</el-button></div>
					</el-card>
				</el-col>
			</el-row>
		</el-main>
		<el-dialog title="点菜单" :visible.sync="dialogOrderVisible">
			<el-form>
				<el-table :data="dishDetail">
					<el-table-column property="detail.name" label="菜名"></el-table-column>
					<el-table-column label="数量">
						<template slot-scope="scope">
							<span>{{ scope.row.amount }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
							<span>{{ scope.row.status }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click="ret(scope.row)" v-if="scope.row.amount != 0">退菜</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<span slot="footer" class="dialog-footer"><el-button @click="dialogOrderVisible = false">确 定</el-button></span>
		</el-dialog>

		<el-dialog title="结账单" :visible.sync="dialogReceiptVisible">
			<el-form>
				<el-table :data="dishDetail">
					<el-table-column property="detail.name" label="菜名"></el-table-column>
					<el-table-column property="detail.price" label="单价"></el-table-column>
					<el-table-column label="数量">
						<template slot-scope="scope">
							<span>{{ scope.row.amount }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
							<span>{{ scope.row.status }}</span>
						</template>
					</el-table-column>
					<el-table-column label="小计">
						<template slot-scope="scope">
							<span>￥{{ scope.row.detail.price * scope.row.amount }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<el-divider><i class="el-icon-d-caret"></i></el-divider>
			<div>￥{{ this.getReadableDishTotal() }}</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogReceiptVisible = false">取消</el-button>
				<el-button @click="commitPay()" type="primary">结单</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
import request from '../../utils/request.js';
export default {
	mounted() {
		this.flush();
	},
	data: () => {
		return {
			tableData: [],
			dishDetail: [],
			dialogOrderVisible: false,
			dialogReceiptVisible: false,
			payId: 0
		};
	},
	methods: {
		flush: function() {
			let that = this;
			request({
				url: '/Session/list',
				method: 'get'
			})
				.then(function(resp) {
					that.tableData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		calcDishAmount: function(dishes) {
			let amount = 0;
			dishes.forEach(function(item) {
				amount += item.amount;
			});
			return amount;
		},
		showTableDetail: function(dishes) {
			this.dishDetail = dishes;
			this.dialogOrderVisible = true;
		},
		getReadableDishTotal: function() {
			let result = 0;
			for (let i = 0; i < this.dishDetail.length; i++) {
				if (this.dishDetail[i] != null) {
					result += this.dishDetail[i].amount * this.dishDetail[i].detail.price;
				}
			}
			return result;
		},
		pay: function(dishes, sid) {
			this.dishDetail = dishes;
			this.dialogReceiptVisible = true;
			this.payId = sid;
		},
		ret: function(item) {
			let that = this;
			request({
				url: '/Session/ret',
				method: 'post',
				data: {
					oid: item.id
				}
			})
				.then(resp => {
					if (resp.data.status == 200) {
						that.$message(resp.data.message);
						that.dialogOrderVisible = false;
						that.flush();
					} else {
						that.$message(resp.data.message);
					}
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		commitPay: function() {
			this.$confirm('此操作将结单, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let that = this;
					request({
						url: '/Session/commitPay',
						method: 'post',
						data: {
							sid: this.payId
						}
					})
						.then(resp => {
							if (resp.data.status == 200) {
								that.dialogReceiptVisible = false;
								that.flush();
								that.$message(resp.data.message);
							} else {
								that.$message(resp.data.message);
							}
						})
						.catch(() => {
							that.$message('后端请求时发生链路错误，暂时不可用。');
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
		},
		start: function(tid) {
			let that = this;
			request({
				url: '/Session/start',
				method: 'post',
				data: {
					tid: tid
				}
			})
				.then(resp => {
					if (resp.data.status == 200) {
						that.$message(resp.data.message);
						that.flush();
					} else {
						that.$message(resp.data.message);
					}
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		getTimeD: function(str) {
			return Math.round((new Date().valueOf() - Number(str) * 1000) / 60 / 1000);
		}
	}
};
</script>

<style scoped>
.el-col {
	border-radius: 4px;
}
.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}

.box-card {
	width: 200px;
	height: 300px;
}
</style>
