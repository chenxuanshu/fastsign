<template>
	<view class="edit-course">
		<view class="name">
			<text>课程</text><text>{{course.course_name}}</text>
		</view>
		<picker mode="selector" :range="days"  @change="chooseDay">
			<view class="day">
				<text>日期</text><text>{{course.day | dayTurn}}</text>
			</view>
		</picker>
		<picker mode="multiSelector" :range="times" @change="chooseTime">
			<view class="time">
				<text>时间</text><text>{{course.start_time | timeTurn}}</text>
			</view>
		</picker>
		<view class="status">
			<text>状态</text>
			<evan-switch v-model="course.status" :active-value="1"
			:inactive-value="0" :size="25" class="switch"></evan-switch>
		</view>
		<button type="default" class="submit" @click="submit">确定</button>
	</view>
</template>

<script>
	import evanSwitch from '@/components/evan-switch/evan-switch.vue'
	import md5 from 'js-md5'
	export default {
		components: {
			evanSwitch
		},
		data() {
			return {
				courses: [],
				index: '',
				study_id: '',
				days: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
				times: [['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'],
				['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20',
				'21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
				'41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']]
			}
		},
		onLoad (pams) {
			this.index = pams.index
			this.study_id = pams.id
			let token = this.$store.state.token
			let user_name = this.$store.state.profileInfo.username
			let timestamp = Date.parse(new Date()) / 1000
			let pwd = this.encryption(this.study_id, timestamp, user_name)
			this._getClassList(this.study_id, timestamp, user_name, pwd)
		},
		computed: {
			course () {
				return this.courses[this.index] || {}
			}
		},
		methods: {
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
			encryption_sec (cid, day, startTime, status, study_id, timestamp, user_name) {
				let oriStr = String(cid) + day + startTime + status + study_id + timestamp + user_name
				let timeArr = String(timestamp).split('')
				let oriArr = oriStr.split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
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
						// console.log(res.data.data)
						this.courses = res.data && res.data.data
					}
				})
			},
			chooseDay (e) {
				this.course.day = e.detail.value
			},
			chooseTime (e) {
				this.course.start_time = (e.detail.value[0] + 6) * 3600 + e.detail.value[1] * 60
			},
			submit () {
				let study_id = this.study_id
				let day = this.course.day
				let startTime = this.course.start_time
				let status = this.course.status
				let cid = this.course.id
				let user_name = this.$store.state.profileInfo.username
				let token = this.$store.state.token
				let timestamp = Date.parse(new Date()) / 1000
				let arr = ['study_id', 'day', 'startTime', 'user_name', 'cid', 'timestamp', 'status']
				let pwd = this.encryption_sec(cid, day, startTime, status, study_id, timestamp, user_name)
				uni.request({
					url: this.$http + 'user/xxt/editclass',
					method: 'POST',
					header: {
						token
					},
					data: {
						study_id,
						day,
						startTime,
						status,
						user_name,
						cid,
						timestamp,
						pwd
					},
					success: (res) => {
						if (res.data.code == 1) {
							let msg = res.data.msg
							uni.showToast({
								title: msg
							})
							setTimeout(() => {
								uni.navigateBack({
								})
							}, 1500)
						}else if (res.data.code == 0) {
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}else {
							uni.showToast({
								title: '系统故障，请稍后重试！',
								icon: 'none'
							})
						}
					}
				})
			}
		},
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
				let hour = String(Math.round(time/3600))
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
	.edit-course {
		font-size: 16px;
		color: #8d8d8d;
	}
	.name, .day, .time, .status {
		height: 45px;
		line-height: 45px;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
	}
	.status .switch {
		margin-top: 8px;
	}
	.edit-course .submit {
		width: 200px;
		height: 40px;
		line-height: 40px;
		margin: 5px auto;
	}


</style>
