<template>
	<view class="coffee">
		<view class="desc">
			<h2>赞助FastSign</h2>
			<p>赞助是对我们的一种赞赏和支持，一个默默付出的手艺人需要你们请喝杯咖啡，希望你能成为其中之一</p>
			<image src="../../../static/img/coffee-bg.png" mode="scaleToFill"></image>
		</view>
		<button type="default" @click="toPay">请他们喝咖啡</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img: '../../../static/img/pay.jpg',
			}
		},
		methods: {
			toPay () {
				uni.navigateTo({
					url: './pay'
				})
			}
			}
	}
</script>

<style scoped>
	page {
		font-size: 15px;
		background-color: rgb(245,245,245);
	}
	.desc {
		height: 380px;
		text-align: center;
	}
	.desc h2 {
		letter-spacing: .2em;
		color: rgb(251,104,13);
		margin: 10px 0;
	}
	.desc p {
		text-indent: 5px;
	}
	.coffee button {
		width: 200px;
		height: 50px;
		border-radius: 5px;
		background-color: rgb(251,104,13);
		color: #fff;
		line-height: 50px;
		margin: 0 auto;
	}
	
</style>
