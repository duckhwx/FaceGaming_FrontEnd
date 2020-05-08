<template>
    <v-dialog
    v-model="dialog"
    width="37%">
        <v-card
        class="py-2 px-2">
            <div
            class="my-2 message">{{dialogData.message}}
			</div>

            <v-btn
            class="my-2"
            @click="emitFunction"
            >Excluir</v-btn>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
	props: {
		dialogData: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			dialog: false
		}
	},
	methods: {
		emitFunction () {
			this.$emit('action');
		}
	},
	watch: {
		dialog () {
			if (!this.dialogData.trigger) {
				this.$emit('closeModal');
			}
		},
		dialogData () {
			this.dialog = this.dialogData.trigger;
		}
	}
}
</script>
<style>
.message {
    font-size: 18px;
}
</style>
