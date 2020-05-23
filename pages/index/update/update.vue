<template>
	<view class="update">
		<version-upgrade :version="version" :url="url" :describe="describe" :is_force="true"></version-upgrade>
	</view>
</template>

<script>
	import versionUpgrade from "@/components/luo-version-upgrade/luo-version-upgrade.vue"
	export default {
		name: 'update',
		components: {
			versionUpgrade
		},
		data() {
			return {
				version: '',
				url: '',
				describe: ''
				
			}
		},
		mounted () {
			this._updateCheck()
		},
		methods: {
			_updateCheck () {
				uni.request({
					url: this.$http + 'user/update/update',
					method: 'POST',
					success: (res) => {
						let upversion = res.data.version.version
						let version = this.$store.state.version
						if (Number(upversion) > Number(version)) {
							this.version = upversion
							this.url = res.data.version.url
							this.describe = res.data.version.content
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
