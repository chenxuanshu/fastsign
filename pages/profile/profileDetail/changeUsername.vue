<template>
	<view class="change-username">
		<input type="text" v-model="username" ref="username" @input="input"/>
		<button type="default" :disabled="disabled" @click="saveUsername">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modelData: this.$store.state.profileInfo,
				username: this.$store.state.profileInfo.username,
				disabled: true
			}
		},
		methods: {
			saveUsername () {
				const newName = this.username
				this.$store.commit('changeUsername', newName)
				uni.showToast({
					title: '保存成功',
					success() {
						setTimeout(()=> {
							uni.navigateBack({
							})
						},1500)
					}
				})
			},
			input () {
				this.disabled = false
			}
		}
	}
</script>

<style scoped>
	.change-username input {
		height: 40px;
		padding-left: 10px;
		border-bottom: 2px solid #eee;
	}
	.change-username button {
		width: 150px;
		height: 40px;
		line-height: 40px;
		margin: 5px auto;
	}

</style>
