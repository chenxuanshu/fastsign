<template>
	<view class="sign-account">
		<uni-collapse>
		    <uni-collapse-item title="学习通" thumb="https://s1.ax1x.com/2020/04/29/J7VVrF.th.jpg">
			<view>
		        <view style="padding: 30rpx;" v-for="(item, index) in xxt" class="account" @click="tosignlist(item.id)">
		            <text>{{item.user_name}}</text>
					<view class="icons">
						<image src="../../../static/iconimg/editor.png" mode="scaleToFill" @click.stop="editAccount(index)"></image>
						<image src="../../../static/iconimg/bin2.png" mode="scaleToFill" @click.stop="delAccount(item.id)"></image>
					</view>
		        </view>
				<view class="add-account" @click="addAccount">
					<text>添加账号</text><image src="../../../static/iconimg/add.png" mode="scaleToFill"></image>
				</view>
			</view>
		    </uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import md5 from 'js-md5'
	export default {
		components: {
			uniCollapse, uniCollapseItem
		},
		data() {
			return {
				xxt: []
			}
		},
		onLoad() {
			this._getAccount()
		},
		onShow() {
			this._getAccount()
		},
		methods: {
			_getAccount() {
				let token = this.$store.state.token
				let user_name = this.$store.state.profileInfo.username
				uni.request({
					url: this.$http + 'user/refer',
					method: 'POST',
					data: {
						user_name
					},
					header: {
						token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.xxt = res.data.data.xxt
						}
					}
				})
			},
			tosignlist (id) {
				uni.navigateTo({
					url: './sign?id=' + id
				})
			},
			addAccount () {
				uni.navigateTo({
					url: './addAccount'
				})
			},
			editAccount (index) {
				uni.navigateTo({
					url: './editAccount?index=' + index
				})
			},
			delAccount (id) {
				uni.showModal({
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							let study_id = id
								let timestamp = Date.parse(new Date())
								let token = this.$store.state.token
								let user_name = this.$store.state.profileInfo.username
								let pwd = this.encryption(study_id, timestamp, user_name)
								uni.request({
									url: this.$http + 'user/xxt/deluser',
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
										if (res.data.code == 1) {
											let msg = res.data.msg
											uni.showToast({
												title: msg
											})
											this._getAccount()
										}else if (res.data.code == 0) {
											let msg = res.data.msg
											uni.showToast({
												title: msg
											})
										}else{
											uni.showToast({
												title: '系统发生错误，请稍后重试',
												icon: 'none'
											})
										}
									}
								})
							}
					}
				})
			},	
			encryption (study_id, timestamp, user_name) {
				let oriStr = String(study_id) + timestamp + user_name
				let oriArr = oriStr.split('')
				let timeArr = String(timestamp).split('')
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
	.sign-account {
		font-size: 15px;
		color: #7e7e7e;
	}
	.sign-account .account {
		height: 20px;
		line-height: 20px;
		background-color: #fff;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: space-between;
	}
	.add-account {
		height: 40px;
		background-color: #fff;
		border-top: 1px solid #eee;
		padding: 0 15px;
		padding-top: 10px;
		display: flex;
		justify-content: space-between;
	}
	.add-account image {
		width: 30px;
		height: 30px;
	}
	.sign-account .icons image {
		height: 30px;
		width: 30px;
		margin: 0 4px;
	}
</style>
