<template>
	<v-container>
		<CreatePub
		:trigger="createPubTrigger"
		@resetCreatePub="createPubTrigger = false"
		@callSnackbar="callSnackbar"
		@resetBegin="resetBegin"></CreatePub>

		<UpdatePub
		@resetPubUpdData="resetPubUpdData"
		@resetBegin="resetBegin"
		@callSnackbar="callSnackbar"
		:pubUpdData="pubUpdData"></UpdatePub>

		<v-fade-transition
		group>
			<v-layout class="publications"
			flex
			justify-center
			v-for="(publication, index) in publications"
			v-show="publication.show"
			:key="index">
				<v-flex xs12 sm7>
					<v-card>
						<v-list-item>
							<v-list-item-avatar
							color="grey darken-2"
							class="mx-2 my-3"
							size="35"
							>
								<v-img
								v-if="publication.pub.PROFILE_IMG !== ''"
								:src="publication.pub.PROFILE_IMG"
								></v-img>
								<v-icon
								size="20"
								v-else>
									fas fa-user
								</v-icon>
							</v-list-item-avatar>

							<v-list-item-action>
								<v-list-item-title>
									{{publication.pub.USERNAME}}
								</v-list-item-title>
							</v-list-item-action>

							<v-spacer></v-spacer>
							<OptionsButton
							v-if="checkUserIdPub(publication.pub.USER_ID)"
							@resetBegin="resetBegin"
							@callSnackbar="callSnackbar"
							v-on:updatePub="updatePub"
							:pubId="publication.pub.ID"
							:index="index"></OptionsButton>

						</v-list-item>
							<v-divider></v-divider>
						<v-card-text class="text-md-left">{{publication.pub.TITLE}}</v-card-text>
						<v-layout
						v-if="publication.pub.FILES.data.length > 0"
						justify-center
						>
							<v-container fluid>
								<v-row dense>
									<v-col class="imgCol d-inline-block"
									v-for="file in publication.pub.FILES.data"
									:key="file.id"
									:cols="file.FLEX">
										<v-img
											class="images align-end"
											:src="file.FILE"
											height="200"
											@click="openDialogImg(publication.pub.ID)"
										></v-img>
									</v-col>
								</v-row>
							</v-container>
						</v-layout>
						<v-layout
						class="mb-2 pb-6 pt-3"
						v-if="publication.pub.FILES.error"
						align-center
						justify-center
						column>
							<v-icon
							size="40">
								fas fa-exclamation-triangle
							</v-icon>
							<div class="mt-3">Houve um erro ao coletar os arquivos</div>
						</v-layout>
					</v-card>
				</v-flex>
			</v-layout>
		</v-fade-transition>

		<div
		class="mt-12 title"
		v-if="pubsError">
		{{pubsErrorMessage}}
		</div>

		<v-progress-circular
		:class="displayProgress"
		indeterminate
		class="mt-5"
		color="white"
		size="40">
		</v-progress-circular>

		<CreateBtn
		:presets="{
			status: false,
			templateText: 'Criar Publicação'
		}"
		@createTrigger="createPub"></CreateBtn>

		<PubDialog
		@resetDialog="resetDialog"
		:dialogFiles="dialogFiles">
		</PubDialog>
	</v-container>
</template>
<script>
import OptionsButton from '@/components/views/miscellaneous/OptionsButton'
import CreatePublication from '@/components/views/begin/CreatePublication'
import UpdatePublication from '@/components/views/begin/UpdatePublication'
import CreateBtn from '@/components/views/miscellaneous/CreateButton'
import PubDialog from '@/components/views/begin/DialogPub';

