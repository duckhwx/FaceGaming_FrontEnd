<template>
	<div>
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
				@click="updatePub(pubId, index)">
					<v-list-item-title>
						Editar
					</v-list-item-title>
				</v-list-item>
				<v-list-item
				@click="summonDialogToDelete(pubId)">
					<v-list-item-title>
						Excluir
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<DialogModalDelete
		@action="deletePub"
		@closeModal="closeModal"
		:dialogData="dialogData"></DialogModalDelete>
	</div>
</template>

<script>
import DialogModalDelete from '@/components/views/miscellaneous/DialogModalDelete';
export default {
	components: {
		DialogModalDelete: DialogModalDelete
	},
	props: {
		pubId: {
			type: Number,
			required: true
		},
		index: {
			type: Number,
			required: true
		}
	},
	data () {
		return {
			dialogData: {
				trigger: false,
				message: ''
			}
		}
	},
	methods: {
		updatePub (id, index) {
			this.$emit('updatePub', id, index);
		},
		summonDialogToDelete () {
			this.dialogData = {
				trigger: true,
				message: 'Tens certeza de que deseja excluir esta publicação ?'
			}
		},
		deletePub () {
			this.$axios
				.delete('http://localhost:8081/' + 'Publication/deletePub/' + this.pubId, {
					headers: { token: JSON.parse(localStorage.userData) }
				})
				.then((response) => {
					this.dialogData = {
						trigger: false,
						message: ''
					};
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: 'Houve um erro ao excluir a publicação'
						});
						return;
					}

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: 'Publicação Excluida !'
					});
					this.$emit('resetBegin');
				});
		},
		closeModal () {
			this.dialogData = {
				trigge: false,
				message: ''
			};
		}
	}
}
</script>
