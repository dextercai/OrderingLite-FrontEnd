<template>
	<div>
		<el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
			<h3 class="login-title">桌台进入</h3>
			<el-form-item label="桌台口令" prop="token"><el-input type="text" placeholder="请输入桌台口令" v-model="form.token" /></el-form-item>
			<el-form-item><el-button type="primary" v-on:click="onSubmit('loginForm')">登录</el-button></el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			form: {
				token: '',
			},
			// 表单验证，需要在 el-form-item 元素中增加 prop 属性
			rules: {
				token: [{ required: true, message: '不可为空', trigger: 'blur' }],
			},
		};
	},
	mounted() {
		let thisToken = localStorage.getItem('sessionToken');
		if (thisToken != '' && thisToken != null) {
			//TODO this.$router.push({name: 'main'})
		}
	},
	methods: {
		onSubmit() {
			this.$router.push({ name: 'Order', params: { tableId: this.form.token }})
		}
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
