<script>
import md5 from 'js-md5'
export default {
	onLaunch: function() {
		try {
			const user_name = uni.getStorageSync('user_name')
			const password = uni.getStorageSync('password')
		    if (user_name && password) {
		        let timestamp = Date.parse(new Date()) / 1000
				let pwd = this.encryption(user_name, password, timestamp)
				uni.request({
					url: this.$http + 'user/login',
					method: 'POST',
					data: {user_name, timestamp, pwd},
					success: (res) => {
						if (res.data.code == 13) {
							this.$store.commit('saveToken', res.data.token)
							this.$store.commit('username', user_name)
							uni.setStorage({
								key: 'user_name',
								data: user_name,
							})
							uni.setStorage({
								key: 'password',
								data: password,
							})
							uni.switchTab({
								url: '/pages/index/index'
							})
						}else if (res.data.code == 0) {
							let msg = res.data.msg
							uni.showToast({
								title: msg,
								icon: 'none'
							})
						}else {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
		    }
		} catch (e) {
		}
	},
	methods: {
		encryption (user_name, password, timestamp) {
			let oristr = password + timestamp + user_name
			let oriArr = oristr.split('')
			let timeArr = String(timestamp).split('')
			let sonStr = ''
			for (let i = 0; i < timeArr.length; i++) {
				sonStr += oriArr[timeArr[i]]
			}
			let resStr = oristr.slice(10) + oristr + sonStr + this.$adder
			let result = md5(resStr)
			return result
		}
	}
};
</script>

<style>
	@import "~@/static/css/normalize.css";
	@import "~@/static/icon/css/font-awesome.css";
	
</style>
