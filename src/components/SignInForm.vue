<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="login" @input="handleInputSubmit" :rules="[rules.required]"
                        :error-messages="loginErrorMessages" label="Login" placeholder="Enter your login" dense
                        class="error-messages-limited">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="password" @input="handleInputSubmit"
                        :rules="[rules.required, rules.password, rules.matchPassword]"
                        :error-messages="passwordErrorMessages" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'" name="input-10-1" label="Password"
                        placeholder="Enter your password" @click:append="toggleShowPassword" dense
                        class="error-messages-limited">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="secondPassword" @input="handleInputSubmit"
                        :rules="[rules.required, rules.matchPassword]" :error-messages="secondPasswordErrorMessages"
                        :append-icon="showSecondPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showSecondPassword ? 'text' : 'password'" name="input-10-1" label="Repeat password"
                        placeholder="Repeat your password" @click:append="toggleShowSecondPassword" dense
                        class="error-messages-limited">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field v-model="fullName" @input="handleInputSubmit" :rules="[rules.required]"
                        :error-messages="fullNameErrorMessages" label="Full Name" placeholder="Enter your full name"
                        dense class="error-messages-limited">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field v-model="email" @input="handleInputSubmit" @keydown.enter="handleSubmit"
                        :rules="[rules.required, rules.email]" autocomplete="email" label="E-mail"
                        placeholder="Enter your email address" :error-messages="emailErrorMessages" dense
                        class="error-messages-limited">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn @click="handleSubmit" :loading="loading" class="custom-button" small rounded  color="accent">
                        <template v-if="!loading">
                            SIGN IN
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate size="24"></v-progress-circular>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import userService from '@/services/users.service.js';

export default {
    name: 'SignInForm',
    data() {
        return {
            showPassword: false,
            showSecondPassword: false,
            loading: false,
            login: '',
            password: '',
            secondPassword: '',
            fullName: '',
            email: '',
            valid: false,
            loginErrorMessages: [],
            passwordErrorMessages: [],
            secondPasswordErrorMessages: [],
            fullNameErrorMessages: [],
            emailErrorMessages: [],
            rules: {
                required: value => !!value || 'Required.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
                password: value => {
                    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
                    return pattern.test(value) || 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number'
                },
                matchPassword: (value) => {
                    return value === this.password || 'Passwords do not match.'
                }
            }
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            if (this.$refs.form.validate()) {
                const userData = {
                    username: this.login,
                    password: this.password,
                    fullName: this.fullName,
                    email: this.email
                };
                try {
                    const response = await userService.signInUser(userData);
                    if (response.status == 201) {
                         // Эмитируем событие после успешного ответа от сервера
                        this.$emit('success', userData);
                        // Очищаем поля формы
                        this.login = '';
                        this.password = '';
                        this.secondPassword = '';
                        this.fullName = '';
                        this.email = '';
                        this.showPassword = false;
                        this.showSecondPassword = false;
                    }

                }
                catch (error) {
                    if (error.response) {
                        if (error.response.data.detail === 'User with this username already exists') {
                            this.loginErrorMessages.push('This user already exists')
                        } else if (error.response.data.detail === 'This email address is already in use maybe you need to auth') {
                            this.emailErrorMessages.push('This email already exists')
                        } else {
                            console.error(error.response.data);
                        }
                    }
                }
                finally {
                    this.loading = false;
                }

            } else {
                if (!this.login) this.loginErrorMessages.push('Login is required');
                if (!this.password) this.passwordErrorMessages.push('Password is required');
                if (!this.secondPassword) this.secondPasswordErrorMessages.push('Second password is required');
                if (!this.fullName) this.fullNameErrorMessages.push('Full name is required');
                if (!this.email) this.emailErrorMessages.push('Email is required');
                // Сброс состояния загрузки в случае невалидной формы
                this.loading = false;
            }
        },
        handleInputSubmit() {
            this.loginErrorMessages = [];
            this.passwordErrorMessages = [];
            this.secondPasswordErrorMessages = [];
            this.fullNameErrorMessages = [];
            this.emailErrorMessages = [];
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        toggleShowSecondPassword() {
            this.showSecondPassword = !this.showSecondPassword;
        }
    }
}
</script>

<style></style>
