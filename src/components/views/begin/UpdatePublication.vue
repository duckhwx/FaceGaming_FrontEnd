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
                                                    <v-img :src="img" height="70" width="50">
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
		pubId: {
			type: Number
		},
		trigger: {
			type: Boolean,
			required: true
		}
	},
	data () {
		return {
			dataText: '',
			files: [],
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
					if (response.error) {
						console.log('deu bret');
					}
					console.log(response);
					this.dataText = response.data.TITLE;
					for (let index = 0; index < response.data.files.length; index++) {
						let fileIndex = response.data.files[index];
						let file = new File([fileIndex.BS64FILE], fileIndex.FILE_NAME, {
							type: fileIndex.FILE_TYPE,
							lastModified: new Date()
						});
						this.files.push(file);
						this.imgsPreview.push(fileIndex.BS64FILE);
					}
				});
		},
		updatePub () {
			if (this.$refs.pubForm.validate()) {
				const pubObject = {
					pubId: this.pubId,
					textfield: this.dataText
				};
				let formData = new FormData();

				this.$axios
					.post('http://localhost:8081/' + 'Publication/updatePubText', pubObject, {
						headers: {
							token: this.token
						}
					})
					.then((response) => {
						if (response.data.error) {
							console.log('Error updatePubText');
							return;
						}

						if (this.files.length > 0) {
							for (let index = 0; index < this.files.length; index += 1) {
								let file = this.files[index];
								formData.append('images', file, file.filename);
							}
						}

						this.$axios
							.post('http://localhost:8081/' + 'Publication/updatePubFiles', formData, {
								headers: {
									token: this.token,
									path: this.pubId
								}
							})
							.then((response) => {
								console.log(response);
								// if (response.data.status) {
								// 	this.snackbarColor = 'red'
								// 	this.message = response.data.message;
								// 	this.createPubMessage = true;
								// 	return;
								// }

								// this.message = response.data.message;
								// this.createPubMessage = true;
								// this.pubEdit = false;
							})

						console.log('done');
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
			console.log(eventFiles.length);
			if (eventFiles.length > 4 || this.files.length + eventFiles.length > 4) {
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
					this.imgsPreview.push(fileReader.result);
				});
				fileReader.readAsDataURL(eventFiles[index])

				this.fileError = false;
				this.fileErrorMessage = '';
			}
		},
		closeUpdPub () {
			this.dataText = '';
			this.files = [];
			this.pubExpand = false;
			this.$emit('resetTrigger');
			this.$emit('resetPubId');
			console.log(this.pubId);
		},
		reduceFile (index) {
			this.fileError = false;
			this.fileErrorMessage = '';
			this.files.splice(index, 1);
			this.imgsPreview.splice(index, 1);
		}
	},
	watch: {
		trigger () {
			if (this.trigger) {
				this.pubExpand = this.trigger;
			}
		},
		pubExpand () {
			if (!this.pubExpand) {
				this.$emit('changeUpdTrigger');
			}
		},
		pubId () {
			this.getPubData(this.pubId);
		}
	}
}
</script>
