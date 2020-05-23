<template>
	<view class="find-password">
		<form @submit="submit">
			<input type="text" v-model="user_name" placeholder="请准确填写用户名"/>
			<button form-type="submit">提交</button>
		</form>
		
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				user_name: ''
			}
		},
		methods: {
			submit () {
				if (this.user_name) {
					let user_name = this.user_name
					let timestamp = Date.parse(new Date()) / 1000
					let pwd = this.enecrption(timestamp, user_name)
					uni.request({
						url: this.$http + 'user/findpassword',
						method: 'POST',
						data: {
							user_name,
							timestamp,
							pwd
						},
						success: (res) => {
							if (res.data.code == 0) {
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									icon: 'none'
								})
							}else if (res.data.code == 1){
								let msg = res.data.msg
								uni.showToast({
									title: msg,
									icon: 'none'
								})
								setTimeout(() => {
									uni.navigateBack({
									})
								}, 1500)
							}else {
								uni.showToast({
									title: '系统故障，请稍后重试！',
									icon: 'none'
								})
							}
						}
						
						
					})
				}else {
					uni.showToast({
						title: '请填写用户名',
						icon: 'none'
					})
				}
				
			},
			enecrption (timestamp, user_name) {
				let oriStr = timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriStr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			}
			
		}
	}
</script>

<style scoped>
	.find-password input {
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #eee;
	}
	.find-password button {
		width: 200px;
		height: 40px;
		line-height: 40px;
		margin: 45px auto;
	}

</style>
