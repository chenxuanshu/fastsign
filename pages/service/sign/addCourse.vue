<template>
	<view class="add-page">
		<view class="desc">
			<text>
				1.只要为一门课设置好签到起始监听时间就可以
				2.一门课程只能设置一个监听时间段
				3.重新设置要到我的->课程中先删除设置好的课程
			</text>
		</view>
		<picker mode="multiSelector" :range="range" :range-key="key" :value="select" @change="save" v-for="(item,index) in courses">
			<view class="course" @click="submit(item.courseId,item.classId,item.courseName)">
				<view>
					<image :src="item.courseImg" mode="scaleToFill"></image>
					<text class="name">{{item.courseName}}</text>
				</view>
				<view class="set">
					
				</view>
			</view>
		</picker>
	</view>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		components: {
		},
		data() {
			return {
				study_id: '',
				courses: [],
				range: [
					['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
					['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'],
					['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20',
					'21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
					'41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']
				],
				key: '星期一',
				select: [0,6,1],
				classId: '',
				courseId: '',
				courseName: ''
			}
		},
		onLoad(pams) {
			let study_id = pams.id
			this.study_id = study_id
			let timestamp = Date.parse(new Date())
			this._getClass(study_id, timestamp)
		},
		methods: {
			_getClass (study_id, timestamp) {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				let pwd = this.enecrption(study_id, timestamp, user_name)
				uni.request({
					url: this.$http + 'user/xxt/getclass',
					method: 'POST',
					header: {
						token
					},
					data: {
						study_id,
						timestamp,
						user_name,
						pwd
					},
					success: (res) => {
						if (res.data.code == 0) {
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}else {
							this.courses = res.data.data
						}
					}
				})
			},
			enecrption (study_id, timestamp, user_name) {
				let oriStr = study_id + timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
				let sonStr = ''
				for (let i =0; i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			},
			save (e) {
				let day = e.detail.value[0]
				let hour = e.detail.value[1]
				let mintue = e.detail.value[2]
				let startTime = this.timeTurn(hour, mintue)
				let courseId = this.courseId
				let classId = this.classId
				let courseName = this.courseName
				let user_name = this.$store.state.profileInfo.username
				let token = this.$store.state.token
				let study_id = this.study_id
				let timestamp = Date.parse(new Date()) / 1000
				let pwd = this.execrption_sec(classId, courseId, day, startTime, study_id, timestamp, user_name)
				uni.request({
					url: this.$http + 'user/xxt/addclass',
					method: 'POST',
					header: {
						token
					},
					data: {
						classId,
						courseId,
						day,
						startTime,
						study_id,
						timestamp,
						user_name,
						courseName,
						pwd
					},
					success: (res) => {
						if (res.data.code == 1) {
							let msg = res.data.msg
							uni.showToast({
								title: msg
							})
							setTimeout(()=> {
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
								title: '系统发生错误，请稍后重试',
								icon: 'none'
							})
						}
					}
				})
				
			},
			// 课程点击事件取必要参数
			submit (courseId, classId, courseName) {
				this.courseId = courseId
				this.classId = classId
				this.courseName = courseName
			},
			// 时间转化
			timeTurn (hour, mintue) {
				return (hour + 6) * 3600 + mintue * 60
			},
			// 加密
			execrption_sec (classId, courseId, day, startTime, study_id, timestamp, user_name) {
				let oriStr = String(classId) + String(courseId) + day + startTime + study_id + timestamp + user_name
				let timeArr = String(timestamp).split('')
				let oriArr = oriStr.split('')
				let sonStr = ''
				for (let i = 0; i < timeArr.length; i++) {
					sonStr += oriArr[timeArr[i]]
				}
				let res = oriStr.slice(10) + oriStr + sonStr + this.$adder
				return md5(res)
			}
		}
	}
</script>

<style scoped>
	.add-page .desc {
		font-size: 16px;
		padding-bottom: 5px;
		border-bottom: 1px solid #eee;
	}
	.add-page .course {
		width: 92%;
		height: 50px;
		border: 2px solid #eee;
		border-radius: 5px;
		line-height: 50px;
		margin: 0 auto;
		margin-top: 7px;
		padding-left: 10px;
		padding-top: 2px;
	}
	.add-page .course image  {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		overflow: hidden;
		margin-right: 10px;
		vertical-align: middle;
	}
	.add-page .course .name {
		vertical-align: middle;
	}
</style>
