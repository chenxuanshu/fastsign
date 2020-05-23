<template>
	<view class="notice">
		<view class="wrapper">
			<view class="item" v-for="(item, index) in notices">
				<text class="title">{{item.title}}</text>
				<text class="content">{{item.body}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				notices : []
			}
		},
		onLoad() {
			this._getNoticeInfo()
		},
		methods: {
			_getNoticeInfo () {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				uni.request({
					url: this.$http + 'user/getnotice',
					method: 'POST',
					data: {
						user_name
					},
					header: {
						token
					},
					success: (res) => {
						this.notices = res.data.data || []
					}
				})
			}
		}
	}
</script>

<style scoped>
	.notice {
		font-size: 16px;
	}
	.wrapper {
		width: 92%;
		border: 1px solid #eee;
		border-radius: 8px;
		margin: 5px auto;
		padding: 30px 5px;
		box-shadow: 3px 3px 3px #eee;
	}
	.item {
		width: 250px;
		border-bottom: 1px solid #eee;
		padding: 10px;
		margin: 10px auto;
		box-sizing: content-box;
		white-space: normal;
	}
	.item .title {
		font-size: 18px;
		font-weight: 400;
		display: block;
	}
	.item .content {
		display: block;
		color: #616161;
		white-space: inherit;
	}
</style>
