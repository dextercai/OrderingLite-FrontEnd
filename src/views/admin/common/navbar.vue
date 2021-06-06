<template>
	<div>
		<b-navbar toggleable="lg" type="dark" style="background-color: #3598DB;">
			<b-navbar-brand href="#">现场点餐系统</b-navbar-brand>

			<b-navbar-nav>
				<b-nav-item href="#/order">进入点餐</b-nav-item>
			</b-navbar-nav>
			
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<b-nav-item href="/">
						<i class="fa fa-home"></i>
						&nbsp;&nbsp;
					</b-nav-item>
				</b-navbar-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown right>
						<template slot="text">
							<i class="el-icon-user-solid"></i>
						</template>
						<b-dropdown-item href="#/login">登陆</b-dropdown-item>
						<b-dropdown-item href="#/logout">注销</b-dropdown-item>
					</b-nav-item-dropdown>

					<!-- <b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
						<b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button></b-nav-form>
						<b-nav-item-dropdown right>
						<template v-slot:button-content>
							<em>User</em></template>
						<b-dropdown-item href="#">Profile</b-dropdown-item>
						<b-dropdown-item href="#">Sign Out</b-dropdown-item></b-nav-item-dropdown> -->
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isLogin: localStorage.getItem('sessionToken') == null || localStorage.getItem('sessionToken') == ''
		};
	},
	methods: {}
};
</script>
<style></style>
