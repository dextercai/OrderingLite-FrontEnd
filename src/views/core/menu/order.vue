<template>
	<el-container>
		<el-aside width="150px">
			<el-menu class="el-menu-vertical-demo">
				<el-menu-item v-for="menuItem in menuTypeList" :key="menuItem.id" @click="flushMenuList(menuItem.id)">
					<span slot="title">{{ menuItem.name }}</span>
				</el-menu-item>
			</el-menu>
		</el-aside>
		<el-container>
			<el-main>
				<el-table :data="menuList">
					<el-table-column type="expand">
						<template slot-scope="scope">
							<el-form label-position="left" inline class="demo-table-expand">
								<el-form-item label="菜品详情:">
									<span>{{ scope.row.detail }}</span>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column label="菜品" prop="name"></el-table-column>
					<el-table-column label="价格">
						<template slot-scope="scope">
							<span>￥{{ scope.row.price }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click="addDish(scope.row)" icon="el-icon-plus" type="success" size="mini" circle></el-button>
							&nbsp;
							<el-tag>{{ $store.state.dishList[scope.row.id] ? $store.state.dishList[scope.row.id].amount : 0 }}</el-tag>
							&nbsp;
							<el-button @click="delDish(scope.row)" icon="el-icon-minus" type="danger" size="mini" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>
				<el-button type="success" >{{this.tableName}}</el-button>
				<el-button type="primary">总计 {{ this.totalAmount }} / ￥{{ this.totalPrice }}</el-button>
				<el-button type="danger" icon="el-icon-s-goods" @click="dialogVisible = true"></el-button>
			</el-footer>
		</el-container>
		<el-dialog title="点菜单" :visible.sync="dialogVisible">
			<el-form>
				<el-table :data="this.getReadableDishList()">
					<el-table-column property="name" label="菜名"></el-table-column>
					<el-table-column property="price" label="单价"></el-table-column>
					<el-table-column label="数量">
						<template slot-scope="scope">
							<span>{{ scope.row.amount }}</span>
						</template>
					</el-table-column>
					<el-table-column label="小计">
						<template slot-scope="scope">
							<span>￥{{ scope.row.price * scope.row.amount }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<el-divider><i class="el-icon-d-caret"></i></el-divider>
			<div>￥{{this.getReadableDishTotal()}}</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="commitDishList()">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>
<script>
import request from '../../../utils/request.js';
export default {
	data: function() {
		return {
			menuTypeList: [],
			menuList: [],
			dishAmountRaw: this.$store.state.dishList,
			dialogVisible: false,
			tableName: "",
			totalDialog: false
		};
	},
	computed: {
		totalAmount: function() {
			let result = 0;
			for (let i = 0; i < this.dishAmountRaw.length; i++) {
				if (this.dishAmountRaw[i] != null) {
					result += this.dishAmountRaw[i].amount;
				}
			}
			return result;
		},
		totalPrice: function() {
			let result = 0;
			for (let i = 0; i < this.dishAmountRaw.length; i++) {
				if (this.dishAmountRaw[i] != null) {
					result += this.dishAmountRaw[i].amount * this.dishAmountRaw[i].price;
				}
			}
			return result;
		},
		dishAmountCalced() {
			return function(id) {
				if (this.dishAmountRaw[id] != null) {
					return this.dishAmountRaw[id].amount;
				} else {
					return 0;
				}
			};
		}
	},
	mounted() {
		let that = this;
		request({
			url: '/Order/tableInfo',
			method: 'post',
			data: {
				tableToken: this.$route.params.tableId
			}
		}).then(function(resp) {
				if (resp.data.status == 200) {
					that.tableName = resp.data.result.name;
				}else{
					that.$message('非法桌台，请向服务员询问');
					that.$router.push({name: 'OrderToken'})
				}
			})
			.catch(() => {
				that.$message('后端请求时发生链路错误，暂时不可用。');
			});
			
		
		request({
			url: '/Order/TypeList',
			method: 'get'
		})
			.then(function(resp) {
				if (resp.data.status == 200) {
					that.menuTypeList = resp.data.result;
				}
			})
			.catch(() => {
				that.$message('后端请求时发生链路错误，暂时不可用。');
			});
		this.flushMenuList(1);
	},
	methods: {
		flushMenuList: function(tid) {
			let that = this;
			request({
				url: '/Order/MenuList',
				method: 'post',
				data: {
					type: tid
				}
			})
				.then(function(resp) {
					if (resp.data.status == 200) {
						that.menuList = resp.data.result;
					}
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		addDish: function(thisRow) {
			this.$store.commit('F_ADD_DISH', thisRow);
		},
		delDish: function(thisRow) {
			this.$store.commit('F_DEL_DISH', thisRow);
		},
		getReadableDishList: function() {
			let result = [];
			for (let i = 0; i < this.dishAmountRaw.length; i++) {
				if (this.dishAmountRaw[i] != null) {
					result.push(this.dishAmountRaw[i]);
				}
			}
			return result;
		},
		getReadableDishTotal: function() {
			let result = 0;
			for (let i = 0; i < this.dishAmountRaw.length; i++) {
				if (this.dishAmountRaw[i] != null) {
					result += this.dishAmountRaw[i].amount * this.dishAmountRaw[i].price
				}
			}
			return result;
		},
		commitDishList: function(){
			let that = this
			request({
				url: '/Order/commit',
				method: 'post',
				data: {
					list: that.getReadableDishList(),
					tableToken: this.$route.params.tableId
				}
			})
				.then(function() {
					that.$store.commit('F_FSH_DISH');
					that.dialogVisible = false
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		}
	}
};
</script>
<style scoped>
.el-header,
.el-footer {
	background-color: #b3c0d1;
	color: #333;
	line-height: 60px;
}

.el-aside {
	background-color: #d3dce6;
	color: #333;
	text-align: center;
	line-height: 200px;
}

.el-main {
	background-color: #e9eef3;
	color: #333;
	text-align: center;
}

body > .el-container {
	margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
	line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
	line-height: 320px;
}
.right {
	position: absolute;
	right: 50px;
}
</style>
