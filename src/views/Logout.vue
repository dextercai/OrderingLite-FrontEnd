<template>
	<el-form class="login-box"><h3 class="login-title">注销成功</h3></el-form>
</template>
<script>
export default {
	mounted() {
		localStorage.setItem('sessionToken', null);
		setTimeout(() => {
			this.$router.push({ name: 'Login' });
		}, 3000);
	}
};
</script>

<style lang="scss" scoped>
.login-box {
	border: 1px solid #dcdfe6;
	width: 85%;
	margin: 180px auto;
	padding: 35px 35px 15px 35px;
	border-radius: 5px;
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	box-shadow: 0 0 25px #909399;
}

.login-title {
	text-align: center;
	margin: 0 auto 40px auto;
	color: #303133;
}
</style>
