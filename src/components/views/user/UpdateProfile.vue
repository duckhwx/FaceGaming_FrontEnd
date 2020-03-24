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

        <v-snackbar
        class="mt-7"
        v-model="snackbar"
        :color="snackbarColor"
        right
        top>
        {{snackbarMessage}}
        </v-snackbar>
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
		},
		token: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			dialogTrigger: false,
			editImg: {
				files: [
					{
						type: 'prof',
						img: ''
					},
					{
						type: 'back',
						img: ''
					}
				]
			},
			snackbar: false,
			snackbarColor: '',
			snackbarMessage: ''
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

			console.log(this.images);
			this.identifyInsertImage(userId)
			// .then((response) => {
			// 	for (let index = 0; index < response.length; index++) {
			// 		let resp = response[index];

			// 		if (resp.response.data.error) {
			// 			continue;
			// 		}

			// 		if (resp.type === 'prof') {
			// 			this.images.profImg = resp.response.data.data.img;
			// 			this.images.profImgName = resp.response.data.data.filename;
			// 			continue;
			// 		}
			// 		this.images.backImg = resp.response.data.data.img;
			// 		this.images.backImgName = resp.response.data.data.filename;
			// 	}
			// });
		},
		async identifyInsertImage (userId) {
			// let array = [];
			// let error = false;
			let route = '';
			let oldFileName = '';
			let formData = new FormData();
			// for (let index = 0; index < this.editImg.files.length; index += 1) {
			// 	const file = this.editImg.files[index];

			// 	if (file.img === '') {
			// 		continue;
			// 	}

			// 	if (file.type === 'back') {
			// 		formData.append('image', file.img, file.img.name);
			// 		oldFileName = this.images.backImgName;
			// 		route = 'Profile/setBackImg';
			// 	}

			// 	if (file.type === 'prof') {
			// 		formData.append('image', file.img, file.img.name);
			// 		oldFileName = this.images.profImgName;
			// 		route = 'Profile/setProfImg'
			// 	}

			// 	array.push(this.$axios
			// 		.post('http://localhost:8081/' + route, formData, {
			// 			headers: {
			// 				token: this.token,
			// 				path: userId,
			// 				fileName: oldFileName
			// 			}
			// 		}));
			// }
			formData.append('image', this.editImg.files[0].img, this.editImg.files[0].img.name);
			oldFileName = this.images.profImgName;
			route = 'Profile/setProfImg'
			console.log(formData.get('imageP'));
			this.$axios
				.post('http://localhost:8081/' + route, formData, {
					headers: {
						token: this.token,
						path: userId,
						fileName: oldFileName
					}
				})
				.then((response) => {
					// return response;
				})
			formData.delete('image');

			formData.append('image', this.editImg.files[1].img, this.editImg.files[1].img.name);
			oldFileName = this.images.backImgName;
			route = 'Profile/setBackImg'

			this.$axios
				.post('http://localhost:8081/' + route, formData, {
					headers: {
						token: this.token,
						path: userId,
						fileName: oldFileName
					}
				})
				.then((response) => {
					console.log('a', response);
					// return response;
				})

			// if (error) {
			// 	this.snackbar = true;
			// 	this.snackbarColor = 'red';
			// 	this.snackbarMessage = 'Houve um erro em alterar a imagem'
			// }

			// this.snackbar = 'dark'
			// this.snackbar = true;
			// this.snackbarMessage = 'Imagens Alteradas'
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
				this.snackbar = true;
				this.snackbarColor = 'error';
				this.snackbarMessage = 'Arquivo Invalido';
				return;
			}

			if (!fileTypes.includes(fileType)) {
				this.snackbar = true;
				this.snackbarColor = 'error';
				this.snackbarMessage = 'Formato invalido, apenas permitido (.jpg, .gif, .png)';
				return;
			}

			if (file.size > 1000000) {
				this.snackbar = true;
				this.snackbarColor = 'error';
				this.snackbarMessage = 'Tamanho maior que 10 MB';
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
				this.editImg.files[0] = {
					type: 'prof',
					img: file
				};
				return;
			}

			this.editImg.files[1] = {
				type: 'back',
				img: file
			};
		}
	}
}
</script>
