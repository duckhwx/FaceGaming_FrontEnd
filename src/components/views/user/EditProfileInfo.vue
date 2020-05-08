<template>
	<v-container
	class="py-0 fill-height"
	fluid
	grid-list-xl>
		<v-layout
		justify-start>
			<v-flex
			class="py-0 black block"
			xs12>
				<v-row>
					<v-col
					cols="10"
					align-self="center"
					class="title d-flex justify-start pl-5">
						{{blockPresets.title}}
					</v-col>

					<v-col
					cols="2"
					class="title d-flex justify-end">
						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-btn
								v-on="on"
								small
								fab
								@click="alterComponent">
									<v-icon
									size="17">
										{{blockPresets.icon}}
									</v-icon>
								</v-btn>
							</template>
								<span>{{blockPresets.tooltipSpan}}</span>
						</v-tooltip>
					</v-col>
				</v-row>

				<v-divider
				class="grey darken-1"></v-divider>

				<v-slide-x-transition
				hide-on-leave>
					<v-container
					v-show="transition">
							<v-row>
								<v-col
								cols="3"
								class="d-flex justify-start pl-5 mb-1">
									Login
								</v-col>
								<v-col
								class="text--disabled d-flex justify-start"
								cols="9">
									{{username}}
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col
								class="d-flex justify-start pl-5 my-1"
								cols="3">
									Email
								</v-col>
								<v-col
								class="text--disabled d-flex justify-start"
								cols="9">
									{{email}}
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col
								class="d-flex justify-start pl-5 my-1"
								cols="3">
									Nome
								</v-col>
								<v-col
								class="text--disabled d-flex justify-start"
								cols="9">
									{{name}} {{lastName}}
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col
								class="d-flex justify-start pl-5 mt-1"
								cols="3">
									Pais
								</v-col>
								<v-col
								class="text--disabled d-flex justify-start"
								cols="9">
									{{country}}
								</v-col>
							</v-row>
					</v-container>
				</v-slide-x-transition>
				<v-slide-x-reverse-transition
				hide-on-leave>
					<v-flex
					v-show="transitionEdit"
					class="black"
					xs12>
						<v-form
						ref="formulario">
							<v-container>
								<v-row>
									<v-text-field
									filled
									dense
									rounded
									v-model="username"
									:rules="userRules"
									label="Usuário" />
								</v-row>
								<v-row>
									<v-text-field
									filled
									rounded
									dense
									v-model="email"
									:rules="emailRules"
									label="E-mail" />
								</v-row>
								<v-row>
									<v-text-field
									filled
									rounded
									dense
									v-model="name"
									:rules="nameRules"
									label="Primeiro Nome" />
								</v-row>
								<v-row>
									<v-text-field
									filled
									rounded
									dense
									v-model="lastName"
									:rules="lastNameRules"
									label="Último Nome" />
								</v-row>
								<v-row>
									<v-select
									filled
									rounded
									dense
									v-model="country"
									:rules="countryRules"
									:items="paises"
									label="País"
									/>
								</v-row>
								<v-row
								justify="end">
									<v-btn
									class="mt-4 mx-2"
									color="grey darken-4"
									@click="updateUserPassword"
									>Atualizar senha</v-btn>

									<v-btn
									class="mt-4 mx-2"
									color="grey darken-4"
									@click="updateUserData"
									>Atualizar Dados</v-btn>
								</v-row>
							</v-container>
						</v-form>
					</v-flex>
				</v-slide-x-reverse-transition>
				<v-divider
				class="grey darken-1"></v-divider>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data () {
		return {
			transition: true,
			transitionEdit: false,
			blockPresets: {
				title: 'Dados do Usuário',
				icon: 'fas fa-pen',
				tooltipSpan: 'Alterar Dados'
			},
			username: '',
			email: '',
			name: '',
			lastName: '',
			country: '',
			userRules: [
				v => !!v || 'Usuário requisitado',
				v => (v && v.length <= 24) || 'Usuário deve ter menos de 24 caracteres',
				v => (v && v.length >= 3) || 'Usuário deve ter mais de 6 caracteres'
			],
			emailRules: [
				v => !!v || 'E-mail requisitado',
				v => /.+@.+\..+/.test(v) || 'E-mail deve ser valido',
				v => (v && v.length <= 254) || 'E-mail deve ter menos de 64 caracteres',
				v => (v && v.length >= 10) || 'E-mail deve ter mais de 10 caracteres'
			],
			nameRules: [
				v => !!v || 'Nome requisitado',
				v => (v && v.length <= 24) || 'Nome deve ter menos de 24 caracteres'
			],
			lastNameRules: [
				v => !!v || 'Sobrenome requisitado',
				v => (v && v.length <= 24) || 'Sobrenome deve ter menos de 24 caracteres',
				v => (v && v.length >= 3) || 'Sobrenome deve ter mais de 6'
			],
			countryRules: [
				v => !!v || 'Pais requisitado',
				v => (v && v.length <= 60) || 'Pais deve ter menos de 24 caracteres'
			],
			paises: [
				'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola', 'Antiga e Barbuda',
				'Arábia Saudita', 'Argélia', 'Argentina', 'Arménia', 'Austrália', 'Áustria', 'Azerbaijão', 'Bahamas', 'Bangladexe',
				'Barbados', 'Barém', 'Bélgica', 'Belize',	'Benim', 'Bielorrússia',	'Bolívia',	'Bósnia e Herzegovina',	'Botsuana',
				'Brasil',	'Brunei',	'Bulgária', 'Burquina Faso',	'Burúndi',	'Butão',	'Cabo Verde',	'Camarões',	'Camboja',	'Canadá',
				'Catar',	'Cazaquistão',	'Chade',	'Chile',	'China',	'Chipre',	'Colômbia',	'Comores',	'Congo-Brazzaville',	'Coreia do Norte',
				'Coreia do Sul',	'Cosovo',	'Costa do Marfim',	'Costa Rica',	'Croácia',	'Cuaite',	'Cuba',	'Dinamarca',	'Dominica',
				'Egito',	'Emirados Árabes Unidos',	'Equador',	'Eritreia',	'Eslováquia',	'Eslovénia',	'Espanha',	'Estado da Palestina',
				'Estados Unidos',	'Estónia',	'Etiópia',	'Fiji',	'Filipinas',	'Finlândia',	'França',	'Gabão',	'Gâmbia',	'Gana',	'Geórgia',
				'Granada',	'Grécia',	'Guatemala',	'Guiana',	'Guiné',	'Guiné Equatorial',	'Guiné-Bissau',	'Haiti',	'Honduras',	'Hungria',
				'Iémen',	'Ilhas Marechal',	'Índia',	'Indonésia',	'Irão',	'Iraque',	'Irlanda',	'Islândia',	'Israel',	'Itália',	'Jamaica',
				'Japão',	'Jibuti',	'Jordânia',	'Laus',	'Lesoto',	'Letónia',	'Líbano',	'Libéria', 'Líbia',	'Listenstaine',	'Lituânia',
				'Luxemburgo',	'Macedónia',	'Madagáscar',	'Malásia',	'Maláui',	'Maldivas',	'Mali',	'Malta',	'Marrocos',	'Maurícia',
				'Mauritânia',	'México',	'Mianmar',	'Micronésia',	'Moçambique',	'Moldávia',	'Mónaco',	'Mongólia',	'Montenegro',	'Namíbia',
				'Nauru',	'Nepal',	'Nicarágua',	'Níger',	'Nigéria',	'Noruega',	'Nova Zelândia',	'Omã',	'Países Baixos',	'Palau',	'Panamá',
				'Papua Nova Guiné',	'Paquistão',	'Paraguai',	'Peru',	'Polónia',	'Portugal',	'Quénia',	'Quirguistão',	'Quiribáti',
				'Reino Unido',	'República Centro-Africana',	'República Checa',	'República Democrática do Congo',	'República Dominicana',
				'Roménia',	'Ruanda',	'Rússia',	'Salomão',	'Salvador',	'Samoa',	'Santa Lúcia',	'São Cristóvão e Neves',	'São Marinho',
				'São Tomé e Príncipe',	'São Vicente e Granadinas',	'Seicheles',	'Senegal',	'Serra Leoa',	'Sérvia',	'Singapura',	'Síria',
				'Somália',	'Sri Lanca',	'Suazilândia',	'Sudão',	'Sudão do Sul',	'Suécia',	'Suíça',	'Suriname',	'Tailândia',	'Taiuã',
				'Tajiquistão',	'Tanzânia',	'Timor-Leste',	'Togo',	'Tonga',	'Trindade e Tobago',	'Tunísia',	'Turcomenistão',	'Turquia',
				'Tuvalu',	'Ucrânia',	'Uganda',	'Uruguai',	'Usbequistão',	'Vanuatu',	'Vaticano',	'Venezuela',	'Vietname',	'Zâmbia',	'Zimbábue'
			],
			token: JSON.parse(localStorage.userData)
		};
	},
	mounted () {
		this.getProfileInfo();
	},
	methods: {
		alterComponent () {
			this.transition = !this.transition;
			this.transitionEdit = !this.transitionEdit;
			if (this.transition) {
				this.blockPresets = {
					title: 'Dados do Usuário',
					icon: 'fas fa-pen',
					tooltipSpan: 'Alterar Dados'
				}
				return;
			}

			this.blockPresets = {
				title: 'Alterar dados do usuário',
				icon: 'fas fa-arrow-left',
				tooltipSpan: 'Retornar'
			}
		},
		getProfileInfo () {
			this.$axios
				.get('http://localhost:8081/' + 'Profile/getProfileInfo', {
					headers: { token: this.token }
				})
				.then((response) => {
					if (response.data.error) {
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'red darken-4',
							message: response.data.message
						});
					}

					this.username = response.data.data.USERNAME;
					this.password = response.data.data.PASSWORD;
					this.name = response.data.data.NAME;
					this.lastName = response.data.data.LASTNAME;
					this.email = response.data.data.EMAIL;
					this.country = response.data.data.COUNTRY;
				})
		},
		updateUserData () {
			if (this.$refs.formulario.validate()) {
				let userObject = {
					username: this.username,
					email: this.email,
					name: this.name,
					lastName: this.lastName,
					country: this.country
				}
				this.$axios
					.post('http://localhost:8081/' + 'Profile/updateUserData', userObject, {
						headers: { token: this.token }
					})
					.then((response) => {
						console.log(response);
						if (response.data.error) {
							this.$emit('callSnackbar', {
								trigger: true,
								color: 'red darken-4',
								message: response.data.message
							});
							return;
						}

						this.alterComponent();
						this.$emit('callSnackbar', {
							trigger: true,
							color: 'dark',
							message: response.data.message
						});
					})
			}
		},
		updateUserPassword () {

		}
	}
};
</script>
