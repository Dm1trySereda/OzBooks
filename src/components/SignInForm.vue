<template>
    <form class="login-form" @submit.prevent="handleSubmit">
        <h2>SIGN IN</h2>
        <div :class="{ 'error': loginError }">
            <label for="login">Login</label>
            <input type="text" id="login" v-model="login" required />
            <span v-if="loginError" class="error-message">{{ loginErrorMessage }}</span>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
        </div>
        <div>
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="fullName" />
        </div>
        <div :class="{ 'error': emailError }">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
            <span v-if="emailError" class="error-message">{{ emailErrorMessage }}</span>
        </div>
        <button type="submit">SIGN IN</button>
        <p>Already have an account? <router-link id="signin"  to='/users/signin'>Sign In</router-link></p>
    </form>
</template>

<script>
import { signInUser } from '@/services/api.service.js';
export default {
    name: 'SignInForm',
    data() {
        return {
            login: '',
            password: '',
            fullName: '',
            email: '',
            loginError: false,
            loginErrorMessage: '',
            emailError: false,
            emailErrorMessage: ''
        };
    },
    methods: {
        handleSubmit() {
            const userData = {
                username: this.login,
                password: this.password,
                fullName: this.fullName,
                email: this.email
            };
            signInUser(userData)
                .then(response => {
                    console.log('User', response.data);
                    this.loginError = false;
                    this.loginErrorMessage = '';
                    this.emailError = false;
                    this.emailErrorMessage = '';
                    // Очистка полей после успешной отправки
                    this.login = '';
                    this.password = '';
                    this.fullName = '';
                    this.email = '';
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.data.detail === 'User with this username already exists') {
                            this.loginError = true;
                            this.loginErrorMessage = 'This user already exists';
                            // Очистка поля ошибок
                            this.emailError = false;
                            this.emailErrorMessage = '';


                        } else if (error.response.data.detail === 'This email address is already in use maybe you need to auth') {
                            this.emailError = true;
                            this.emailErrorMessage = 'This email already exists';
                            // Очистка поля ошибок
                            this.loginError = false;
                            this.loginErrorMessage = '';

                        } else {
                            console.error(error.response.data);
                        }
                    } else {
                        console.error(error.message);
                    }
                });
        }
    }
}
</script>

<style scoped>
.login-form {
    text-align: left;
    margin: 20px auto;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.login-form p {
    font-size: 12px;
}

.login-form #signin {
    text-decoration-line: none;
}
.login-form h2 {
    text-align: center;
    margin-bottom: 20px;
}

.login-form div {
    margin: 10px 0;
    position: relative;
}

.login-form label {
    display: block;
}

.login-form input {
    width: 93%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-form .error input {
    border: 1px solid red;
}

.login-form .error-message {
    color: red;
    font-size: 0.8em;
    position: absolute;
    top: 68%;
    left: 105%;
    transform: translateY(-50%);
    white-space: nowrap;
}

.login-form button {
    border-radius: 5px;
    padding: 10px 15px;
    background-color: #217ba5;
    color: white;
    border: none;
    cursor: pointer;
    width: 50%;
    margin-top: 10px;
}
</style>
