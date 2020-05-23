<template>
	<view class="holder">
		<view class="wrapper">
			<text class="title">功能正在加速研发中，敬请期待！</text><br>
			<view class="ul-wrapper">
				<text>你可以选择：</text>
				<ul>
					<li><navigator url="../profile/coffee/coffee">赞助我们，成为赞助者，为FastSign团队助力！</navigator></li>
					<li><navigator url="../profile/connectus/connectus">联系我们，申请加入，成为FastSign的一员！</navigator></li>
				</ul>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 16px;
	}
	.holder {
		padding: 10px;
	}
	.holder .wrapper {
		text-align: center;
		padding-top: 80px;
	}
	.wrapper .title {
		font-size: 20px;
	}
	.wrapper .ul-wrapper {
		text-align: left;
		margin-top: 20px;
	}
	.ul-wrapper li {
		text-decoration: underline;
		text-indent: 1em;
		margin: 5px 0;
	}
</style>
