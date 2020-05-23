<template>
	<view class="profile">
		<view class="header-card" @click="toProDetail(profileInfo.id)"> 
			<view class="avatar">
				<image :src="profileInfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="profile-info">
				<text class="name">{{profileInfo.username}}</text>
				<text class="email">{{profileInfo.email}}</text>
			</view>
			<view class="arrow-right">
				<image src="../../static/iconimg/arrow_right.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="profile-ad">
			<image :src="showImg" mode="aspectFill"></image>
		</view>
		<view class="service-info">
			<view class="account" @click="toAccount(profileInfo.id)">
				<i class="fa fa-id-card" aria-hidden="true"></i>账号绑定
				<image src="../../static/iconimg/arrow_right2.png" mode="scaleToFill"></image>
			</view>
			<view class="connect" @click="toConnect">
				<i class="fa fa-phone" aria-hidden="true"></i>联系我们
				<image src="../../static/iconimg/arrow_right2.png" mode="scaleToFill"></image>
			</view>
			<view class="coffee" @click="toCoffee">
				<i class="fa fa-coffee" aria-hidden="true"></i>请喝咖啡
				<image src="../../static/iconimg/arrow_right2.png" mode="scaleToFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				profileInfo: this.$store.state.profileInfo,
				showImg : ''
			}
		},
		onLoad() {
			this._getShowImg()
			this._getProInfo()
		},
		onShow() {
			this._getProInfo()
		},
		methods: {
			toProDetail (id) {
				uni.navigateTo({
					url: './profileDetail/proDetail'
				})
			},
			toAccount (id) {
				uni.navigateTo({
					url: '../service/sign/signAccount'
				})
			},
			toConnect () {
				uni.navigateTo({
					url: './connectus/connectus'
				})
			},
			toCoffee () {
				uni.navigateTo({
					url: './coffee/coffee'
				})
			},
			_getAvatar () {
				let create_time = String(this.$store.state.profileInfo.create_time)
				uni.getStorage({
					key: create_time,
					success: (res) => {
						if (res.data) {
							this.$store.commit('saveAvatar', res.data)
						}else {
							this.$store.commit('saveAvatar', '../../static/img/user_avatar.png')
						}
					}
				})
			},
			_getShowImg () {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				uni.request({
					url: this.$http + 'user/slideimg',
					method: 'POST',
					header: {token},
					data: {
						user_name
					},
					success: (res) => {
						let url = res.data.slideimg.img_url.replace(/\\/g, '/')
						this.showImg = this.$http + url
					}
				})
			},
			_getProInfo () {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				let timestamp = Date.parse(new Date()) / 1000
				let pwd = this.enecrption(timestamp, user_name)
				uni.request({
					url: this.$http + 'user/info',
					method: 'POST',
					header: {token},
					data: {
						user_name,
						timestamp,
						pwd
					},
					success: (res) => {
						// console.log(res.data)
						let user_name = res.data.data.user_name || ''
						let email = res.data.data.email || ''
						let create_time = res.data.data.create_time || ''
						let status = res.data.data.status || ''
						this.$store.commit('saveEmail', email)
						this.$store.commit('saveTime', create_time)
						this.$store.commit('saveStatus', status)
						this._getAvatar()
					}
				})
			},
			// 加密
			enecrption (timestamp, user_name) {
				let oriStr = timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0;i < timeArr.length; i++) {
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
		height: 100%;
	}
	.profile {
		height: 100%;
		background-color: #eee;
	}
	.header-card {
		height: 90px;
		background-image: linear-gradient(to right,#7f7fd5,#86a8e7,#91eae4);
		color: #fff;
		padding: 70px 0 0 10px;
		position: relative;
	}
	.header-card .avatar {
		display: inline-block;
		width: 60px;
		height: 60px;
		border-radius: 5px;
		overflow: hidden;
		vertical-align: middle;
		margin-right: 10px;
	}
	.header-card image {
		width: 100%;
		height: 100%;
	}
	.header-card .profile-info {
		vertical-align: middle;
		display: inline-block;
	}
	.header-card .name {
		font-size: 18px;
		display: block;
		margin-bottom: 5px;
	}
	.header-card .email {
		font-size: 14px;
		display: block;
	}
	.header-card .arrow-right {
		width: 30px;
		height: 30px;
		position: absolute;
		right: 10px;
		top: 60%;
	}
	.header-card .arrow-right image {
		width: 100%;
		height: 100%;
	}
	/* 下部功能*/
	.service-info view {
		display: flex;
		font-size: 16px;
		height: 45px;
		line-height: 45px;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		position: relative;
		color: #000;
	}
	.service-info i {
		font-size: 14px;
		line-height: 45px;
		margin: 0 10px;
		width: 15px;
	}
	.service-info view image {
		width: 30px;
		height: 30px;
		position: absolute;
		right: 0px;
		top: 15%;
	}
	/* 功能分类各自相关样式 */
	.service-info view:first-child {
		border-top: 1px solid #eee;
	}
	.service-info .course i {
		color: gray;
	}
	.service-info .connect i {
		color: #000000;
	}
	.service-info .coffee i {
		color: red;
	}
	.service-info .account i {
		color: #00aa00;
	}
	/* 中间广告 */
	.profile-ad {
		width: 730rpx;
		height: 80px;
		margin: 5px auto;
		border-radius: 5px;
		overflow: hidden;
		background-color: #fff;
	}
	.profile-ad image {
		width: 100%;
		height: 100%;
	}
</style>
