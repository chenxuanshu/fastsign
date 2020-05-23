<template>
	<view class="message-wrapper">
		<uni-nav-bar title="消息" left-icon="back" @clickLeft="back" class="navbar">
		</uni-nav-bar>
		<view v-if="messages[0]">
		<view class="message" v-for="(item,index) in messages" @click="toMessageDetail(index)">
			<text class="writer">FastSign</text>
			<text class="time">{{item.sign_time | timeTurn}}</text>
			<text class="content">{{item.content}}</text>
		</view>
		</view>
		<view v-else>
			暂无消息
		</view>
		<view class="bin" @click="delAll">
			<image src="../../../static/iconimg/bin.png" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import md5 from 'js-md5'
	export default {
		components: { uniNavBar },
		data() {
			return {
				messages: []
			}
		},
		onLoad() {
			this._getMessage()
		},
		onShow() {
			this._getMessage()
		},
		methods: {
			back () {
				uni.navigateBack({
				})
			},
			toMessageDetail (index) {
				uni.navigateTo({
					url: './messageDetail?index=' + index
				})
			},
			delAll () {
				if (this.messages[0]) {
					uni.showModal({
						content: '确定要删除全部消息吗？',
						success: (res) => {
							if (res.confirm) {
								let user_name = this.$store.state.profileInfo.username
								let token = this.$store.state.token
								let timestamp = Date.parse(new Date()) / 1000
								let num = ''
								let arr = []
								for (let i in this.messages) {
									num += this.messages[i].id
									arr.push(this.messages[i].id)
								}
								let pwd = this.enecrption(num, timestamp, user_name)
								uni.request({
									url: this.$http + 'user/dellog',
									method: 'POST',
									header: {token},
									data: {
										user_name,
										arr,
										timestamp,
										num,
										pwd
									},
									success: (res) => {
										if (res.data.code == 1 || res.data.msg == 0) {
											let msg = res.data.msg
											uni.showToast({
												title: msg
											})
											this._getMessage()
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
				}else {
					uni.showToast({
						title: '已经被清空了',
						icon: 'none'
					})
				}
				
			},
		_getMessage () {
			let token = this.$store.state.token
			let user_name = this.$store.state.profileInfo.username
			uni.request({
				url: this.$http + 'user/signlog',
				method: 'POST',
				header: {
					token
				},
				data: {
					user_name
				},
				success: (res) => {
					if (res.data.code == 1) {
						this.messages = res.data.log
					}else if (res.data.code == 24) {
						let msg = res.data.msg
						uni.showToast({
							title: msg,
							icon: 'none'
						})
					}
				}
			})
		},
		enecrption (num, timestamp, user_name) {
			let oriStr = String(num) + timestamp + user_name
			let oriArr = oriStr.split('')
			let timeArr = String(timestamp).split('')
			let sonStr = ''
			for (let i = 0; i < timeArr.length; i++) {
				sonStr += oriArr[timeArr[i]]
			}
			let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
			return md5(res)
		}
		},
		filters: {
			timeTurn (time) {
				return new Date(time * 1000).toLocaleString()
			}
		}
	}
</script>

<style scoped>
	.message-wrapper {
		position: relative;
	}
	.message-wrapper .navbar {
		padding-top: 35px;
	}
	
	/* 消息 */
	.message {
		height: 60px;
		border-bottom: 2px solid #eee;
		padding: 5px;
		
	}
	.message .writer {
		font-size: 20px;
		margin-right: 10px;
	}
	.message .time {
		font-size: 12px;
		color: #8d8d8d;
		margin-right: 5px;
	}
	.message .content {
		display: block;
		width: 140px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 15px;
		margin-top: 10px;
	}
	/* 清空 */
	.message-wrapper .bin {
		width: 50px;
		height: 50px;
		border: 1px solid #eee;
		border-radius: 25px;
		overflow: hidden;
		position: fixed;
		z-index: 999;
		right: 10px;
		bottom: 15%;
		box-shadow: 2px 2px 2px #a3a3a3;
	}
	.message-wrapper image {
		width: 100%;
		height: 100%;
	}
</style>
