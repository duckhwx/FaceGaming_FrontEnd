<template>
	<v-expand-transition>
		<v-layout v-show="pubExpand" flex justify-center class="publications">
			<v-flex xs12 sm7>
				<v-card dark>
                    <v-list-item>
                        <v-card-title>
                            Editar Publicação
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn
                        icon>
                            <v-icon
                            size="20"
							@click="closeUpdPub">
                                fas fa-times
                            </v-icon>
                        </v-btn>
                    </v-list-item>
				<v-divider></v-divider>
					<v-form ref="pubForm">
						<v-container>
							<v-row>
								<v-col>
									<v-textarea v-model="dataText"
									class="textArea"
									:rules="textRules"
                                    :value="dataText"
									counter
									outlined
									solo
									no-resize
									auto-grow
									label="Texto">
									</v-textarea>
								</v-col>
							</v-row>

                            <v-row v-if="imgsPreview.length > 0">
                                <v-col>
                                    <v-card class="py-2" elevation>
                                        <v-layout justify-center>
                                            <v-flex
                                                xs6
                                                md12
                                                lg12
                                                v-for="(img, index) in imgsPreview"
                                                :key="index"
                                                class="text-right px-2"
                                            >
                                                <v-layout justify-center>
                                                    <v-img :src="img.bs64File" height="70" width="50">
                                                        <v-btn
                                                        class="mx-1"
                                                        width="26"
                                                        height="26"
                                                        small
                                                        fab
                                                        top
                                                        @click="reduceFile(index)"
                                                        >
                                                        <v-icon size="14">fas fa-times</v-icon>
                                                        </v-btn>
                                                    </v-img>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <span class="error--text caption" v-if="fileError">{{fileErrorMessage}}</span>

							<v-row>
								<v-col class="text-left">
										<v-btn
										align="left"
										class="d-inline"
										@click="updatePub">Editar</v-btn>
								</v-col>
                                <v-col class="text-right">
                                    <input
                                        type="file"
                                        ref="image"
                                        style="display: none"
                                        name="file"
                                        @change="filePicked"
                                        multiple
                                    >
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                        <v-btn
                                            class="d-inline addFileButton"
                                            align="right"
                                            right
                                            small
                                            fab
                                            v-on="on"
                                            @click="pickFile"
                                        >
                                            <v-icon small>fas fa-image</v-icon>
                                        </v-btn>
                                        </template>
                                        <span>Adicionar Imagem</span>
                                    </v-tooltip>
                                </v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-card>
			</v-flex>
		</v-layout>
	</v-expand-transition>
