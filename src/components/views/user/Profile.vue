<template>
<v-container class="zap">
	<v-layout
    class="mt-4"
    flex
    justify-center>
        <v-flex xs12 sm11>
            <v-card>
                <v-img
                :src="images.backImg"
                height="350"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                >
                    <v-row
                    align="end"
                    class="fill-height">
                        <div>
                            <v-col>
                                <v-avatar
                                class="ml-12"
                                color="grey darken-3"
                                size="120"
                                >
                                    <v-icon
                                    v-if="images.profImg === ''"
                                    size="50">
                                        fas fa-user
                                    </v-icon>
                                    <v-img
                                    v-else
                                    :src="images.profImg"
                                    >
                                    </v-img>
                                    <v-tooltip
                                    color="grey darken-3"
                                    bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                            class="mt-10 ml-11"
                                            dark
                                            fixed
                                            fab
                                            x-small
                                            v-on="on"
                                            @click="editProfDialog = true">
                                                <v-icon
                                                size="15">
                                                    fas fa-camera
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                            <span>Editar Imagem</span>
                                    </v-tooltip>
                                </v-avatar>
                            </v-col>
                        </div>
                            <v-col>
                                <v-card-title
                                class="display-1"
                                >
                                {{username}}
                                </v-card-title>
                            </v-col>
                            <v-col>

                            </v-col>
                    </v-row>
                </v-img>
            </v-card>
        </v-flex>
    </v-layout>

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

    <v-btn
    dark
    :to="editProfile">
        Alterar Perfil
    </v-btn>

    <v-dialog
    v-model="editProfDialog"
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
                    v-if="editImg.profImg === '' || !editImg.profImg"
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
                    :src="editImg.profImg"
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
                    v-if="editImg.backImg === '' || !editImg.backImg"
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
                    :src="editImg.backImg"
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
</v-container>
</template>
<script>
export default {
	data () {
		return {
			username: '',
			editProfile: '/editProfile',
			images: {
				profImg: '',
				backImg: ''
			},
			editImg: {
				profImg: '',
				backImg: '',
				files: [],
				profFile: '',
				backFile: ''
			},
			snackbar: false,
			snackbarColor: '',
			snackbarMessage: '',
			token: JSON.parse(localStorage.userData),
			editProfDialog: false
		}
	},
	mounted () {
		this.getProfileData();
	},
	methods: {
		getProfileData () {
			this.$axios
				.get('http://localhost:8081/' + 'Profile/getProfileData', {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						return;
					}
					console.log(response);
					const data = response.data;
					this.username = data.USERNAME;

					this.images.profImg = data.PROF_IMG;
					this.editImg.profImg = data.PROF_IMG;
					this.images.backImg = data.BACK_IMG;
					this.editImg.backImg = data.BACK_IMG;
				});
		},
		insertImages () {
			const decoded = this.$jwt(this.token);
			const userId = decoded.userData.ID;
			let array = [];
			for (let index = 0; index < this.editImg.files.length; index += 1) {
				const file = this.editImg.files[index];
				this.test(userId, file)
					.then((response) => {
						console.log(response);
					});
			}
			Promise.all(array)
				.then(() => {
				})
		},
		test (userId, file, callback) {
			let route = '';
			let formData = new FormData();

			if (file.type === 'back') {
				formData.append('image', file.img, file.img.name);
				route = 'Profile/setBackImg';
			}

			if (file.type === 'prof') {
				formData.append('image', file.img, file.img.name);
				route = 'Profile/setProfImg'
			}

			this.$axios
				.post('http://localhost:8081/' + route, formData, {
					headers: {
						token: this.token,
						path: userId
					}
				})
				.then((response) => {
					formData.delete('image');
					callback(response);
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
					this.editImg.profImg = fileReader.result;
				}

				if (event.target.name === 'backImage') {
					this.editImg.backImg = fileReader.result;
				}
			});
			fileReader.readAsDataURL(file)

			if (event.target.name === 'profImage') {
				this.editImg.files.push({
					type: 'prof',
					img: file
				});
				return;
			}

			this.editImg.files.push({
				type: 'back',
				img: file
			});
		}
	}
}
</script>
<style>
.v-dialog {
    overflow-y: scroll !important;
    overflow-x: hidden !important;
}
</style>
