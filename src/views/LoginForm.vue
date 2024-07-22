<template>
    <v-card class="login-page">
        <v-tabs v-model="tab" grow>
            <v-tab key="0">{{ login }}</v-tab>
            <v-tab key="1">{{ signIn }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="0">
                <div class="form-container">
                    <LogInForm @success="handleLoginSuccess" v-if="!showOtp"/>
                    <div v-if="showOtp">
                        <OtpInputComponent @otp-success="handleOtpSuccess" @otp-failure="handleOtpFailure" />
                    </div>
                </div>
            </v-tab-item>
            <v-tab-item key="1">
                <div class="form-container">
                    <SignInForm />
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
            tab: null,
            login: "LOG IN",
            signIn: "SIGN IN",
            showOtp: false,
        };
    },
    components: {
        LogInForm,
        SignInForm,
        OtpInputComponent
    },
    methods: {
        handleLoginSuccess() {
            console.log("Authentication successful");
            // Показываем OTP компонент после успешной аунтефикации
            this.showOtp = true;
        },
        handleOtpSuccess() {
            // Действия после успешной проверки OTP
            console.log("OTP validation successful");

        },
        handleOtpFailure() {
            // Действия при неудачной проверки OTP
            console.log("OTP validation failed");

        }
    },


};
</script>

<style>
.login-page {
    width: 400px;
    margin: 0 auto;
}

.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

}
</style>