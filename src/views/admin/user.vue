<template>
	<el-container>
		<el-main>
			<el-header style="text-align: right; font-size: 12px"><el-button icon="el-icon-plus" type="success" size="small" @click="add()">添加</el-button></el-header>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#"></el-table-column>
				<el-table-column prop="username" label="用户名"></el-table-column>
				<el-table-column label="用户类型">
					<template slot-scope="scope">
						<span>{{ scope.row.type == 1 ? '普通员工' : '超级管理员' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" type="primary" size="small" @click="edit(scope.row)">修改</el-button>
						<el-button icon="el-icon-close" type="danger" size="small" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog title="更新" :visible.sync="dialogVisible">
				<el-form :model="form">
					<el-form-item label="用户名"><el-input v-model="form.username" autocomplete="off"></el-input></el-form-item>
					<el-form-item label="密码"><el-input v-model="form.password" autocomplete="off"></el-input></el-form-item>
					<el-form-item label="账户类型">
						<el-select v-model="form.type" placeholder="请选择">
							<el-option label="普通员工" value="1"></el-option>
							<el-option label="超级管理员" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="commit()">提 交</el-button>
				</span>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import request from '../../utils/request.js';
export default {
	mounted() {
		this.flush();
	},
	data() {
		return {
			tableData: [],
			dialogVisible: false,
			editDialogVisible: false,
			form: {
				id: null,
				username: '',
				password: '',
				type: ''
			}
		};
	},
	methods: {
		commit: function() {
			let that = this;
			request({
				url: '/User/update',
				method: 'post',
				data: that.form
			})
				.then(function(resp) {
					that.$message(resp.data.message);
					that.dialogVisible = false;
					that.flush();
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		edit: function(info) {
			this.form.username = info.username;
			this.form.id = info.id;
			this.form.type = info.type.toString();
			this.form.password = '';
			this.dialogVisible = true;
		},
		add: function() {
			this.form.username = '';
			this.form.id = null;
			this.form.type = '';
			this.form.password = '';
			this.dialogVisible = true;
		},
		flush: function() {
			let that = this;
			request({
				url: '/User/list',
				method: 'get'
			})
				.then(function(resp) {
					that.tableData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		},
		del: function(info) {
			this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let that = this;
					request({
						url: '/User/delete',
						method: 'post',
						data: {
							id: info.id
						}
					})
						.then(function(resp) {
							that.$message(resp.data.message);
							that.dialogVisible = false;
							that.flush();
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
		}
	}
};
</script>
