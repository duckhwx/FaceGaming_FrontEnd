<template>
<div>
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
                <v-container
                class="fill-height coverContainer">
                    <v-row
                    justify="end">
                        <v-btn
                        dark
                        to="/editProfileInfo">
                            Alterar Perfil
                        </v-btn>
                    </v-row>
                    <v-row
                    align="end">
                        <v-col
                        cols="2">
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
                        <v-col
                        cols="10">
                            <v-card-title
                            class="display-1"
                            >
                            {{username}}
                            </v-card-title>
                        </v-col>
                    </v-row>
                </v-container>
                </v-img>
            </v-card>
        </v-flex>
    </v-layout>

    <updateProfile
    @selectProfImages="getProfileData()"
    @callSnackbar="callSnackbar"
    v-on:changeDialogStatus="editProfDialog = false"
    :editProfDialog="editProfDialog"
    :images="images"
    :editImgPreview="editImgPreview"></updateProfile>
</div>
</template>
<script>
import updateProfile from '@/components/views/user/UpdateProfile'

export default {
	components: {
		updateProfile: updateProfile
	},
	data () {
		return {
			username: '',
			images: {
				profImg: '',
				profImgName: '',
				backImg: '',
				backImgName: ''
			},
			editImgPreview: {
				profImg: '',
				backImg: ''
			},
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
					const data = response.data;
					this.username = data.USERNAME;

					this.images.profImg = data.PROF_IMG;
					this.images.profImgName = data.PROF_IMG_NAME;
					this.images.backImg = data.BACK_IMG;
					this.images.backImgName = data.BACK_IMG_NAME;
					this.editImgPreview.profImg = data.PROF_IMG;
					this.editImgPreview.backImg = data.BACK_IMG;
				});
		},
		callSnackbar (presets) {
			this.$emit('callSnackbar', presets);
		}
	}
}
</script>
<style>
.v-dialog {
    overflow-y: scroll !important;
    overflow-x: hidden !important;
}
.coverContainer {
    align-items: unset !important;
}
</style>
