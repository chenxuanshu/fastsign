<template>
	<view class="index">
		<swiper :indicator-dots="true" :autoplay="true" :interval="4000" :duration="1000">
			<swiper-item v-for="(item) in swiperImgs" class="swiper-item">
				<view>
					<image :src="item" mode="scaleToFill"></image>
				</view>
			</swiper-item>
		</swiper>
		<uni-notice-bar showIcon="true" :text="noticeText" single="true" :showGetMore="true" @click="toNotice"></uni-notice-bar>
		<view class="showdata-wrapper">
			<view class="show-item">
				<image src="../../static/showimgs/show03.png" mode="scaleToFill"></image>
				<view class="item">
					<text class="title">总签到</text>
					<text class="data">{{showData.all_sign}} 次</text>
				</view>
				<view class="item">
					<text class="title">总用户</text>
					<text class="data">{{showData.all_user}} 人</text>
				</view>
			</view>
			<view class="show-item">
				<image src="../../static/showimgs/show01.png" mode="scaleToFill"></image>
				<view class="item">
					<text class="title">今日已签</text>
					<text class="data">{{showData.today_sign}} 次</text>
				</view>
			</view>
			<view class="show-item">
				<image src="../../static/showimgs/show04.png" mode="scaleToFill"></image>
				<view class="item">
					<text class="title">时间 {{showData.hour}}:00 ~ {{Number(showData.hour) + 2}}:00</text>
					<text class="data">平台任务数 {{showData.now_load}} 条</text>
				</view>
			</view>
		</view>
		<!-- 时间轴 -->
		<timeline>
			<timeline-item v-for="(item, index) in timeData" :leftTime='item.time | timeTurn'>
				<view class="tripItem">
					<view class="title">{{item.title}}</view>
					<view class="tips">内容：{{item.content}}</view>
				</view>
			</timeline-item>
		</timeline>
		
		<!-- 软件更新 -->
		<update></update>
	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import timeline from '../../components/chenbin-timeline/timeLine.vue'
	import timelineItem from '../../components/chenbin-timeline/timelineItem.vue'
	import update from './update/update.vue'
	export default {
		components: {
			uniNoticeBar, timeline, timelineItem, update
		},
		data() {
			return {
				swiperImgs: [],
				notices: [],
				showData: { all_sign: 0, all_user: 0, hour:"10", now_load: 0, today_sign:0, all_course: 0},
				timeData: []
			}
		},
		computed: {
			noticeText () {
				return this.notices[0] ? this.notices[0].title + this.notices[0].body : ''
			}
		},
		onLoad() {
			this._getSwiperImgs()
			this._getNoticeInfo()
			this._getShowData()
			this._getTimeData()
		},
		methods: {
				_getSwiperImgs () {
					// 获取轮播图列表
					let token = this.$store.state.token
					let user_name = this.$store.state.profileInfo.username
					uni.request({
						method: 'POST',
						url: this.$http + 'user/roundimg',
						data: {
							user_name: user_name
						},
						header: {
							'token': token
						},
						success: (res) => {
							let resimg = []
							let roundimg = res.data.roundimg || []
							for (let i = 0; i<roundimg.length; i++) {
								resimg.push(('http://a.xmhome.top/' + roundimg[i].img_url).replace(/\\/g,'/'))
							}
							this.swiperImgs = resimg
						}
					})
				},
				// 获取公告navbar
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
				},
				// 请求展示数据
				_getShowData () {
					let token = this.$store.state.token
					let user_name = this.$store.state.profileInfo.username
					uni.request({
						url: this.$http + 'user/getdata',
						method: 'POST',
						data: {
							user_name
						},
						header: {
							token
						},
						success: (res) => {
							this.showData = res.data.data || {}
						}
					})
				},
			// 时间轴数据
			_getTimeData () {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				uni.request({
					url: this.$http + 'user/update/getdata',
					method: 'POST',
					header: {
						token
					},
					data: {
						user_name
					},
					success: (res) => {
						this.timeData = res.data.data
					}
					
				})
			},
			// 跳转公告页
			toNotice () {
				uni.navigateTo({
					url: './notice/notice'
				})
			}
		},
		onPullDownRefresh () {
			this._getSwiperImgs()
			this._getNoticeInfo()
			this._getShowData()
			this._getTimeData()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		filters: {
			timeTurn (time) {
				return new Date(time * 1000).toLocaleString()
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f4f4f4;
	}
	.index .navbar {
		padding-top: 35px;
		background-color: #fff;
	}
	/* 轮播图样式 */
	.swiper {
		width: 97%;
		height: 150px;
		margin: 5px auto;
		border-radius: 5px;
		overflow: hidden;
		margin-bottom: 10px;
	}
	.swiper-item {
		height: 100%;
	}
	.swiper-item image {
		width: 100%;
	}
	/* 展示数据样式 */
	.showdata-wrapper {
		width: 98%;
		margin: 0 auto;
	}
	.showdata-wrapper .show-item {
		display: flex;
		height: 60px;
		padding: 15px;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 8px;
		margin-bottom: 20px;
		box-shadow: 3px 3px 3px #bcbcbc;
	}
	.show-item .item {
		text-align: center;
		margin-left: 50px;
	}
	.showdata-wrapper image {
		width: 50px;
		height: 50px;
		margin-top: 15px;
	}
	.showdata-wrapper .title {
		display: block;
		font-size: 14px;
		color: #a6a6a6;
		margin-bottom: 20px;
	}
	/* 时间轴 */
	.tripItem {
		height: 140rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
		border-radius:10px;
		margin-bottom: 30rpx;
		}
	.tripItem .title {
		font-size:28rpx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
	}
	.tripItem .tips {
		font-size:22rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
		margin-top: 20rpx;
	}
</style>
