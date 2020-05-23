<template>
	<view class="change-password">
		<input type="text" placeholder="请输入原密码" v-model="oriPassword" ref="oriPassword" @input="input"/>
		<input type="password" placeholder="请输入新密码" v-model="newPassword" ref="newPassword" @input="input"/>
		<input type="password" placeholder="请确认新密码" v-model="newPasswords" ref="newPasswords" @input="input"/>
		<button type="default" :disabled="disabled" @click="savePassword">保存</button>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				oriPassword: '',
				newPassword: '',
				newPasswords: '',
				disabled: true
			}
		},
		methods: {
			savePassword () {
				let old_password = this.oriPassword
				let password = this.newPassword
				let passwords = this.newPasswords
				if (old_password == password) {
					uni.showToast({
						title: '新密码和旧密码不能一致',
						icon: 'none'
					})
				}else if (password !== passwords) {
					uni.showToast({
						title: '请确认新密码一致',
						icon: 'none'
					})
				}else if (old_password && password && passwords) {
					let token = this.$store.state.token
					let user_name = this.$store.state.profileInfo.username
					let timestamp = Date.parse(new Date()) / 1000
					let pwd = this.ececrption(old_password,password,timestamp,user_name)
					uni.request({
						url: this.$http + 'user/changepassword',
						method: 'POST',
						header: {token},
						data: {
							old_password,
							user_name,
							password,
							timestamp,
							pwd
						},
						success: (res) => {
							if (res.data.code == 1) {
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									duration: 1000
								})
								setTimeout(() => {
									uni.showModal({
										title: '修改成功',
										content: '请重新登录',
										showCancel: false,
										success: (res) => {
											if (res.confirm) {
												uni.navigateTo({
													url: '../../login/login'
												})
											}
										}
									})
								}, 1000)
								
							}else if (res.data.code == 0) {
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
			input () {
				this.disabled = !(this.oriPassword && this.newPassword && this.newPasswords)
			},
			// 加密
			ececrption (old_password, password, timestamp, user_name) {
				let oriStr = String(old_password) + password + timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			}
		}
	}
</script>

<style scoped>
	.change-password input {
		height: 40px;
		padding-left: 10px;
		border-bottom: 2px solid #eee;
	}
	.change-password button {
		width: 150px;
		height: 40px;
		line-height: 40px;
		margin: 10px auto;
	}

</style>
