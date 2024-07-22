<template>
    <v-container>
        <v-col cols="12" sm="12">
            <v-btn @click="handleAboutMe" small rounded color="accent">
                {{ message }}
            </v-btn>
            <p>{{ about }}</p>
        </v-col>
        <v-col cols="12" sm="12">
            <v-btn @click="handleLogout" small rounded color="accent">
                Выйти
            </v-btn>
        </v-col>
    </v-container>

</template>

<script>
import usersService from "@/services/users.service";
import localStorageService from "@/services/local-storage.service.js"

export default {
    data() {
        return {
            message: 'About me',
            about: ''
        }
    },
    methods: {
        async handleAboutMe() {
            try {
                const response = await usersService.getUserProfile();
                console.log(response);
                this.about = response;
            } catch (error) {
                console.log(error)
            }
        },
        handleLogout() {
            localStorageService.clearToken()
        }
    }
}
</script>

<style scoped></style>