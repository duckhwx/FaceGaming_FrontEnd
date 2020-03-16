<template>
    <v-btn @click="desativar"
	dark fab fixed right bottom
	><v-icon>fas fa-edit</v-icon>
    </v-btn>
</template>

<script>
export default {
	data () {
		return {
			value: false
		}
	},
	methods: {
		desativar () {
			this.value = !this.value
			this.$emit('disableButton', this.value)
		}
	}
}
</script>
