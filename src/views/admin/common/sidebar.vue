<template>
	<el-container style="height: 100%; border: 1px solid #eee">
		<el-aside style="width:auto;height:100vh;rgb(238, 241, 246);">
			<el-menu :default-openeds="['2', '3']" :collapse="isCollapse" router>
				<div @click="collapseSideBar()">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-s-unfold"></i>
						</template>
					</el-submenu>
				</div>
				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-setting"></i>
						<span slot="title">设定</span>
					</template>
					<el-menu-item-group title="系统管理">
						<router-link to="user"><el-menu-item>用户管理</el-menu-item></router-link>
						<router-link to="table"><el-menu-item>桌台管理</el-menu-item></router-link>
					</el-menu-item-group>
					<el-menu-item-group title="点餐管理">
						<router-link to="session"><el-menu-item>现场管理</el-menu-item></router-link>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-aside>
		<router-view></router-view>
	</el-container>
</template>
<style scoped>
.el-header {
	background-color: #b3c0d1;
	color: #333;
	line-height: 60px;
}

.el-aside {
	color: #333;
}
</style>

<script>
export default {
	data() {
		return {
			isCollapse: false
		};
	},
	mounted() {
		this.isCollapse = window.innerWidth < 796;
	},
	methods: {
		collapseSideBar() {
			this.isCollapse = !this.isCollapse;
		}
	}
};
</script>
