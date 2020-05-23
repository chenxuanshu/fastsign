<template>
	<view class="login-page">
		<h2>FastSign</h2>
		<view class="form-wrapper">
			<form @submit="submit">
				<view class="header">
					<text>欢迎注册</text>
				</view>
				<view class="input-wrapper">
				<input type="text" placeholder="Username 6-10位,字母或数字"
				placeholder-class="phc" name="username" v-model="username"/>
				<input type="text" placeholder="Password 9-12位,必须包含字母,数字"
				placeholder-class="phc" password name="password" v-model="password"/>
				<input type="text" placeholder="Password again" password
				name="passwords" placeholder-class="phc" v-model="passwords"/>
				<input type="email" name="email" id="email" placeholder="Email" 
				placeholder-class="phc" v-model="email"/>
				<button type="default" size="mini" class="getpass"
				@click="getpass">获取验证码</button>
				<input type="text" placeholder="请填入邮箱验证码" name="verify"
				placeholder-class="phc" v-model="verify"/>
				</view>
				<button form-type="submit">注册</button>
			</form>
			<navigator url="./login" open-type="redirect" class="link" hover-class="none">已有账号？点击登录</navigator>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				username: '',
				email: '',
				password: '',
				passwords: '',
				verify: ''
				
			}
		},
		methods: {
			// 发送邮箱验证码
			getpass () {
				let email = this.email
				let emailRule = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				if (!email) {
					uni.showToast({
						title: '请填写邮箱',
						icon: 'none'
					})
				}else if (!emailRule.test(email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					})
				}else {
					let timestamp = Date.parse(new Date()) / 1000
					let timeArr = String(timestamp).split('')
					let oriStr = email + timestamp
					let oriArr = oriStr.split('')
					let sonStr = ''
					for (let i = 0; i < timeArr.length; i++) {
						sonStr += oriArr[timeArr[i]]
					}
					let resStr = oriStr.slice(10) + oriStr + sonStr + this.$adder
					let pwd = md5(resStr)
					uni.request({
						url: this.$http + 'user/send',
						method: 'POST',
						data: {
							email: email,
							timestamp: timestamp,
							pwd: pwd,
							type: 1
						},
						success: (res) => {
							if (res.data.code == 1 || res.data.code == 0) {
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									icon: 'none'
								})
							}else {
								uni.showToast({
									title: '系统故障，请稍后重试！',
									icon: 'none'
								})
							}
						}
					})
				}
				
			},
			// 加密方法
			encryption (user_name, password, email, code, timestamp) {
				let oriStr = code + email + password + timestamp + user_name
				let oriArr = oriStr.split('')
				let sonStr = ''
				let timeArr = String(timestamp).split('')
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriStr[timeArr[i]]
				}
				let resStr = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(resStr)
			},
			// 表单提交
			submit (e) {
				let error = []
				const formValue = e.detail.value
				// 用户名格式
				let usernameRule = /^[a-zA-Z0-9]{6,10}$/
				if (!usernameRule.test(formValue.username)) {
					uni.showToast({
						title: '用户名不符合规范',
						icon: 'none'
					})
					error.push('error')
				}
				// 两次密码不一致
				if (formValue.password !== formValue.passwords) {
					uni.showToast({
						title: '请保证密码一致',
						icon: 'none'
					})
					error.push('error')
				}
				// 邮箱格式
				let emailRule = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				if (!emailRule.test(formValue.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					})
					error.push('error')
				}
				// 表单有为空
				let i
				for (i in formValue) {
					if (formValue[i] == '') {
						uni.showToast({
							title: '请填写完整信息',
							icon: 'none'
						})
						error.push('error')
						break
					}
				}
				// 最终提交
				if (!error[0]) {
					let user_name = formValue.username
					let password = formValue.password
					let email = formValue.email
					let code = formValue.verify
					let timestamp = Date.parse(new Date()) / 1000
					let pwd = this.encryption(user_name, password, email, code, timestamp)
					uni.request({
						url: this.$http + 'user/register',
						method: 'POST',
						data: {
							pwd,
							user_name,
							password,
							email,
							code,
							timestamp
						},
						success: (res) => {
							if (res.data.code == 17) {
								uni.showToast({
									title: '注册成功',
									icon: 'none'
								})
								uni.navigateTo({
									url: './login'
								})
							}else {
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									icon: 'none'
								})
							}
						}
					})
				}
				
			}
		}
	}
</script>

<style>
	page {
		height: 95%;
	}
	.login-page {
		width: 750rpx;
		height: 100%;
		background-image: linear-gradient(#e9defa,#fbfcdb);
		padding-top: 40px;
	}
	.login-page h2 {
		width: 130px;
		margin: 50px auto;
		color: #1b1b1b;
	}
	.form-wrapper {
		width: 650rpx;
		height: 400px;
		background-color: #fff;
		border-radius: 10px;
		margin: 0 auto;
		padding-top: 50px;
	}
	.form-wrapper::before, .form-wrapper::after {
		content: '';
		display: block;
		width: 100%;
	}
	.header {
		width: 100%;
		text-align: center;
		margin-bottom: 20px;
	}
	.form-wrapper .input-wrapper {
		width: 200px;
		margin: 0 auto;
	}
	.form-wrapper input {
		width: 100%;
		height: 30px;
		margin-bottom: 10px;
		border-bottom: 2px solid #ccc;
	}
	.form-wrapper button {
		width: 200px;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
		margin-top: 20px;
		background-image: linear-gradient(#dddee2,#c9ccd3);
		color: #000;
	}
	.form-wrapper .link {
		width: 150px;
		display: block;
		margin: 15px auto;
		font-size: 14px;
		color: #ccc;
		text-decoration: underline;
	}
	.phc {
		font-size: 12px;
		line-height: 30px;
	}
	.form-wrapper .getpass {
		font-size: 12px;
		width: 78px;
		height: 30px;
		line-height: 30px;
		padding: 0;
		border: 1px solid #ccc;
		text-align: center;
		color: #5f5f5f;
		margin: 0;
		margin-bottom: 5px;
		border-radius: 5px;
	}
</style>
