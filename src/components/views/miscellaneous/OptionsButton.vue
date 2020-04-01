<template>
	<v-menu bottom left offset-y>
		<template v-slot:activator="{ on }">
			<v-btn
			icon
			v-on="on"
			>
				<v-icon>
					fas fa-ellipsis-v
				</v-icon>
			</v-btn>
		</template>
		<v-list
		width="120"
		>
			<v-list-item
			@click="updatePub(pubId)">
				<v-list-item-title>
					Editar
				</v-list-item-title>
			</v-list-item>
			<v-list-item
			@click="deletePub(pubId)">
				<v-list-item-title>
					Excluir
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
export default {
	props: {
		pubId: {
			type: Number,
			required: true
		}
	},
	methods: {
		updatePub (id) {
			this.$emit('updatePub', id);
		},
		deletePub () {
			this.$emit('deletePub', this.pubId);
		}
	}
}
</script>
