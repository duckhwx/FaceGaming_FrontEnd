<template>
    <v-dialog
    v-model="modelDialog"
    width="80%"
    >
        <v-carousel
        show-arrows
        prev-icon="fas fa-chevron-left"
        next-icon="fas fa-chevron-right"
        >
            <v-carousel-item
            v-for="(image, index) in dialogFiles.images.data"
            :key="index"
            >
                <v-sheet
                color="grey darken-4"
                height="100%"
                tile
                >
                    <v-img
                    :src="image.FILE"
                    width="100%"
                    height="100%"
                    contain>
                    </v-img>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </v-dialog>
</template>
<script>
export default {
	props: {
		dialogFiles: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			modelDialog: false
		}
	},
	watch: {
		dialogFiles () {
			if (this.dialogFiles.trigger) {
				this.modelDialog = true;
			}
		},
		modelDialog () {
			if (!this.modelDialog) {
				this.$emit('resetDialog');
			}
		}
	}
}
</script>
