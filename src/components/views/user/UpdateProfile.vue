<template>
    <div>
        <input
        type="file"
        ref="profImage"
        name="profImage"
        style="display: none"
        @change="filePicked">

        <input
        type="file"
        ref="backImage"
        name="backImage"
        style="display: none"
        @change="filePicked">

        <v-dialog
        v-model="dialogTrigger"
        scrollable
        max-width="700px">
            <v-card
            height="790">
                <v-layout
                class="py-5"
                justify-center
                row>
                    <v-col
                    cols="10">
                    <div
                    class="text-left mx-2 my-2 title">Foto de Perfil</div>
                        <v-card
                        v-if="editImgPreview.profImg === '' || !editImgPreview.profImg"
                        color="grey darken-4"
                        height="250"
                        >
                            <v-card-title
                            class="d-flex justify-end">
                                <v-btn
                                    small
                                    @click="pickFile('profImage')">
                                        Alterar Foto
                                </v-btn>
                            </v-card-title>

                            <v-icon
                            class="mt-8"
                            size="80">
                                fas fa-user
                            </v-icon>
                        </v-card>

                        <v-img
                        v-else
                        :src="editImgPreview.profImg"
                        height="270"
                        >
                            <v-col
                            cols="12">
                                <v-layout
                                justify-end>
                                        <v-btn
                                        small
                                        @click="pickFile('profImage')">
                                            Alterar foto
                                        </v-btn>
                                </v-layout>
                            </v-col>
                        </v-img>
                    </v-col>
                    <v-col
                    cols="10">
                    <div
                    class="text-left mx-2 my-2 title">Foto de Capa</div>
                        <v-card
                        v-if="editImgPreview.backImg === '' || !editImgPreview.backImg"
                        color="grey darken-4"
                        height="250"
                        >
                            <v-card-title
                            class="d-flex justify-end">
                                <v-btn
                                    small
                                    @click="pickFile('BackImage')">
                                        Alterar Capa
                                </v-btn>
                            </v-card-title>

                            <v-icon
                            class="mt-8"
                            size="80">
                                fas fa-camera
                            </v-icon>
                        </v-card>
                        <v-img
                        v-else
                        :src="editImgPreview.backImg"
                        height="270"
                        >
                            <v-col
                            cols="12">
                                <v-layout
                                justify-end>
                                        <v-btn
                                        small
                                        @click="pickFile('BackImage')">
                                            Alterar Capa
                                        </v-btn>
                                </v-layout>
                            </v-col>
                        </v-img>
                    </v-col>
                </v-layout>
                <v-card-actions
                class="mb-2 mr-3">
                    <v-spacer></v-spacer>
                    <v-btn
                    @click="insertImages">
                        Confirmar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
	props: {
		editProfDialog: {
			type: Boolean,
			required: true
		},
		images: {
			type: Object,
			required: true
		},
		editImgPreview: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			dialogTrigger: false,
			editImg: {
				profile: '',
				background: ''
			},
			token: JSON.parse(localStorage.userData)
		}
	},
	watch: {
		editProfDialog () {
			this.dialogTrigger = this.editProfDialog;
		},
		dialogTrigger () {
			if (!this.dialogTrigger) {
				this.$emit('changeDialogStatus')
			}
		}
	},
	methods: {
		insertImages () {
			const decoded = this.$jwt(this.token);
			const userId = decoded.userData.ID;
			let error = false;

			if (this.editImg.profile === '' && this.editImg.background === '') {
				this.$emit('callSnackbar', {
					trigger: true,
					color: 'red',
					message: 'Insira uma imagem'
				});
				return;
			}

			this.insertProfileImg(this.editImg.profile, userId)
				.then((respProf) => {
					this.editImg.profile = '';

					this.insertBackgroundImg(this.editImg.background, userId)
						.then((respBack) => {
							this.editImg.background = '';
							this.$emit('callSnackbar', {
								trigger: true,
								color: 'dark',
								message: 'Imagens atualizadas com sucesso'
							});
							this.$emit('selectProfImages');
							this.dialogTrigger = false;
						})
						.catch((responseErr) => {
							error = true;
						})
				})
				.catch((responseErr) => {
					error = true;
				});

			if (error) {
				this.$emit('callSnackbar', {
					trigger: true,
					color: 'red',
					message: 'Houve um erro ao atualizar as imagens de Perfil/Capa'
				});
			}
		},
		insertProfileImg (file, userId) {
			return new Promise((resolve, reject) => {
				if (file === '') {
					resolve('');
				}

				let formData = new FormData();
				const oldFileName = this.images.profImgName;

				formData.append('image', file, file.name);

				this.$axios
					.post('http://localhost:8081/' + 'Profile/setProfImg', formData, {
						headers: {
							token: this.token,
							path: userId,
							fileName: oldFileName
						}
					})
					.then((response) => {
						if (response.data.error) {
							reject(response);
						}

						resolve(response);
					});
			});
		},
		insertBackgroundImg (file, userId) {
			return new Promise((resolve, reject) => {
				if (file === '') {
					resolve('');
				}

				let formData = new FormData();
				const oldFileName = this.images.backImgName;

				formData.append('image', file, file.name);

				this.$axios
					.post('http://localhost:8081/' + 'Profile/setBackImg', formData, {
						headers: {
							token: this.token,
							path: userId,
							fileName: oldFileName
						}
					})
					.then((response) => {
						if (response.data.error) {
							reject(response);
						}

						resolve(response);
					});
			});
		},
		pickFile (type) {
			if (type === 'profImage') {
				this.$refs.profImage.click();
				return;
			}

			this.$refs.backImage.click();
		},
		filePicked (event) {
			if (event.target.files.length < 1) {
				return;
			}

			let file = event.target.files[0];
			let fileTypes = ['png', 'jpeg', 'gif'];
			let fileType = file.type.split('/').pop();

			if (file.name.lastIndexOf('.') <= 0) {
				this.$emit('callSnackbar', {
					trigger: true,
					color: 'red',
					message: 'Arquivo Invalido'
				});
				return;
			}

			if (!fileTypes.includes(fileType)) {
				this.$emit('callSnackbar', {
					trigger: true,
					color: 'red',
					message: 'Formato invalido, apenas permitido (.jpg, .gif, .png)'
				});
				return;
			}

			if (file.size > 1000000) {
				this.$emit('callSnackbar', {
					trigger: true,
					color: 'red',
					message: 'Tamanho maior que 10 MB'
				});
				return;
			}

			let fileReader = new FileReader();
			fileReader.addEventListener('load', () => {
				if (event.target.name === 'profImage') {
					this.editImgPreview.profImg = fileReader.result;
				}

				if (event.target.name === 'backImage') {
					this.editImgPreview.backImg = fileReader.result;
				}
			});
			fileReader.readAsDataURL(file)

			if (event.target.name === 'profImage') {
				this.editImg.profile = file;
				return;
			}

			this.editImg.background = file;
		}
	}
}
</script>
