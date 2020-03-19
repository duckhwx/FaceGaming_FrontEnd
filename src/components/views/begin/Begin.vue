<template>
<v-container>
	<CreatePub></CreatePub>

	<v-expand-x-transition>
		<v-layout v-show="pubEdit" flex justify-center class="publications">
			<v-flex xs12 sm7>
				<v-card dark>
					<v-card-title>Editar Publicação</v-card-title>
					<v-divider></v-divider>

					<v-form ref="edit">
						<v-container>

							<v-row>
								<v-col>
									<v-textarea v-model="dataText2"
									class="textArea"
									:rules="textRules"
									counter
									outlined
									solo
									no-resize
									auto-grow
									label="Texto">
									</v-textarea>
								</v-col>
							</v-row>

							<v-row>
								<v-col class="text-left">
										<v-btn
										align="left"
										class="d-inline"
										@click="updatePub">Editar Dados</v-btn>
								</v-col>
							</v-row>

						</v-container>

					</v-form>
				</v-card>
			</v-flex>
		</v-layout>
	</v-expand-x-transition>

		<v-layout class="publications"
		flex
		justify-center
		v-for="(publication, index) in publications"
		:key="index">
			<v-flex xs12 sm7>
				<v-card>
					<v-list-item>
						<v-list-item-avatar
						class="mx-2 my-3"
						size="35"
						>
							<v-img
							:src="publication.PROFILE_IMG"
							></v-img>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>
								{{publication.USERNAME}}
							</v-list-item-title>
						</v-list-item-content>
						<Edit2 v-on:pubEdit="editPub(publication.ID)"
					v-if="userID === publication.USER_ID"></Edit2>
					</v-list-item>
						<v-divider></v-divider>
					<v-card-text class="text-md-left">{{publication.TITLE}}</v-card-text>
					<v-layout
					v-if="publication.FILES.error = true"
					justify-center
					>
						<v-container fluid>
							<v-row dense>
								<v-col class="imgCol d-inline-block"
								v-for="file in publication.FILES.data"
								:key="file.id"
								:cols="file.FLEX">
									<v-layout
									class="mb-2"
									v-if="file.error === true"
									align-center
									justify-center
									column>
										<v-icon
										size="40">
											fas fa-exclamation-triangle
										</v-icon>
										<div class="mt-3">{{file.message}}</div>
									</v-layout>

									<v-img
										v-else
										class="images align-end"
										:src="file.FILE"
										height="200"
										@click="openDialogImg(publication.ID)"
									></v-img>
								</v-col>
							</v-row>
						</v-container>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>

		<div
		class="mt-12 title"
		v-if="pubsError"
		>
		{{pubsErrorMessage}}
		</div>

		<v-snackbar
		class="snackbar"
		v-model="selectFilesError"
		color="error"
		top
		right
		>
		{{selectFilesErrorMessage}}
		</v-snackbar>

		<v-dialog
		v-model="imgDialog"
		width="80%"
		>
			<v-carousel
			show-arrows
			prev-icon="fas fa-chevron-left"
			next-icon="fas fa-chevron-right"
			>
				<v-carousel-item
				v-for="(imagePub, index) in imagesPub"
				:key="index"
				>
					<v-sheet
					color="grey darken-4"
					height="100%"
					tile
					>
						<v-img
						:src="imagePub.FILE"
						width="100%"
						height="100%"
						contain>
						</v-img>
					</v-sheet>
				</v-carousel-item>
			</v-carousel>
		</v-dialog>

		<v-progress-circular
		:class="displayProgress"
		indeterminate
		class="mt-5"
		color="white"
		size="40">
		</v-progress-circular>
	</v-container>
</template>
<script>
import Edit2 from '@/components/views/miscellaneous/edit2Button'
import CreatePublication from '@/components/views/begin/CreatePublication'

export default {
	name: 'Begin',
	components: {
		Edit2: Edit2,
		CreatePub: CreatePublication
	},
	data () {
		return {
			pubEditID: '',
			userID: '',
			dataText2: '',
			file: [],
			textRules: [
				v => !!v || 'Texto requisitado',
				v => v.length <= 500 || 'Máximo 500 caracteres'
			],
			pubEdit: false,
			token: JSON.parse(localStorage.userData),
			publications: [],
			imgDialog: false,
			imagesPub: [],
			start: 0,
			pubsError: false,
			pubsErrorMessage: '',
			selectFilesError: false,
			selectFilesErrorMessage: '',
			displayProgress: 'd-none',
			verifyScroll: true
		}
	},
	mounted () {
		this.decodedID();
		this.selectPubs();
		window.onscroll = () => {
			let bottomScroll = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

			if (bottomScroll && this.verifyScroll) {
				this.verifyScroll = false;
				this.selectPubs();
			}
		}
	},
	methods: {
		editPub (pubID) {
			if (this.pubEditID === pubID) {
				this.pubEdit = !this.pubEdit
				return
			}
			console.log(this.pubEditID)
			this.pubEditID = pubID
			this.pubEdit = true
		},
		selectPubs () {
			this.displayProgress = '';
			this.$axios
				.get('http://localhost:8081/' + 'Publication/selectPubs/' + this.start, {
					headers: { token: this.token }
				})
				.then((response) => {
					console.log(response);
					if (response.error) {
						this.pubsError = true;
						this.pubsErrorMessage = response.data.message;
						this.displayProgress = 'd-none';
						return;
					}

					if (response.data.data.length < 1) {
						this.displayProgress = 'd-none';
						return;
					}

					for (let index = 0; index < response.data.data.length; index += 1) {
						const pub = response.data.data[index];
						for (let index = 0; index < pub.FILES.data.length; index += 1) {
							let file = pub.FILES.data[index];

							if (pub.FILES.length === 1) {
								file.FLEX = 12;
								continue;
							}

							if (pub.FILES.length === 3) {
								pub.FILES[index].FLEX = 12;
								pub.FILES[1].FLEX = 6;
								pub.FILES[2].FLEX = 6;
								continue;
							}

							file.FLEX = 6;
						}

						this.publications.push(pub);
					}

					this.displayProgress = 'd-none';
					this.start += 10;
					this.verifyScroll = true;
					console.log(this.start);
					console.log(this.publications);
				});
		},
		decodedID () {
			const token = localStorage.userData;
			const decoded = this.$jwt(token);
			this.userID = decoded.userData.ID;
		},
		updatePub () {
			if (this.$refs.edit.validate()) {
				let userObject = {
					pubId: this.pubEditID,
					textfield: this.dataText2
				}
				this.$axios.post('http://localhost:8081/' + 'Publication/updatePub', userObject,
					{headers: { token: JSON.parse(localStorage.userData) }})
					.then((response) => {
						if (response.data.status) {
							this.snackbarColor = 'red'
							this.message = response.data.message;
							this.createPubMessage = true;
							return;
						}

						this.message = response.data.message;
						this.createPubMessage = true;
						this.pubEdit = false;
						this.selectPubs();
					})
			}
		},
		openDialogImg (pubId) {
			for (let index = 0; index < this.publications.length; index += 1) {
				let publication = this.publications[index];
				if (publication.ID === pubId) {
					this.imagesPub = publication.FILES;
				}
			}
			this.imgDialog = true;
		}
	}
};
</script>
<style>
	.publications{
		margin-top: 30px
	}
	.snackbar{
		margin-top: 45px
	}
	.images{
		margin-top: -7px;
		cursor: pointer;
	}
	.imgCol{
		padding: 0px !important;
	}
</style>
