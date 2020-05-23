<template>
	<view class="message-detail">
		<uni-nav-bar left-icon="back" title="消息" @clickLeft="back" class="navbar">
			<view class="icon-wrapper" slot="right" @click="del">
				<i class="fa fa-trash-o" aria-hidden="true"></i>
			</view>
		</uni-nav-bar>
		<text class="time">{{message.sign_time | timeTurn}}</text>
		<text class="type">{{message.type | typeTurn}}</text>
		<view class="content">
			<text>{{message.content}}</text>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import md5 from 'js-md5'
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				messages: [],
				index: ''
			}
		},
		computed: {
			message () {
				return this.messages[this.index] || {}
			}
		},
		onLoad(pams) {
			this.index = pams.index
			this._getMessage()
		},
		methods: {
			back () {
				uni.navigateBack({
				})
			},
			del () {
				uni.showModal({
					content: '确定删除这条消息吗？',
					success: (res) => {
						if (res.confirm) {
							let user_name = this.$store.state.profileInfo.username
							let token = this.$store.state.token
							let timestamp = Date.parse(new Date()) / 1000
							let num = ''
							let arr = []
							num += this.messages[this.index].id
							arr.push(this.messages[this.index].id)
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
						}
					}
				})
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
							this.messages = res.data && res.data.log
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
			},
			typeTurn (type) {
				switch (type) {
					case 1: return '学习通';break
					default: return '学习通';
				}
			}
		}
	}
</script>

<style scoped>
	.message-detail .navbar {
		padding-top: 35px;
	}
	.message-detail .time {
		display: block;
		width: 80px;
		font-size: 14px;
		color: #999999;
		margin: 5px auto;
		text-align: center;
	}
	.message-detail .content {
		text-indent: .5em;
	}
	.message-detail .type {
		display: block;
		width: 80px;
		font-size: 14px;
		color: #999999;
		margin: 5px auto;
		text-align: center;
	}
	.message-detail .icon-wrapper {
		padding-right: 15px;
		font-size: 20px;
	}

</style>
