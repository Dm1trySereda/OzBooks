<template>
    <v-container>
        <v-col cols="12" sm="12">
            <v-btn @click="handleAboutMe" small rounded color="accent">
                {{ message }}
            </v-btn>
            <p>{{ about }}</p>
        </v-col>
    </v-container>

</template>

<script>
import usersService from "@/services/users.service";

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
                this.about = response;
            } catch (error) {
                console.log(error)
            }
        },
    }
}
</script>

<style scoped></style>