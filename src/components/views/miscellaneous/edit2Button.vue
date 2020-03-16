<template>
    <v-btn x-smal dark text
	@click="createPubEdit">
	<v-icon>fas fa-ellipsis-v</v-icon>
    </v-btn>
</template>

<script>
export default {
	name: 'editBtn',
	methods: {
		createPubEdit () {
			this.$emit('pubEdit');
		}
	}
}
</script>
