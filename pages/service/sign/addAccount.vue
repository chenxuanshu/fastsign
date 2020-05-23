<template>
	<view class="add-account">
		<view class="tip">
			<text>
			Tip：你的位置和经纬度仅是为了位置签到使用，本平台承诺保密并绝不会用作他用，请放心添加！
			不添加也是不影响签到的哦
			</text>
		</view>
		<form @submit="submit">
			<input type="text" name="uname" v-model="account" placeholder="学习通账号"/>
			<input type="text" name="password" v-model="password" password placeholder="学习通密码"/>
			<input type="text" name="address" v-model="address" placeholder="地址:如中国或火星(可不填)"/>
			<input type="text" name="latitude" v-model="latitude" placeholder="位置纬度(可不填)" />
			<input type="text" name="longitude" v-model="longitude" placeholder="位置经度(可不填)"/>
			<button form-type="submit">Submit</button>
		</form>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				account: '',
				password: '',
				address:'',
				latitude: '',
				longitude: ''
			}
		},
		methods: {
		submit(e) {
			const formValue = e.detail.value
			let user_name = this.$store.state.profileInfo.username
			let token = this.$store.state.token
			let uname = formValue.uname
			let password = formValue.password
			let address = formValue.address || 'China'
			let latitude = formValue.latitude || 0
			let longitude = formValue.longitude || 0
			let timestamp = Date.parse(new Date()) / 1000
			let pwd = this.encryption(latitude, longitude, password, timestamp, uname, user_name)
			if (uname && password) {
				uni.request({
					url: this.$http + 'user/xxt/adduser',
					method: 'POST',
					header: {
						token
					},
					data: {
						address,
						latitude,
						longitude,
						password,
						timestamp,
						uname,
						user_name,
						pwd
					},
					success: (res) => {
						if (res.data.code == 0) {
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								icon: 'none',
								duration: 1500
							})
						}else if(res.data.code == 1){
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								duration: 1500
							})
							setTimeout(() => {
								uni.navigateBack({
								})
							}, 1500)
						}else {
							uni.showToast({
								title: '系统发生故障，请稍后重试',
								icon: 'none'
							})
						}
					},
					fail: (res) => {
					}
				})
			}else {
				uni.showToast({
					title: '请填写账号密码',
					icon: 'none'
				})
			}
		},
		// 加密
		encryption (latitude, longitude, password, timestamp, uname, user_name) {
			let oriStr = String(latitude) + longitude + password + timestamp + uname + user_name
			let timeArr = String(timestamp).split('')
			let oriArr = oriStr.split('')
			let sonStr = ''
			for (let i = 0; i < timeArr.length; i++) {
				sonStr += oriArr[timeArr[i]]
			}
			let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
			let result = md5(res)
			return result
		}
		}
	}
</script>

<style scoped>
	.add-account .tip {
		font-size: 14px;
		border-bottom: 1px solid #eee;
	}
	.add-account form input {
		height: 40px;
		border-bottom: 2px solid #eee;
		padding: 0 5px;
	}
	.add-account button {
		width: 100px;
		height: 40px;
		line-height: 40px;
		margin: 5px auto;
	}

</style>
