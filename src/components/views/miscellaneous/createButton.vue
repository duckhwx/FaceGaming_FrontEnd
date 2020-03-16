<template>
    <v-tooltip left>
        <template v-slot:activator="{ on }">
            <v-btn
                dark
                fab
                fixed
                right
                bottom
                v-on="on"
                @click="createPubTrigger">
                    <v-icon>fas fa-plus</v-icon>
            </v-btn>
        </template>
    <span>Criar Publicação</span>
    </v-tooltip>
</template>

<script>
export default {
	name: 'createBtn',
	props: {
		select: {
			type: String,
			required: true
		}
	},
	mounted () {
		console.log(this.select);
	},
	methods: {
		createPubTrigger () {
			this.$emit('pubTrigger');
		}
	}
}
</script>
