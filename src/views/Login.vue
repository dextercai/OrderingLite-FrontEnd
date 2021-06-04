<template>
	<div>
		<el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
			<h3 class="login-title">后台登陆</h3>
			<el-form-item label="账号" prop="username"><el-input type="text" placeholder="请输入账号" v-model="form.username" /></el-form-item>
			<el-form-item label="密码" prop="password"><el-input type="password" placeholder="请输入密码" v-model="form.password" /></el-form-item>

			<el-form-item><el-button type="primary" v-on:click="onSubmit('loginForm')">登录</el-button></el-form-item>
		</el-form>

		<el-dialog title="系统提示" :visible.sync="dialogVisible" width="50%">
			<span>{{ this.dialogMessage }}</span>
			<span slot="footer" class="dialog-footer"><el-button type="primary" @click="dialogVisible = false">确 定</el-button></span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			form: {
				username: '',
				password: '',
				token: ''
			},
			// 表单验证，需要在 el-form-item 元素中增加 prop 属性
			rules: {
				username: [{ required: true, message: '账号不可为空', trigger: 'blur' }],
				password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
			},

			// 对话框显示和隐藏
			dialogVisible: false,
			dialogMessage: ''
		};
	},
	mounted() {
		let thisToken = localStorage.getItem('sessionToken');
		if (thisToken != '' && thisToken != null) {
			//TODO this.$router.push({name: 'main'})
		}
	},
	methods: {
		onSubmit(formName) {
			let that = this;
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.axios
						.post(
							process.env.VUE_APP_API_SRC + '/Auth/Login',
							this.qs.stringify({
								username: this.form.username,
								password: this.form.password
							})
						)
						.then(function(response) {
							let returnData = response.data;
							if (returnData.status == 200) {
								localStorage.setItem('sessionToken', returnData.result.token);
								that.dialogMessage = '验证正确';
								that.dialogVisible = true;
								that.$router.push({ name: 'user' });
							} else {
								that.dialogMessage = '验证不正确';
								that.dialogVisible = true;
							}
						});
				} else {
					this.dialogMessage = '账号密码不合法';
					this.dialogVisible = true;
				}
			});
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