export default {
	name: 'Begin',
	components: {
		OptionsButton: OptionsButton,
		CreatePub: CreatePublication,
		UpdatePub: UpdatePublication,
		PubDialog: PubDialog,
		CreateBtn: CreateBtn
	},
	data () {
		return {
			token: JSON.parse(localStorage.userData),
			// Publications
			publications: [],
			start: 0,
			pubsError: false,
			pubsErrorMessage: '',
			// Scroll
			displayProgress: 'd-none',
			verifyScroll: true,
			// Dialog Publication
			dialogFiles: {
				trigger: false,
				images: []
			},
			// Update Publication
			pubUpdData: {
				trigger: false,
				pubId: 0
			},
			indexOfPub: null,
			// Create Publication
			createPubTrigger: false,
			// Snackbar
			snackbarTrigger: false,
			snackbarColor: '',
			snackbarMessage: ''
		}
	},
	mounted () {
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
		selectPubs () {
			this.displayProgress = '';
			this.$axios
				.get('http://localhost:8081/' + 'Publication/selectPubs/' + this.start, {
					headers: { token: this.token }
				})
				.then((response) => {
					console.log(response);
					if ((response.data.error && this.start === 0) || (response.data.total < 1 && this.start === 0)) {
						this.pubsError = true;
						this.pubsErrorMessage = response.data.message;
						this.displayProgress = 'd-none';
						return;
					}

					if (response.data.error) {
						this.displayProgress = 'd-none';
						return;
					}

					for (let index = 0; index < response.data.length; index += 1) {
						const pub = response.data[index];
						for (let index = 0; index < pub.FILES.data.length; index += 1) {
							let file = pub.FILES.data[index];

							if (pub.FILES.data.length === 1) {
								file.FLEX = 12;
								continue;
							}

							if (pub.FILES.data.length === 3) {
								pub.FILES.data[index].FLEX = 12;
								pub.FILES.data[1].FLEX = 6;
								pub.FILES.data[2].FLEX = 6;
								continue;
							}

							file.FLEX = 6;
						}
						this.publications.push({
							pub,
							show: true
						});
					}
					console.log(this.publications[0]);
					this.displayProgress = 'd-none';
					this.start += 10;
					this.verifyScroll = true;
				});
		},
		checkUserIdPub (userIdFromPub) {
			const decoded = this.$jwt(this.token);
			const userId = decoded.userData.ID;

			if (userIdFromPub !== userId) {
				return false;
			}

			return true;
		},
		openDialogImg (pubId) {
			let imgs = []
			for (let index = 0; index < this.publications.length; index += 1) {
				let publication = this.publications[index];
				if (publication.ID === pubId) {
					imgs = publication.FILES;
					break;
				}
			}
			this.dialogFiles = {
				trigger: true,
				images: imgs
			}
		},
		resetDialog () {
			this.dialogFiles = {
				trigger: false,
				images: []
			}
		},
		callSnackbar (presets) {
			this.$emit('callSnackbar', presets);
		},
		summonSnackbar (color, message) {
			this.snackbarTrigger = true;
			this.snackbarColor = color;
			this.snackbarMessage = message;
		},
		resetSnackbar () {
			this.snackbarTrigger = false;
			this.snackbarColor = '';
			this.snackbarMessage = '';
		},
		resetBegin () {
			this.start = 0;
			this.publications = [];
			this.selectPubs();
		},
		createPub () {
			this.createPubTrigger = !this.createPubTrigger;
			if (this.indexOfPub !== null) {
				this.publications[this.indexOfPub].show = true;
			}
			this.pubUpdData = {
				trigger: false,
				pubId: 0,
				index: null
			}
			this.$vuetify.goTo(0, {
				duration: 500
			});
		},
		updatePub (id, index) {
			this.createPubTrigger = false;
			this.publications[index].show = false;
			this.indexOfPub = index;
			this.pubUpdData = {
				trigger: true,
				pubId: id,
				index
			}
		},
		resetPubUpdData (index) {
			this.pubUpdData = {
				trigger: false,
				pubId: 0
			};
			this.indexOfPub = null;
			this.publications[index].show = true;
		}
	}
};
</script>
<style>
	.publications{
		margin-top: 30px
	}
	.images{
		margin-top: -7px;
		cursor: pointer;
	}
	.imgCol{
		padding: 0px !important;
	}
</style>
