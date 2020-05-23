<template>
	<view class="edit-account">
		<view class="desc">
			<text>
				1.学习通平台账号修改密码后在此更新对应的密码
				2.地理位置和经纬度仅为了位置签到显示用，可自定义添加
			</text>
		</view>
		<form @submit="submit">
			<view class="name">
				<text>账号</text>
				<text>{{account.user_name}}</text>
			</view>
			<input type="text" v-model="password" name="password" password  placeholder="更新密码"/>
			<input type="text" v-model="address" name="address" placeholder="修改地理位置"/>
			<input type="text" v-model="longitude" name="longitude" placeholder="修改经度"/>
			<input type="text" v-model="latitude" name="latitude" placeholder="修改纬度"/>
			<button form-type="submit">确定</button>
		</form>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				xxt: [],
				index: '',
				password: '',
				address: '',
				longitude: '',
				latitude: ''
			}
		},
		computed: {
			account () {
				return this.xxt[this.index] || {}
			}
		},
		onLoad(pams) {
			this.index = pams.index
			this._getAccount()
		},
		methods: {
			_getAccount() {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				uni.request({
					url: this.$http + 'user/refer',
					method: 'POST',
					data: {
						user_name
					},
					header: {
						token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.xxt = res.data && res.data.data.xxt
						}
					}
				})
			},
			submit (e) {
				let study_id = this.account.id
				let user_name = this.$store.state.profileInfo.username
				let token = this.$store.state.token
				let timestamp = Date.parse(new Date()) / 1000
				let address = Boolean(this.address) ? this.address : this.account.address
				let longitude = Boolean(this.longitude) ? this.longitude : this.account.longitude
				let latitude = Boolean(this.latitude) ? this.latitude : this.account.latitude
				let password = this.password
				let pwd = this.enecrption(latitude, longitude, password, study_id, timestamp, user_name)
				console.log(study_id,user_name,password,timestamp,address,longitude,latitude,pwd)
				// console.log(address)
				uni.request({
					url: this.$http + 'user/xxt/edituser',
					method: 'POST',
					header: {
						token
					},
					data: {
						study_id,
						user_name,
						password,
						timestamp,
						address,
						longitude,
						latitude,
						pwd
					},
					success: (res) => {
						if (res.data.code == 1) {
							let msg = res.data.msg
							uni.showToast({
								title: msg
							})
							setTimeout(() => {
								uni.navigateBack({
								})
							}, 1500)
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
			},
			enecrption (latitude, longitude, password, study_id, timestamp, user_name) {
				let oriStr = String(latitude) + longitude + password + study_id + timestamp + user_name
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
	.edit-account {
		font-size: 16px;
	}
	.edit-account .desc {
		border-bottom: 1px solid #eee;
	}
	.edit-account input {
		height: 45px;
		line-height: 45px;
		padding: 0 10px;
		border-bottom: 1px solid #eee;
	}
	.name {
		height: 45px;
		line-height: 45px;
		padding: 0 10px;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
	}
	.edit-account button {
		width: 200px;
		height: 40px;
		line-height: 40px;
		margin: 5px auto;
	}

</style>
