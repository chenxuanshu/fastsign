<template>
	<view class="login-page">
		<h2>FastSign</h2>
		<view class="form-wrapper">
			<form @submit="submit">
				<view class="header">
					<text>欢迎登录</text>
				</view>
				<view class="input-wrapper">
				<input type="text" placeholder="Username"
				confirm-type="next" placeholder-class="phc" name="user_name"/>
				<input type="text" placeholder="Password" password
				confirm-type="send" name="password"
				placeholder-class="phc"/>
				</view>
				<button form-type="submit">登录</button>
			</form>
			<navigator url="./register" open-type="redirect" class="link" hover-class="none">没有账号？点击创建</navigator>
			<navigator url="./findPassword" open-type="navigate" class="link" hover-class="none">忘记密码？找回密码</navigator>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
			}
		},
		methods: {
			submit (e) {
				const formValue = e.detail.value
				let i
				for (i in formValue) {
					if (formValue[i] == '') {
						uni.showToast({
							title: '请填写账号密码',
							icon: 'none'
						})
						break
					}
				}
				if (formValue['user_name'] && formValue['password']) {
					let timestamp = Date.parse(new Date()) / 1000
					let user_name = formValue.user_name
					let password = formValue.password
					let pwd = this.encryption(user_name, password, timestamp)
					uni.request({
						url: this.$http + 'user/login',
						method: 'POST',
						data: {
							user_name,
							timestamp,
							pwd
						},
						success: (res) => {
							if (res.data.code == 13) {
								// ** 保存token
								this.$store.commit('saveToken', res.data.token)
								// ** 保存用户名
								this.$store.commit('username', user_name)
								// 存储信息到本地
								uni.setStorage({
									key: 'user_name',
									data: user_name,
								})
								uni.setStorage({
									key: 'password',
									data: password,
								})
								uni.switchTab({
									url: '../index/index'
								})
								
							}else if (res.data.code == 11) {
								uni.showToast({
									title: '用户不存在',
									icon: 'none'
								})
							}else if (res.data.code == 12) {
								uni.showToast({
									title: '密码错误',
									icon: 'none'
								})
							}else {
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									icon: 'none'
								})
							}
						},
						fail(res) {
							uni.showToast({
								title: '系统故障，请稍后重试！',
								icon: 'none'
							})
						}
					})
					
				}
				
			},
			// 加密
			encryption (user_name, password, timestamp) {
				let oristr = password + timestamp + user_name
				let oriArr = oristr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let resStr = oristr.slice(10) + oristr + sonStr + this.$adder
				let result = md5(resStr)
				return result
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
		padding-top: 40px;
		background-image: linear-gradient(#e9defa,#fbfcdb);
	}
	.login-page h2 {
		width: 130px;
		margin: 50px auto;
		color: #1b1b1b;
		text-align: center;
	}
	.form-wrapper {
		width: 650rpx;
		height: 300px;
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
		font-size: 14px;
		line-height: 30px;
	}
</style>
