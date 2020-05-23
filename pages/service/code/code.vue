<template>
	<view class="code">
		<view class="code-wrapper">
			<tki-qrcode ref="qrcode" :val="val" :size="size"
			:background="background" :foreground="foreground" :pdground="pdground"
			:icon="icon" :iconSize="iconsize" :onval="true" :loadMake="true" @result="qrR" class="code" />
		</view>
		<view class="input">
			<input type="text" v-model="val" placeholder="输入要生成的内容" />
		</view>
		<view class="size">
			调整大小
			<slider :value="size" @change="sliderchange" :min="50" :max="500" show-value />
		</view>
		<view class="btns">
			<button type="primary" @tap="selectIcon">选择二维码图标</button>
			<button type="primary" @tap="createCode">生成二维码</button>
			<button type="primary" @tap="saveCode">保存到图库</button>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				val: '', 
				size: 200,
				background: '#b4e9e2',
				foreground: '#309286',
				pdground: '#32dbc6',
				icon: '',
				iconsize: 40,
				src: ''
			}
		},
		methods: {
			sliderchange (e) {
				this.size = e.detail.value
			},
			createCode () {
				this.$refs.qrcode._makeCode()
			},
			saveCode () {
				this.$refs.qrcode._saveCode()
			},
			qrR(res) {
				this.src = res
			},
			selectIcon() {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function (res) {
						that.icon = res.tempFilePaths[0]
						setTimeout(() => {
							that.createCode()
						}, 100);
					}
				})
			}
		}
	}
</script>

<style scoped>
	.code-wrapper {
		width: 250px;
		height: 250px;
		border: 1px solid #eee;
		margin: 5px auto;
	}
	.code-wrapper .code {
		margin: 0 auto;
	}
	.input input {
		height: 40px;
		line-height: 40px;
		border-top: 2px solid #eee;
		border-bottom: 2px solid #eee;
	}
	.btns button {
		height: 40px;
		line-height: 40px;
		border-radius: 2px;
		overflow: hidden;
		margin: 5px;
	}

</style>
