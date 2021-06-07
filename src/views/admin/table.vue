<template>
	<el-container>
		<el-main>
			<el-header style="text-align: right; font-size: 12px"><el-button icon="el-icon-plus" type="success" size="small" @click="add()">添加</el-button></el-header>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#"></el-table-column>
				<el-table-column prop="name" label="桌台名"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" type="primary" size="small" @click="edit(scope.row)">修改</el-button>
						<el-button icon="el-icon-close" type="danger" size="small" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog title="更新" :visible.sync="dialogVisible">
				<el-form :model="form">
					<el-form-item label="桌台名"><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
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
				name: ''
			}
		};
	},
	methods: {
		commit: function() {
			let that = this;
			request({
				url: '/Table/update',
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
			this.form.id = info.id;
			this.form.name = info.name;
			this.dialogVisible = true;
		},
		add: function() {
			this.form.id = null;
			this.form.name = "";
			this.dialogVisible = true;
		},
		flush: function() {
			let that = this;
			request({
				url: '/Table/list',
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
						url: '/Table/delete',
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
