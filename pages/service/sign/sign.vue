<template>
	<view class="sign">
		<view class="course-header">
			<text class="name">课程</text>
			<text class="day">日期</text>
			<text>时间</text>
			<text>编辑</text>
			<text>删除</text>
		</view>
		<view class="course-show" v-if="courses[0]">
			<view class="course-item" v-for="(item,index) in courses">
				<text class="name">{{item.course_name}}</text>
				<text class="day">{{item.day | dayTurn}}</text>
				<text class="durtion">{{item.start_time | timeTurn}}</text>
				<view class="">
					<image src="../../../static/iconimg/editor.png" mode="scaleToFill"
					@click="editCourse(index)" class="edit"></image>
				</view>
				<view class="">
					<image src="../../../static/iconimg/bin2.png" mode="scaleToFill"
					@click="delCourse(item.id)" class="delete"></image>
				</view>
			</view>
		</view>
		<view class="else" v-else>
			暂无签到课程，请添加！
		</view>
		<view class="add" @click="add">
			<image src="../../../static/iconimg/increase.png" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		components: {
		},
		data() {
			return {
				courses: [],
				id: ''
			}
		},
		onLoad(pams) {
			let study_id = pams.id
			this.id = study_id
			let user_name = this.$store.state.profileInfo.username
			let timestamp = Date.parse(new Date()) / 1000
			let pwd = this.encryption(study_id, timestamp, user_name)
			this._getClassList(study_id, timestamp, user_name, pwd)
		},
		onShow() {
			let study_id = this.id
			let user_name = this.$store.state.profileInfo.username
			let timestamp = Date.parse(new Date()) / 1000
			let pwd = this.encryption(study_id, timestamp, user_name)
			this._getClassList(study_id, timestamp, user_name, pwd)
		},
		methods: {
			add () {
				uni.navigateTo({
					url: './addCourse?id=' + this.id
				})
			},
			// 加密算法
			encryption (study_id, timestamp, user_name) {
				let oriStr = study_id + timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0;i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				let pwd = md5(res)
				return pwd
			},
			enecryption_sec (cid, timestamp, user_name) {
				let oriStr = String(cid) + timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i = 0;i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			},
			// 获取课程列表
			_getClassList(study_id, timestamp, user_name, pwd) {
				let token = this.$store.state.token
				uni.request({
					url: this.$http + 'user/xxt/classlist',
					method: 'POST',
					header: {
						token
					},
					data: {
						user_name,
						study_id,
						timestamp,
						pwd
					},
					success: (res) => {
						this.courses = res.data.data
					}
				})
			},
			// 编辑课程页
			editCourse (index) {
				uni.navigateTo({
					url: './editCourse?index=' + index + '&id=' + this.id
				})
			},
			// 删除课程页
			delCourse (cid) {
				uni.showModal({
					content: '确定删除此课程吗？',
					success: (res) => {
						if (res.confirm) {
							let token = this.$store.state.token
								let user_name = this.$store.state.profileInfo.username
								let timestamp = Date.parse(new Date()) / 1000
								let pwd = this.enecryption_sec(cid, timestamp, user_name)
								uni.request({
									url: this.$http +'user/xxt/delclass',
									method: 'POST',
									header: {
										token
									},
									data: {
										cid,
										user_name,
										timestamp,
										pwd
									},
									success: (res) => {
										if (res.data.code == 1 || res.data.code == 0) {
											let msg = res.data.msg
											uni.showToast({
												title: msg,
												icon: 'none'
											})
											// 刷新页面
											let study_id = this.id											let user_name = this.$store.state.profileInfo.username											let timestamp = Date.parse(new Date()) / 1000											let pwd = this.encryption(study_id, timestamp, user_name)											this._getClassList(study_id, timestamp, user_name, pwd)
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
		}},
		filters: {
			dayTurn (day) {
				switch (day) {
					case 0: return '星期日';break
					case 1: return '星期一';break
					case 2: return '星期二';break
					case 3: return '星期三';break
					case 4: return '星期四';break
					case 5: return '星期五';break
					case 6: return '星期六';break
				}
			},
			timeTurn (time) {
				let hour = String(Math.floor(time/3600))
				hour = hour.length == 2 ? hour : '0' + hour
				let minuteSum = time % 3600
				let minute = String(minuteSum / 60)
				minute = minute.length == 2 ? minute : '0' + minute 
				return hour + ':' + minute
			}
		}
	}
</script>

<style scoped>
	.sign {
		position: relative;
		font-size: 14px;
	}
	/* header */
	.sign .course-header {
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #eee;
		padding: 5px;
		display: flex;
		justify-content: space-between;
		background-color: #eee;
	}
	.course-header text {
		text-align: center;
		width: 56px;
	}
	/* 添加按钮 */
	.sign .add {
		width: 50px;
		height: 50px;
		border: 1px solid #eee;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 2px 2px 2px #eee;
		position: fixed;
		right: 10px;
		bottom: 15%;
	}
	.sign .add image {
		width: 100%;
		height: 100%;
	}
	/* 课程*/
	.sign .course-show .course-item {
		width: 98%;
		height: 50px;
		line-height: 50px;
		margin: 0 auto;
		border-bottom: 1px solid #eee;
		position: relative;
		display: flex;
		justify-content: space-between;
	}
	.course-item .name {
		width: 56px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.course-item .day, .course-item .durtion {
		width: 56px;
		text-align: center;
	}
	.course-item view {
		width: 56px;
		position: relative;
	}
	.course-item image {
		width: 30px;
		height: 30px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
	
</style>
