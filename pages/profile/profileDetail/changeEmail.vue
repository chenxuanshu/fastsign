<template>
	<view class="change-email">
		<input type="text" :value="modelData.email" />
		<view class="email-wrapper">
			<input type="email" placeholder="请输入新邮箱" v-model="newEmail"/>
			<button type="default" @click="checkEmail">
				<text v-if="!countDown">获取验证码</text>
				<uni-countdown v-else :second="300" :show-day="false" class="count-down" ></uni-countdown>
			</button>
		</view>
		<input type="text" placeholder="请填写验证码" v-model="testNumInput" @input="input" />
		<button type="default" class="save" @click="save" :disabled="disabled">确认</button>
	</view>
</template>

<script>
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	import md5 from 'js-md5'
	export default {
		components: {
			uniCountdown
		},
		data() {
			return {
				modelData: this.$store.state.profileInfo,
				newEmail: '',
				testNumInput: '',
				testNum: '',
				disabled: true,
				countDown: false
			}
		},
		methods: {
			// 检验邮箱格式,发邮件
			checkEmail () {
				const emailType = new RegExp('[\\w]+(\\.[\\w]+)*@[\\w]+(\\.[\\w])+')
				let oldEmail = this.$store.state.profileInfo.email
				let newEmail = this.newEmail
				let result = emailType.test(newEmail)
				if (!result) {
					uni.showToast({
						title: '请输入有效的邮箱',
						icon: 'none'
					})
				} else if (oldEmail == newEmail) {
					uni.showToast({
						title: '请输入新邮箱',
						icon: 'none'
					})
				}else {
					let timestamp = Date.parse(new Date()) / 1000
					let pwd = this.enecrption(newEmail, timestamp)
					let type = 2
					uni.request({
						url: this.$http + 'user/send',
						method: 'POST',
						data: {email: newEmail, timestamp, pwd, type},
						success: (res) => {
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}
					})
					this.countDown = true
					setTimeout(() => {
						this.countDown = false
					}, 300000)
				}
			},
			// 解除按钮禁用
			input () {
				this.disabled = false
			},
			//提交修改邮箱
			save () {
				let email = this.newEmail
				let timestamp = Date.parse(new Date())
				let code = this.testNumInput
				let user_name = this.$store.state.profileInfo.username
				let token = this.$store.state.token
				let pwd = this.enecrption_sec(code, email, timestamp, user_name)
				uni.request({
					url: this.$http + 'user/changeemail',
					method: 'POST',
					header:{token},
					data:{
						code,
						pwd,
						email,
						timestamp,
						user_name
					},
					success: (res) => {
						if (res.data.code == 1) {
							let msg = res.data.msg
							uni.showToast({
								title: msg
							})
							this.$store.commit('saveEmail', email)
							setTimeout(() => {
								uni.navigateBack({
								})
							}, 1500)
						}else if (res.data.code == 0 || res.data.code == 16 || res.data.code == 15) {
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
			},
			// 加密
			enecrption (email, timestamp) {
				let oriStr = email + timestamp
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			},
			enecrption_sec (code, email, timestamp, user_name) {
				let oriStr = code + email + timestamp +user_name
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
	.change-email input {
		height: 40px;
		border-bottom: 2px solid #eee;
		padding-left: 5px;
	}
	/* 中间获取验证码的样式 */
	.change-email .email-wrapper {
		display: flex;
		height: 40px;
		padding-right: 5px;
	}
	.change-email .email-wrapper input {
		flex-grow: 1;
	}
	.change-email .email-wrapper button {
		width: 90px;
		font-size: 12px;
		height: 40px;
		line-height: 40px;
	}
	.email-wrapper .count-down {
		padding-top: 5px;
	}
	
	/*  */
	.change-email .save {
		width: 150px;
		height: 40px;
		line-height: 40px;
		margin: 5px auto;
		border-radius: 5px;
		overflow: hidden;
	}
</style>
