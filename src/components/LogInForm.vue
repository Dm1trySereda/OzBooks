<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="login" @input="handleInputSubmit" :rules="rules.loginRules"
                        :error-messages="loginErrorMessages" label="Login" placeholder="Enter your login" dense>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="password" @input="handleInputSubmit" :rules="rules.passwordRules"
                        :error-messages="passwordErrorMessages" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'" name="input-10-1" label="Password"
                        placeholder="Enter your password" @click:append="show = !show" dense>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn @click="handleSubmit" small>Login</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import { logInUser } from '@/services/api.service.js';


export default {
    name: 'LogInForm',
    data() {
        return {
            show: false,
            login: '',
            password: '',
            valid: false,
            loginErrorMessages: [],
            passwordErrorMessages: [],
            rules: {
                loginRules: [
                    v => !!v || 'Login is required',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                ],
            }


        }
    },
    methods: {
        handleSubmit() {
            // Проверка валидности формы
            if (this.$refs.form.validate()) {
                const userData = {
                    username: this.login,
                    password: this.password
                };
                logInUser(userData)
                    .then(response => {
                        // Сохраняем токен в localStorage
                        const { accessToken, tokenType } = response.data;
                        localStorage.setItem('token', `${tokenType} ${accessToken}`);

                        // Эмитируем событие после успешного ответа от сервера
                        this.$emit('success');

                        // Очищаем поля формы
                        this.login = '';
                        this.password = '';
                    })
                    .catch(error => {
                        // Если пришла ошибка от сервера
                        if (error.response && error.response.status === 401) {
                            this.passwordErrorMessages.push('Invalid login credentials. Please try again.');
                        } else {
                            console.error(error.response ? error.response.data : error.message);
                        }
                    });
            } else {
                if (!this.login) this.loginErrorMessages.push('Login is required');
                if (!this.password) this.passwordErrorMessages.push('Password is required');

            }
        },
        handleInputSubmit() {
            this.loginErrorMessages = [];
            this.passwordErrorMessages = [];
        }
    }
}
</script>

<style>
.v-messages__message {
    color: red !important;
}

#createnew {
    font-size: 14px;
    margin: 10px 10px 10px 30px;
}
</style>