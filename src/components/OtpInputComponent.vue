<template>
    <v-row justify="center">
        <v-col>
            <v-card class="elevation-12">
                <v-card-title class="text-center">
                    <h2>Enter OTP Code</h2>
                </v-card-title>
                <v-card-text>
                    <p>Enter the 6-digit login code from an authentication app</p>
                    <v-otp-input v-model="otp" @input="onFinish"></v-otp-input>
                    <v-alert v-if="error || success" :type="success ? 'success' : 'error'"  class="mt-3">
                        {{ error || 'OTP Code confirmed successfully!' }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import userService from '@/services/users.service.js';

export default {
    data() {
        return {
            otp: '',
            error: '',
            success: false
        };
    },
    methods: {
        async onFinish() {
            if (this.otp.length !== 6) {
                return;
            }

            this.error = '';
            this.success = false;

            const otpCode = {
                code: this.otp,
            };

            try {
                const response = await userService.confirmOtpCode(otpCode);
                if (response.status === 200) {
                    this.success = true;
                    this.$emit('otp-success');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.error = error.response.data.detail;
                } else {
                    this.error = error.response ? error.response.data.detail : 'An error occurred';
                }
            } finally {
                if (!this.success) {
                    this.otp = '';
                }
            }
        },
    },

}
</script>

<style>
.text-center {
    display: flex;
    justify-content: center;
}
</style>