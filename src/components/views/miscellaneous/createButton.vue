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
	name: 'CreateBtn',
	methods: {
		createPubTrigger () {
			this.$emit('pubTrigger');
		}
	}
}
</script>
