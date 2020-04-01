<template>
    <div>
        <v-expand-transition>
            <v-layout v-show="pubExpand" flex justify-center class="publications">
            <v-flex xs12 sm7>
                <v-card dark>
					<v-card-title>Criar Publicação</v-card-title>
                <v-divider></v-divider>

                <v-form ref="pubForm">
                    <v-container>
						<v-row>
							<v-col>
							<v-textarea
								v-model="dataText"
								class="textArea"
								:rules="textRules"
								counter
								outlined
								solo
								no-resize
								auto-grow
								label="Texto"
							></v-textarea>
							</v-col>
						</v-row>

						<v-row v-if="files.length > 0">
							<v-col>
								<v-card class="py-2" elevation>
									<v-layout justify-center>
										<v-flex
											xs6
											md12
											lg12
											v-for="(file, index) in files"
											:key="index"
											class="text-right px-2"
										>
											<v-layout justify-center>
												<v-img :src="filesImg[index]" height="70" width="50">
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
								<v-btn align="left" class="d-inline" @click="insertPub">Publicar</v-btn>
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

        <CreateBtn v-on:pubTrigger="createPub"></CreateBtn>
    </div>

</template>
<script>
import CreateBtn from '@/components/views/miscellaneous/CreateButton'
export default {
	components: {
		CreateBtn: CreateBtn
	},
	data () {
		return {
			data: 'a',
			token: JSON.parse(localStorage.userData),
			pubExpand: false,
			dataText: '',
			textRules: [
				v => !!v || 'Texto requisitado',
				v => v.length <= 500 || 'Máximo 500 caracteres'
			],
			files: [],
			filesImg: [],
			fileError: false,
			fileErrorMessage: ''
		}
	},
	mounted () {

	},
	methods: {
		insertPub () {
			if (this.$refs.pubForm.validate()) {
				let newObject = {
					textfield: this.dataText
				}

				this.$axios
					.post('http://localhost:8081/' + 'Publication/insertPub', newObject, {
						headers: {
							token: this.token
						}
					})
					.then((response) => {
						if (response.data.error) {
							this.$emit('callSnackbar', {
								trigger: true,
								color: 'red',
								message: response.data.message
							});
							return
						}

						if (this.files.length > 0) {
							this.uploadFile(response.data.data.ID);
							return;
						}

						this.$emit('callSnackbar', {
							trigger: true,
							color: 'dark',
							message: response.data.message
						});
						this.$refs.pubForm.reset();
						this.dataText = '';
						this.pubExpand = false;
					});
			}
		},
		uploadFile (path) {
			let formData = new FormData();

			for (let index = 0; index < this.files.length; index++) {
				formData.append('files', this.files[index], this.files[index].name);
			}

			this.$axios
				.post('http://localhost:8081/' + 'Publication/uploadFile', formData, {
					headers: {
						token: this.token,
						path: path
					}
				})
				.then((response) => {
					if (response.data.status) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red',
							message: response.data.message
						});
						return;
					}

					this.$emit('callSnackbar', {
						trigger: true,
						color: 'dark',
						message: response.data.message
					});
					this.pubExpand = false;
					this.files = [];
					this.filesImg = [];
				});
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

			if (eventFiles.length > 4) {
				this.fileError = true;
				this.fileErrorMessage = 'Máximo 4 Arquivos';
				return
			}
			for (let index = 0; index < eventFiles.length; index += 1) {
				if (eventFiles[index].name.lastIndexOf('.') <= 0) {
					return;
				}
				if (eventFiles[index].size >= 1000000) {
					this.fileError = true;
					this.fileErrorMessage = 'Tamanho do arquivo excedido (máximo 10 MB)';
					return;
				}

				this.files.push(eventFiles[index]);

				let fileReader = new FileReader();
				fileReader.addEventListener('load', () => {
					this.filesImg.push(fileReader.result);
				});
				fileReader.readAsDataURL(eventFiles[index])

				this.fileError = false;
				this.fileErrorMessage = '';
			}
		},
		reduceFile (index) {
			this.fileError = false;
			this.fileErrorMessage = '';
			this.files.splice(index, 1);
			this.filesImg.splice(index, 1);
		},
		createPub () {
			this.pubExpand = !this.pubExpand
			this.$vuetify.goTo(0, {
				duration: 500
			});
		}
	}
}
</script>
