<template>
    <v-container class="container-profile">
        <v-card class="d-inline-flex pa-10">
            <div>
                <v-card-title class=" d-flex justify-center">
                    <span class="text-h5">Мой профиль</span>
                </v-card-title>
                <v-card-title class=" d-flex justify-center"> <v-avatar size="100">
                        <img src="@/assets/profile.png" alt="Profile Image">
                    </v-avatar></v-card-title>
                <v-col class="profile-fields">
                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field :value="firstName" label="Имя" outlined readonly dense></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field :value="secondName" label="Фамилия" outlined readonly dense></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field :value="thirdName" label="Отчество" outlined readonly dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field :value="aboutMe.username" label="Логин" outlined readonly
                                dense></v-text-field></v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-text-field :value="aboutMe.email" label="Эл. почта" outlined readonly
                                dense></v-text-field></v-col>
                    </v-row>
                </v-col>
                <a class="go-back" @click="GoBack">Назад</a>
            </div>
        </v-card>


    </v-container>

</template>

<script>
import usersService from "@/services/users.service";
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            message: 'About me',
            aboutMe: {
                id: 1,
                fullName: 'Иванов Иван Иванович',
                username: 'ivanov_ivan_ivanovich',
                email: 'ivanov@example.com'
            }
        }
    },
    created() {
        this.handleAboutMe()
    },
    computed: {
        ...mapGetters('routes', ['getHistoryRoute']),
        firstName() {
            return this.aboutMe.fullName.split(' ')[0]
        },
        secondName() {
            return this.aboutMe.fullName.split(' ')[1]
        },
        thirdName() {
            return this.aboutMe.fullName.split(' ')[2]
        }
    },

    methods: {
        ...mapActions('routes', ['updateHistoryRoute', 'removeLastRoute']),
        async handleAboutMe() {
            try {
                const response = await usersService.getUserProfile();
                this.aboutMe = response;

            } catch (error) {
                console.error(error)
            }
        },
        GoBack() {
            if (this.getHistoryRoute.length > 0) {
                const lastRoute = this.getHistoryRoute[this.getHistoryRoute.length - 1];
                this.$router.push(lastRoute.fullPath)
            } else {
                this.$router.push({ name: 'home' })
            }
        }
    }
}
</script>

<style scoped>
.profile-fields {
    margin: 20px 0px 20px 40px;
}

.go-back {
    text-decoration-line: none;
}
</style>