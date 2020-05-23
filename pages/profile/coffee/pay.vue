<template>
	<view class="pay">
		<view class="form">
			<view class="pay-wrapper">
				<label class="title">金额</label>
				<view class="flex">
					<text class="header">￥</text>
					<input type="number" v-model="pay" placeholder="输入金额" />
				</view>
			</view>
			<radio-group name="type" class="pay-type" @change="radioChange">
				<label>
					<view class="wrapper">
						<view><image src="../../../static/iconimg/zhifubao.png" mode="scaleToFill">
						</image><text>支付宝支付</text></view>
						<radio value="alipay" />
					</view>
					<view class="wrapper">
						<view><image src="../../../static/iconimg/qqpay.png" mode="scaleToFill">
						</image><text>QQ支付</text></view>
						<radio value="qqpay" />
					</view>
				</label>
			</radio-group>
			<label class="title">留言</label>
			<textarea v-model="message" placeholder="对他们说的话..." />
			<button type="default" :disabled="!disabled" :class="{disabled: !disabled}" @click="submit">赞助</button>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				pay: '',
				method: '',
				message: ''
			}
		},
		computed: {
			disabled () {
				return Boolean(this.pay)
			}
		},
		methods: {
			radioChange (e) {
				this.method = e.target.value
			},
			submit () {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				let timestamp = Date.parse(new Date()) / 1000
				let method = this.method
				let name = 'pay'
				let money = this.pay
				let msg = this.message || '感谢'
				let pwd = this.enecrption(method, money, name, timestamp, user_name)
				uni.request({
					url: this.$http + 'user/reward/reward',
					method: 'POST',
					header: {
						token
					},
					data: {
						user_name,
						timestamp,
						pwd,
						method,
						name,
						money,
						msg
					},
					success: (res) => {
						if (res.data.code == 1) {
							let url = res.data.pay_url
							let trade_no = res.data.trade_no
							uni.navigateTo({
								url: './paycode?url=' + url + '&trade_no=' + trade_no
							})
						}else {
							console.log(res.data)
							uni.showToast({
								title: '订单创建失败，请稍后再试',
								icon: 'none'
							})
						}
					}
				})
			},
			// 加密
			enecrption (method, money, name, timestamp, user_name) {
				let oriStr = method + money + name + timestamp + user_name
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
	.pay {
		font-family: sans-serif;
	}
	.form {
		padding: 25px;
		padding-bottom: 60px;
		position: relative;
	}
	.title {
		font-size: 12px;
	}
	.flex {
		display: flex;
	}
	.pay-wrapper {
		margin-bottom: 15px;
	}
	.pay-wrapper .header {
		font-size: 22px;
		font-weight: bolder;
	}
	.pay-wrapper input {
		border-bottom: 2px solid #eee;
	}
	.form textarea {
		font-size: 16px;
		border: 2px solid #eee;
		border-radius: 5px;
	}
	.form button {
		width: 100px;
		height: 40px;
		line-height: 40px;
		border: 5px;
		background-color: rgb(6, 186, 90);
		color: #fff;
		position: absolute;
		right: 42px;
		bottom: 10px;
	}
	.form .disabled {
		color: #eee;
	}
	/* 支付方式 */
	.pay-type .wrapper {
		height: 50px;
		line-height: 40px;
		font-size: 16px;
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
		padding-right: 30px;
		margin-bottom: 5px;
		box-sizing: content-box;
		border-bottom: 1px solid #eee;
	}
	.pay-type .wrapper image {
		width: 25px;
		height: 25px;
		margin: 7px;
		vertical-align: middle;
	}
	.pay-type .wrapper text {
		vertical-align: middle;
	}
</style>
