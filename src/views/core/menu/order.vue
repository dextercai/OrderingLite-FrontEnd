<template>
	<el-container>
		<el-aside width="150px">
			<el-menu class="el-menu-vertical-demo">
				<el-menu-item v-for="menuItem in menuTypeList" :key="menuItem.id">
					<span slot="title">{{ menuItem.name }}</span>
				</el-menu-item>
			</el-menu>
		</el-aside>
		<el-container>
			<el-main>
				<el-table :data="menuList">
					<el-table-column type="expand">
						<template slot-scope="props">
							<el-form label-position="left" inline class="demo-table-expand">
								<el-form-item label="菜品详情:">
									<span>{{ props.row.detail }}</span>
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
						
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>Footer</el-footer>
		</el-container>
	</el-container>
</template>
<script>
import request from '../../../utils/request.js';
export default {
	data: function() {
		return {
			menuTypeList: [],
			menuList: []
		};
	},
	mounted() {
		let that = this;
		request({
			url: '/Order/TypeList',
			method: 'get'
		})
			.then(function(resp) {
				if (resp.data.status == 200) {
					that.menuTypeList = resp.data.result;
				}
			})
			.catch(e => {
				that.$message('后端请求时发生链路错误，暂时不可用。');
				console.log(e);
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
						console.log(that.menuList);
					}
				})
				.catch(e => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
					console.log(e);
				});
		}
	}
};
</script>
<style>
.el-header,
.el-footer {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
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
</style>
