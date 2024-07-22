<template>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="handleSubmit">
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="login" @input="handleInputSubmit" :rules="[rules.required]"
                        :error-messages="loginErrorMessages" label="Login" placeholder="Enter your login" dense />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="password" @input="handleInputSubmit" @keydown.enter="handleSubmit"
                        :rules="[rules.required]" :error-messages="passwordErrorMessages"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                        name="input-10-1" label="Password" placeholder="Enter your password"
                        @click:append="show = !show" dense />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn @click="handleSubmit" :loading="loading" class="custom-button" small rounded color="accent">
                        <template v-if="!loading">
                            LOG IN
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate size="24"></v-progress-circular>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn class="google-button" :href="googleAuthUrl" rounded>
                        Continue with Google
                        <img src="@/assets/google-logo.png" width="20px" alt="Google Icon" class="google-icon" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import userService from '@/services/users.service.js';

export default {

    name: 'LogInForm',
    props: {
        initialData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            googleRedirectUrl: process.env.VUE_APP_GOOGLE_REDIRECT_URL,
            show: false,
            loading: false,
            login: this.initialData.username || '',
            password: this.initialData.password || '',
            valid: false,
            loginErrorMessages: [],
            passwordErrorMessages: [],
            rules: {
                required: value => !!value || 'Required.',
            }
        }
    },
    computed: {
        googleAuthUrl() {
            // Переходим на страницу авторизации через Google OAuth
            return `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=${this.googleClientId}&redirect_uri=${this.googleRedirectUrl}&scope=openid%20profile%20email&access_type=offline&service=lso&o2v=1&ddm=0&flowName=GeneralOAuthFlow`;

        }

    },
    watch: {
        initialData: {
            handler(newValue) {
                this.login = newValue.username || '';
                this.password = newValue.password || '';
            },
            immediate: true,
            deep: true
        }
    },

    methods: {
        async handleSubmit() {
            this.loading = true;
            // Проверка валидности формы
            if (this.$refs.form.validate()) {
                const userData = {
                    username: this.login,
                    password: this.password
                };
                try {
                    const response = await userService.logInUser(userData)
                    if (response.status === 200) {
                        // Эмитируем событие после успешного ответа от сервера
                        this.$emit('success', userData);

                        // Очищаем поля формы
                        this.login = '';
                        this.password = '';
                    }
                }
                catch (error) {
                    // Если пришла ошибка от сервера
                    if (error.response && error.response.status === 401) {
                        this.passwordErrorMessages.push('Invalid login credentials. Please try again.');
                    } else {
                        console.error(error.response ? error.response.data : error.message);
                    }

                }
                finally {
                    // Сброс состояния загрузки после выполнения запроса
                    this.loading = false;
                }

            } else {
                if (!this.login) this.loginErrorMessages.push('Login is required');
                if (!this.password) this.passwordErrorMessages.push('Password is required');
                // Сброс состояния загрузки в случае невалидной формы
                this.loading = false;
            }
        },
        handleInputSubmit() {
            this.loginErrorMessages = [];
            this.passwordErrorMessages = [];
        },


    },
}

</script>

<style>
.custom-button {
    background-color: #ff5722;
    color: white;
}

.google-button .v-btn__content {
    font-size: 12px;
}
</style>
