<template>
	<view class="service">
		<uni-nav-bar class="navbar">
			<view slot="left" class="left">
				<text>服务</text>
			</view>
			<view class="bell-wrapper" slot="right" @click="toMessage">
				<i class="fa fa-bell-o bell" aria-hidden="true" v-if="true"></i>
				<i class="fa fa-bell bell" aria-hidden="true" v-else></i>
			</view>
		</uni-nav-bar>
		<ul class="nav">
			<li @click="tosign">
				<view class="img-wrapper">
					<image src="../../static/img/logo2.png" mode="scaleToFill"></image>
				</view>
				<text>快签</text>
			</li>
			<li class="code" @click="toCode">
				<view class="img-wrapper">
					<image src="../../static/img/timg3.png" mode="scaleToFill"></image>
				</view>
				<text>二维码生成器</text>
			</li>
			<li class="wangyi" @click="toWangyi">
				<view class="img-wrapper">
					<image src="../../static/img/timg2.jpg" mode="scaleToFill"></image>
				</view>
				<text>获取网易云热评</text>
			</li>
			<li class="douyin" @click="toDouyin">
				<view class="img-wrapper">
					<image src="../../static/img/timg.jpg" mode="scaleToFill"></image>
				</view>
				<text>抖音去除水印</text>
			</li>
		</ul>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components: {
			uniNavBar
		},
		data () {
			return {
				messages: this.$store.state.messages
			}
		},
		computed: {
			// 铃铛状态
			bellActive () {
				return this.messages.every((item) => {
					return item.state == 0 || item.state == undefined
				})
			}
		},
		methods: {
			// 跳转消息页
			toMessage () {
				uni.navigateTo({
					url: './message/message'
				})
			},
			tosign () {
				uni.navigateTo({
					url: './sign/signAccount'
				})
			},
			toCode () {
				uni.navigateTo({
					url: './code/code'
				})
			},
			toWangyi () {
				uni.navigateTo({
					url: '../holder/holder'
				})
			},
			toDouyin () {
				uni.navigateTo({
					url: '../holder/holder'
				})
			}
			
			
		}
	}
	
</script>

<style scoped>
	* {
		padding: 0;
		margin: 0;
	}
	/* 导航栏 */
	.service .navbar {
		padding-top: 35px;
	}
	.service .navbar .left {
		margin-left: 10px;
	}
	.service .bell-wrapper .bell {
		font-size: 18px;
		color: rgb(133,144,166);
		margin-right: 15px;
	}
	/* 导航 */
	.service .nav {
		width: 100%;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.nav li {
		width: 48%;
		height: 100px;
		border: 1px solid #eee;
		border-radius: 5px;
		overflow: hidden;
		margin: 5px 0;
		padding-bottom: 5px;
	}
	.nav li .img-wrapper {
		width: 100%;
		height: 80%;
	}
	/* 二维码 */
	.nav .code {
		display: flex;
	}
	.nav .code .img-wrapper {
		width: 42%;
		height: 80%;
		padding: 5px 0 0 5px;
		border-radius: 5px;
		overflow: hidden;
	}
	/* 网易云 */
	.nav .wangyi .img-wrapper {
		width: 42%;
		height: 80%;
		padding: 5px 0 0 5px;
		border-radius: 12px;
		overflow: hidden;
	}
	.nav .wangyi, .nav .douyin {
		display: flex;
		height: 85px;
	}
	/* 抖音 */
	.nav .douyin .img-wrapper {
		width: 42%;
		height: 80%;
		padding: 5px 0 0 5px;
		border-radius: 5px;
		overflow: hidden;
	}
	
	.nav li image {
		width: 100%;
		height: 100%;
	}
	.nav li text {
		font-size: 14px;
		padding: 5px;
		font-weight: bold;
		color: #8f8f8f;
	}
</style>