</template>
<script>
export default {
	props: {
		pubUpdData: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			dataText: '',
			files: [],
			filesManagement: {
				backEndFiles: [],
				deletedFiles: []
			},
			imgsPreview: [],
			fileError: false,
			textRules: [
				v => !!v || 'Texto requisitado',
				v => v.length <= 500 || 'Máximo 500 caracteres'
			],
			pubExpand: false,
			token: JSON.parse(localStorage.userData)
		}
	},
	methods: {
		getPubData (id) {
			this.$axios
				.get('http://localhost:8081/' + 'Publication/selectPub/' + id, {
					headers: { token: this.token }
				})
				.then((response) => {
					console.log(response);
					if (response.data.error.status && response.data.error.type === 'text') {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
							message: 'Houve um erro ao coletar os dados da publicação'
						});
						return;
					}

					this.dataText = response.data.data.TITLE;

					if (response.data.error.status && response.data.error.type === 'files') {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
							message: 'Houve um erro ao coletar os arquivos da publicação'
						});
						return;
					}

					if (response.data.data.files) {
						for (let index = 0; index < response.data.data.files.length; index += 1) {
							const fileIndex = response.data.data.files[index];
							this.filesManagement.backEndFiles.push({
								id: fileIndex.ID,
								name: fileIndex.FILE_NAME
							});

							this.imgsPreview.push({
								name: fileIndex.FILE_NAME,
								bs64File: fileIndex.BS64FILE
							});
						}
					}

					this.$vuetify.goTo(0, {
						duration: 500
					});
					this.pubExpand = true;
				});
		},
		updatePub () {
			if (this.$refs.pubForm.validate()) {
				const pubObject = {
					pubId: this.pubUpdData.pubId,
					textfield: this.dataText
				};
				let formData = new FormData();

				this.$axios
					.post('http://localhost:8081/' + 'Publication/updatePubText', pubObject, {
						headers: {
							token: this.token,
							path: this.pubUpdData.pubId
						}
					})
					.then((response) => {
						if (response.data.error) {
							this.$emit('callSnackbar', {
								trigger: true,
								color: 'red',
								message: 'Houve um erro ao atualizar a publicação'
							});
							return;
						}

						const filesObject = {
							pubId: this.pubUpdData.pubId,
							deletedFiles: this.filesManagement.deletedFiles
						}

						if (this.filesManagement.deletedFiles.length > 0) {
							this.$axios
								.post('http://localhost:8081/' + 'Publication/deleteFilesFromPubs', filesObject, {
									headers: {
										token: this.token,
										path: this.pubUpdData.pubId
									}
								});
						}

						for (let index = 0; index < this.files.length; index += 1) {
							let file = this.files[index];
							formData.append('images', file, file.filename);
						}

						this.$axios
							.post('http://localhost:8081/' + 'Publication/updatePubFiles', formData, {
								headers: {
									token: this.token,
									path: this.pubUpdData.pubId
								}
							})
							.then((response) => {
								if (response.data.status) {
									this.$emit('callSnackbar', {
										trigger: true,
										color: 'red',
										message: 'Houve um erro ao atualizar os arquivos'
									});
								}
							})

						this.resetData();
						this.pubExpand = false;
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'dark',
							message: 'Publicação atualizada'
						});
						this.$emit('resetBegin');
					});
			}
		},
		pickFile () {
			if (this.files.length === 4) {
				this.fileError = true;
				this.fileErrorMessage = 'Máximo 4 Arquivos';
				return;
			}
			this.$refs.image.click();
		},
		filePicked (event) {
			const eventFiles = event.target.files;

			if (eventFiles.length > 4 || this.filesManagement.backEndFiles.length + eventFiles.length > 4) {
				this.fileError = true;
				this.fileErrorMessage = 'Máximo 4 Arquivos';
				return
			}
			for (let index = 0; index < eventFiles.length; index += 1) {
				if (eventFiles[index].name.lastIndexOf('.') <= 0) {
					return;
				}
				if (eventFiles[index].size >= 5000000) {
					this.fileError = true;
					this.fileErrorMessage = 'Tamanho do arquivo excedido (máximo 10 MB)';
					return;
				}

				this.files.push(eventFiles[index]);

				let fileReader = new FileReader();
				fileReader.addEventListener('load', () => {
					this.imgsPreview.push({
						name: eventFiles[index].name,
						bs64File: fileReader.result
					});
				});
				fileReader.readAsDataURL(eventFiles[index])

				this.fileError = false;
				this.fileErrorMessage = '';
			}
		},
		closeUpdPub () {
			this.resetData();
			this.pubExpand = false;
			this.$emit('resetPubUpdData', this.pubUpdData.index);
		},
		resetData () {
			this.dataText = '';
			this.files = [];
			this.imgsPreview = [];
			this.filesManagement = {
				backEndFiles: [],
				deletedFiles: []
			};
		},
		reduceFile (indexArray) {
			for (let index = 0; index < this.filesManagement.backEndFiles.length; index += 1) {
				const file = this.filesManagement.backEndFiles[index];
				if (file.name === this.imgsPreview[indexArray].name) {
					this.filesManagement.deletedFiles.push(file);
					break;
				}
			}

			this.fileError = false;
			this.fileErrorMessage = '';
			this.files.splice(indexArray, 1);
			this.imgsPreview.splice(indexArray, 1);
		}
	},
	watch: {
		pubUpdData () {
			this.resetData();
			if (this.pubUpdData.trigger) {
				this.getPubData(this.pubUpdData.pubId);
				return;
			}

			this.pubExpand = false;
		},
		pubExpand () {
			if (!this.pubExpand && this.pubUpdData.trigger === true) {
				this.$emit('resetPubUpdData', this.pubUpdData.index);
			}
		}
	}
}
</script>
