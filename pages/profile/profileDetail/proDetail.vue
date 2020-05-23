<template>
	<view class="pro-detail">
		<view class="avatar" @click="changeAvatar">
			<text>头像</text>
			<view>
				<image :src="modelData.avatar" mode="scaleToFill"></image>
				<image src="../../../static/iconimg/arrow_right2.png" mode="scaleToFill" class="side"></image>
			</view>
		</view>
		<view class="username">
			<text>用户名</text>
			<view>
				<text>{{modelData.username}}</text>
			</view>
		</view>
		<view class="email" @click="changeEmail">
			<text>邮箱</text>
			<view>
				<text>{{modelData.email}}</text>
				<image src="../../../static/iconimg/arrow_right2.png" mode="scaleToFill" class="side"></image>
			</view>
		</view>
		<view class="password" @click="changePassword">
			<text>修改密码</text>
			<image src="../../../static/iconimg/arrow_right2.png" mode="scaleToFill" class="side"></image>
		</view>
		<view class="exit" @click="exit">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				modelData: this.$store.state.profileInfo
			}
		},
		methods: {
			changeAvatar () {
				let create_time = String(this.$store.state.profileInfo.create_time)
				let that = this
				uni.chooseImage({
					count: 1,
					success: (res) => {
						let path = res.tempFilePaths
						uni.saveFile({
							tempFilePath: path[0],
							success: (res) => {
								let avartar = res.savedFilePath
								uni.setStorage({
									key: create_time,
									data: avartar,
									success() {
										that.$store.commit('saveAvatar', avartar)
									}
								})
							},
							fail() {
								uni.showToast({
									title: '头像更换失败',
									icon: 'none'
								})
							}
						})
						
					},
					fail() {
						uni.showToast({
							title: '头像更换失败',
							icon: 'none'
						})
					}
				})
			},
			changeEmail () {
				uni.navigateTo({
					url: './changeEmail'
				})
			},
			changePassword () {
				uni.navigateTo({
					url: './changePassword'
				})
			},
			exit () {
				uni.showModal({
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							let user_name = this.$store.state.profileInfo.username
							let token = this.$store.state.token
							let timestamp = Date.parse(new Date()) / 1000
							let pwd = this.enecrption(timestamp, user_name)
							uni.removeStorage({
								key: 'user_name',
								success() {
								}
							})
							uni.removeStorage({
								key: 'password',
								success() {
								}
							})
							uni.request({
								url: this.$http + 'user/logout',
								method: 'POST',
								header: {token},
								data: {
									user_name,
									timestamp,
									pwd
								},
								success: (res) => {
									if (res.data.code == 1) {
										let msg = res.data.msg
										uni.showToast({
											title: msg
										})
										setTimeout(() => {
											uni.navigateTo({
												url: '../../login/login'
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
						}
					}
				})
				
			},
			enecrption (timestamp, user_name) {
				let oriStr = timestamp + user_name
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
	page {
		background-color: #eee;
	}
	.pro-detail {
		font-size: 14px;
	}
	.avatar,.username,.email,.password,.exit {
		display: flex;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		justify-content: space-between;
		padding: 0 10px;
	}
	.avatar view,.username view,.email view,.password view {
		display: flex;
		
	}
	.avatar {
		height: 60px;
		line-height: 60px;
	}
	.avatar image {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		overflow: hidden;
		margin-top: 5px;
		vertical-align: middle;
	}
	.pro-detail .side {
		width: 30px;
		height: 30px;
		margin-left: 5px;
		margin-top: 10px;
	}
	.pro-detail .avatar .side {
		margin-top: 15px;
	}
	.exit {
		margin-top: 5px;
	}
</style>
