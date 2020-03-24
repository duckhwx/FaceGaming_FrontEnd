<template>
	<v-container grid-list-xl>
		<v-layout row align-center justify-center class="margin-t50 margin-b50">
			<v-flex xs12 md8>
				<v-form ref="formulario">
					<v-container py-5>

					<v-flex class="text-left text-xl Letra">Perfil</v-flex>
					<v-expand-transition>
						<v-layout wrap py-0>
							<v-flex xs12 md5 px-8>
								<v-text-field dark
								v-show="disabled"
								v-model="user"
								:rules="userRules"
								label="Usuário" />
							</v-flex>

							<v-flex xs12 md7 px-8>
								<v-text-field dark
								v-show="disabled"
								v-model="email"
								:rules="emailRules"
								label="E-mail" />
							</v-flex>

							<v-flex xs12 md6 px-8>
								<v-text-field dark
								v-show="disabled"
								v-model="name"
								:rules="nameRules"
								label="Primeiro Nome" />
							</v-flex>

							<v-flex xs12 md6 px-8>
								<v-text-field dark
								v-show="disabled"
								v-model="lastName"
								:rules="lastNameRules"
								label="Último Nome" />
							</v-flex>

								<v-flex xs12 md6 px-8>
									<v-select
									v-show="disabled"
									v-model="country"
									:rules="countryRules"
									:items="paises"
									dark
									label="País"
									/>
								</v-flex>
								<v-flex>
								<v-btn
									v-show="disabled"
									class="white--text botao"
									color="grey darken-4"
									@click="updateUser"
								>Atualizar Dados</v-btn>
								</v-flex>
						</v-layout>
						</v-expand-transition>
					</v-container>
				</v-form>
			</v-flex>
		</v-layout>
		<v-layout row align-center justify-center class="margin-t50 margin-b50">
			<v-flex xs12 md8>
				<v-form ref="formulario">
					<v-container py-5>
						<v-expand-transition>
						<v-layout wrap py-0>
							<v-flex xs12 md5 px-8>
									<p class="Perfil" v-show="disabled1" dark
									>Usuário: {{user}}</p>
							</v-flex>
							<v-flex xs12 md7 px-8>
								<p class="Perfil" v-show="disabled1" dark
								>E-mail: {{email}}</p>
							</v-flex>

							<v-flex xs12 md6 px-8>
								<p class="Perfil" v-show="disabled1" dark
								>Nome: {{name}} {{lastName}}</p>
							</v-flex>

							<v-flex xs12 md6 px-8>
								<p class="Perfil" v-show="disabled1" dark
								>País de Origem: {{country}}</p>
							</v-flex>
						</v-layout>
						</v-expand-transition>
					</v-container>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data () {
		return {
			user: '',
			userRules: [
				v => !!v || 'Usuário requisitado',
				v => (v && v.length <= 24) || 'Usuário deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'Usuário deve ter mais de 6 caracteres'
			],
			email: '',
			emailRules: [
				v => !!v || 'E-mail requisitado',
				v => /.+@.+\..+/.test(v) || 'E-mail deve ser valido',
				v => (v && v.length <= 254) || 'E-mail deve ter menos de 64 caracteres',
				v => (v && v.length >= 10) || 'E-mail deve ter mais de 10 caracteres'
			],
			name: '',
			nameRules: [
				v => !!v || 'Nome requisitado',
				v => (v && v.length <= 24) || 'Nome deve ter menos de 24 caracteres'
			],
			lastName: '',
			lastNameRules: [
				v => !!v || 'Sobrenome requisitado',
				v => (v && v.length <= 24) || 'Sobrenome deve ter menos de 24 caracteres',
				v => (v && v.length >= 6) || 'Sobrenome deve ter mais de 6'
			],
			country: '',
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
			disabled1: true,
			disabled: false
		};
	},
	methods: {
		getUserData () {
			console.log(localStorage.userData)
			this.$axios.get('http://localhost:8081/' + 'Profile/getUserData',
				{headers: { token: JSON.parse(localStorage.userData) }})
				.then((response) => {
					let param = response.data.data.recordset[0.0]
					this.user = param.USERNAME
					this.email = param.EMAIL
					this.country = param.COUNTRY
					this.lastName = param.LASTNAME
					this.name = param.NAME
				})
		},
		desativar (value) {
			this.disabled1 = value
			this.disabled = !this.disabled1
		},
		atualizar () {
			if (this.disabled === true) {
				this.disabled = false
			}
			if (this.disabled1 === false) {
				this.disabled1 = true
			}
		},
		updateUser () {
			if (this.$refs.formulario.validate()) {
				let userObject = {
					user: this.user,
					email: this.email,
					name: this.name,
					lastName: this.lastName,
					game: this.game,
					country: this.country
				}
				this.$axios.post('http://localhost:8081/' + 'Profile', userObject,
					{headers: { token: JSON.parse(localStorage.userData) }})
					.then((response) => {
						this.atualizar();
					})
			}
		}
	},
	mounted () {
		this.getUserData();
	}
};
</script>

<style>
	.botao {
		margin-top: 6%
	};
	.Letra {
		font-size: 30px;
		font-family: Helvetica
	};
	.Perfil {
		font-size: 30px;
	};
</style>
