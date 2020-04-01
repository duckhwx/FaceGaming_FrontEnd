<template>
    <v-snackbar
    class="snackbar"
    v-model="snackbarModel"
    :color="presets.color"
    top
    right
    >
    {{presets.message}}
    </v-snackbar>
</template>
<script>
export default {
	props: {
		presets: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			snackbarModel: false
		}
	},
	watch: {
		presets () {
			if (this.presets.trigger) {
				this.snackbarModel = true;
			}
		},
		snackbarModel () {
			if (!this.snackbarModel) {
				this.$emit('resetSnackbar');
			}
		}
	}
}
</script>
<style>
	.snackbar{
		margin-top: 59px;
	}
</style>
