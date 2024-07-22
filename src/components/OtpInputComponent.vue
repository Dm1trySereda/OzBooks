<template>
    <div>
        <div class="ma-auto position-relative" style="max-width: 300px">
            <v-otp-input v-model="otp" :disabled="loading" @finish="onFinish"></v-otp-input>
            <v-overlay absolute :value="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-overlay>
        </div>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
            {{ text }}
        </v-snackbar>
    </div>
</template>

<script>
import { confirmOtpCode } from '@/services/api.service.js';

export default {
    data() {
        return {
            loading: false,
            snackbar: false,
            snackbarColor: 'default',
            otp: '',
            text: '',
        };
    },
    methods: {
        onFinish() {
            this.loading = true
            const otpCode = this.otpCode.toString().padStart(6, '0')
            confirmOtpCode(otpCode)
                .then(response => {
                    if (response.status.code == 200) {
                        console.log("Success")
                        setTimeout(() => {
                            this.loading = false
                            this.snackbarColor = (response.status.code == 200) ? 'success' : 'warning'
                            this.text = `Processed OTP with "${response}" (${this.snackbarColor})`
                            this.snackbar = true
                        }, 3500)
                    }

                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        console.log("Error: " + error.response)
                        this.snackbarColor = 'error';
                        this.text = 'Error occurred during OTP processing';
                        this.snackbar = true;
                    }
                });

        },
    },
}
</script>

<style scoped>
.position-relative {
    position: relative;
}
</style>