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
                @click="trigger">
                    <v-icon>fas fa-plus</v-icon>
            </v-btn>
        </template>
    <span>{{presets.templateText}}</span>
    </v-tooltip>
</template>

<script>
export default {
	props: {
		presets: {
			type: Object,
			required: true
		}
	},
	methods: {
		trigger () {
			this.$emit('createTrigger');
		}
	}
}
</script>
