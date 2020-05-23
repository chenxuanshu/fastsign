import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const store = new vuex.Store({
	state: {
		version: '1.0',
		// token
		token: '',
		// 个人信息
		profileInfo: {
			id: '',
			avatar: '../../static/img/user_avatar.png',
			username: '',
			email: '',
			status: ''
		}
	},
	getters: {
		
	},
	mutations: {
		// ** 保存token
		saveToken (state, token) {
			state.token = token
		},
		// ** 保存用户名
		username (state, username) {
			state.profileInfo.username = username
		},
		// ** 保存邮箱
		saveEmail (state, email) {
			state.profileInfo.email = email
		},
		// ** 保存账户创建时间
		saveTime (state, create_time) {
			state.profileInfo.create_time = create_time
		},
		// ** 保存用户状态
		saveStatus (state, status) {
			state.profileInfo.status = status
		},
		// 保存头像
		saveAvatar (state, newAvatar) {
			state.profileInfo.avatar = newAvatar
		}
	}
})

export default store