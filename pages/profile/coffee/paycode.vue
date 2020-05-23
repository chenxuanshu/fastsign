<template>
	<view class="pay-code">
		<view class="wrapper">
			<tki-qrcode :val="val" :background="background" :foreground="foreground" :pdground="pdground"
			:size="400" :onval="true" :loadMake="true" @result="getResult" ref="code" class="code" />
		</view>
		<button type="default" @click="saveCode">保存到图库扫码</button>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import md5 from 'js-md5'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				background: '#b4e9e2',
				foreground: '#309286',
				pdground: '#32dbc6',
				val: '',
				trade_no: '',
				clock: true
				
			}
		},
		onLoad(pams) {
			this.val = pams.url
			this.trade_no = pams.trade_no
			
		},
		methods: {
			getResult (result) {
			},
			saveCode () {
				this.$refs.code._saveCode()
				let count = 0
				setInterval(()=> {
					if (this.clock && count < 10) {
						this.callback()
					}
					count += 1
				}, 3000)
			},
			callback () {
				let timestamp = Date.parse(new Date()) / 1000
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				let trade_no = this.trade_no
				let pwd = this.enecrption(timestamp, trade_no, user_name)
				uni.request({
					url: this.$http + 'user/reward/refer',
					method: 'POST',
					header: {token},
					data: {
						timestamp,
						pwd,
						user_name,
						trade_no
					},
					success: (res) => {
						if (res.data.code == 1) {
							console.log('ok')
							uni.showModal({
								title: '感谢支持',
								content: '你的支持是我们前进的动力',
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										uni.switchTab({
											url: '../../service/service'
										})
									}
								}
							})
							this.clock = false
						}
					}
				})
				
			},
			enecrption (timestamp, trade_no, user_name) {
				let oriStr = timestamp + trade_no + user_name
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
	.pay-code {
		background-color: rgba(60, 156, 48);
		padding: 20px 0;
	}
	.wrapper {
		width: 250px;
		height: 250px;
		border-radius: 5px;
		margin: 30px auto;
		padding-top: 10px;
		background-color: #fff;
	}
	.wrapper .code {
		margin: 25px;
	}
	.pay-code button {
		width: 200px;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
		background-color: #fff;
		color: green;
	}

</style>
