<template>
    <v-card class="login-page elevation-10">
        <v-tabs v-model="tab" grow>
            <v-tab key="0">{{ login }}</v-tab>
            <v-tab key="1">{{ signIn }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="0">
                <div class="form-container">
                    <LogInForm @success="handleLoginSuccess" :initialData="loginFormData" v-if="!showOtp" />
                    <OtpInputComponent @otp-success="handleOtpSuccess" v-else />


                </div>
            </v-tab-item>
            <v-tab-item key="1">
                <div class="form-container">
                    <SignInForm @success="handleSignInSuccess" />
                </div>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import LogInForm from '@/components/LogInForm.vue';
import SignInForm from '@/components/SignInForm.vue';
import OtpInputComponent from '@/components/OtpInputComponent.vue'


export default {
    name: 'MyComponent',
    data() {
        return {
            tab: 0,
            login: "Вход",
            signIn: "Регистрация",
            showOtp: false,
            loginFormData: {}
        };
    },
    components: {
        LogInForm,
        SignInForm,
        OtpInputComponent
    },
    methods: {
        handleLoginSuccess() {
            // Показываем OTP компонент после успешной аунтефикации
            this.showOtp = true;
        },
        handleSignInSuccess(userData) {
            // После успешной регитрации переключаем на вкладку логина и передаем данные
            this.loginFormData = userData;
            this.tab = 0

        },
        handleOtpSuccess() {
            // После успешного ввода кода отправляем пользователя на страницу, к которой он пытался получить доступ, или же на главную страницу
            const redirectUrl = this.$route.query.redirect || { name: 'home' };
            this.$router.replace(redirectUrl);

        },
    },


};
</script>

<style>
.v-messages__message {
    color: rgb(240, 104, 104) !important;
}

.error-messages-limited .v-messages__message {
    white-space: normal;
    word-wrap: break-word;
    max-width: 230px;
}

.login-page {
    width: 400px;
    margin: 0 auto;
    margin-top: 100px;
   
}

.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

}
</style>