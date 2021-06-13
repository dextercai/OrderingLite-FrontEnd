<template>
	<el-container>
		<el-main>
			<el-header style="text-align: right; font-size: 12px"><el-button icon="el-icon-plus" type="success" size="small" @click="add()">添加</el-button></el-header>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#"></el-table-column>
				<el-table-column prop="dtype.name" label="类目"></el-table-column>
				<el-table-column prop="name" label="菜名"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" type="primary" size="small" @click="edit(scope.row)">修改</el-button>
						<el-button icon="el-icon-close" type="danger" size="small" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog title="更新" :visible.sync="dialogVisible">
				<el-form :model="form">
					<el-form-item label="菜名"><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
					<el-form-item label="分类">
						<el-select v-model="form.tid" placeholder="请选择">
							<el-option v-for="item in tidList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="定价"><el-input v-model="form.price" autocomplete="off"></el-input></el-form-item>
					<el-form-item label="详情"><el-input v-model="form.detail" autocomplete="off"></el-input></el-form-item>
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
				name: '',
				tid: '',
				price: '',
				detail: ''
			},
			tidList: []
		};
	},
	methods: {
		commit: function() {
			let that = this;
			request({
				url: '/dish/update',
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
			this.form.tid = info.dtype.id;
			this.form.price = info.price;
			this.form.detail = info.detail;
			this.dialogVisible = true;
		},
		add: function() {
			this.form.id = null;
			this.form.name = '';
			this.form.tid = null;
			this.form.price = '';
			this.form.detail = '';
			this.dialogVisible = true;
		},
		flush: function() {
			let that = this;
			request({
				url: '/dish/list',
				method: 'get'
			})
				.then(function(resp) {
					that.tableData = resp.data.result;
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
			request({
				url: '/Dtype/list',
				method: 'get'
			})
				.then(function(resp) {
					that.tidList = resp.data.result;
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
						url: '/dish/delete',
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
