<template>
	<view class="connectus">
		<image src="../../../static/img/logo2.png" mode="scaleToFill"></image>
		<view class="desc">
			<text>FastSign（快签），你最好最快的签到助手！快签在手，签到无忧。</text><br/>
			<text>FastSign（快签），由OuterBin团队精心打造。只为了更好更高效的学习！</text>
		</view>
		<view class="author" v-for="(item) in author">
			<view class="author-info">
				<image :src="item.avatar" mode="scaleToFill" class="avatar"></image>
				<text class="name">{{item.name}}</text>
				<ul class="tags">
					<li v-for="(it) in item.tags">{{it}}</li>
				</ul>
			</view>
			<view class="connect">
				联系QQ: <text>{{item.email}}</text>
			</view>
		</view>
		<view class="footer">
			<!-- <view class="clause">
			<navigator url="">《FastSign服务使用协议》</navigator>和
			<navigator url="">《FastSign个人信息保护政策》</navigator>
			</view>
			2020 Copyright&trade;OuterBin
			</text> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				author: [{
					name: 'OuterBin',
					avatar: '../../../static/img/outerbin.png',
					email: '3182235786',
					tags: []
				}]
			}
		},
		methods: {
		}
	}
</script>

<style scoped>
	.connectus image {
		width: 100%;
		height: 130px;
		border-bottom: 1px solid #eee;
		box-shadow: 0 2px 2px #e6e6e6;
	}
	.connectus .desc {
		font-size: 15px;
		color: #757575;
		line-height: 18px;
		padding: 0 6px;
		letter-spacing: .1em;
	}
	.author {
		width: 100%;
		border-bottom: 1px solid #eee;
		border-top: 1px solid #eee;
		padding: 5px 0 0 5px;
	}
	.author .author-info {
		display: flex;
	}
	.author .avatar {
		width: 60px;
		height: 60px;
		border-radius: 5px;
		overflow: hidden;
		flex-shrink: 0;
	}
	.author .name {
		font-size: 20px;
		color: #585858;
		margin: 15px 0 0 5px;
	}
	.author .tags {
		padding-left: 10px;
	}
	.author .tags li {
		display: inline-block;
		margin: .5em;
		position: relative;
		padding: .25em .5em .25em .25em;
		background-color: #c9e1f4;
		color: #28448f;
		border-radius: 0 .25em .25em 0;
		line-height: 1.5;
		text-align: center;
		font-size: 14px;
	}
	.author .tags li::before {
		position: absolute;
		content: '';
		width: 0;
		height: 0;
		border: 1em solid transparent;
		border-right-width: .5em;
		border-right-color: #c9e1f4;
		left: -1.43em;
		top: 0;
	}
	.author .connect {
		margin-top: 10px;
		color: #5a5a5a;
	}
	.author .connect text {
		font-size: 15px;
		color: #646464;
		text-decoration: underline;
		padding-left: 10px;
	}
	.footer {
		padding-top: 15px;
		text-align: center;
		font-size: 11px;
		color: #a5a5a5;
	}
	.footer .clause {
		width: 300px;
		display: flex;
		margin: 0 auto;
	}
</style>
