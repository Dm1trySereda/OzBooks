<template>
    <v-app>
        <v-container>
            <v-app-bar app scroll-behavior="hide" :elevation="7" class="header-app">
                <v-row>
                    <v-col cols="auto">
                        <v-avatar @click="handleHome" class="logo">
                            <img src="@/assets/brand.svg" alt="Brand">
                        </v-avatar>
                    </v-col>
                    <v-col cols="mt-3" flex-grow-1>
                        <v-text-field class="mx-3" label="Введите название книги" flat hide-details
                            prepend-icon="mdi-magnify" solo v-model="search" @input="searchBooks">
                        </v-text-field>
                    </v-col>
                    <v-divider class="header-divider" vertical></v-divider>
                    <v-col cols="auto" class="d-flex flex-column align-center login-container" @click="handleLogin"
                        v-if="!authorized">
                        <v-icon class="login-icon">mdi-account-outline</v-icon>
                        <span class="login-text">Войти</span>
                    </v-col>
                    <v-col cols="auto" class="d-flex flex-column align-center login-container" @click="handleProfile"
                        v-if="authorized">
                        <v-icon class="login-icon">mdi-account-outline</v-icon>
                        <span class="login-text">Профиль</span>
                    </v-col>
                    <v-col cols="auto" class="d-flex flex-column align-center login-container" v-if="authorized">
                        <v-dialog v-model="dialog" width="500">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="login-icon" v-bind="attrs" v-on="on">mdi-logout-variant</v-icon>
                                <span class="login-text" v-bind="attrs" v-on="on">Выйти</span>
                            </template>
                            <v-card>
                                <v-card-title class="text-h6 grey lighten-2 text-center ">
                                    Выход
                                </v-card-title>

                                <v-card-text class="text-justify text-center font-weight-regular" id="card-text">
                                    Вы действительно хотите выйти?
                                </v-card-text>
                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn depressed color="error" text @click="dialog = false">
                                        Нет
                                    </v-btn>
                                    <v-btn depressed color="success" text @click="handleLogout">
                                        Да
                                    </v-btn>
                                </v-card-actions>
                            </v-card>


                        </v-dialog>

                    </v-col>


                </v-row>
            </v-app-bar>
        </v-container>
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>

        <!-- <v-footer app dark padless>
            <v-card flat tile class=" indigo lighten-1 white--text text-center">
                            <v-card-text>
                                <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon>
                                    <v-icon size="24px">
                                        {{ icon }}
                                    </v-icon>
                                </v-btn>
                            </v-card-text>

                            <v-card-text class="white--text pt-0">
                                Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus
                                commodo interdum.
                                Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa
                                consectetur
                                dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia
                                malesuada.
                                Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu
                                ipsum vel
                                diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis
                                parturient montes,
                                nascetur ridiculus mus.
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-text class="white--text">
                                {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
                            </v-card-text>
                            </v-card>
                            </v-footer> -->
    </v-app>
</template>

<script>
import localStorageService from "@/services/local-storage.service.js";
import { mapActions, mapMutations } from 'vuex';
export default {
    data: () => ({
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
        dialog: false,
        authorized: localStorageService.getToken() || localStorageService.getGoogleAccessToken() ? true : false,
        search: ''
    }),
    methods: {
        ...mapActions('books', ['searchBookForTitle', 'fetchBooks']),
        ...mapMutations('books', ['SET_BOOK_TITLE', 'SET_FILTERS']),
        ...mapMutations({
            setBooks: 'setBooks',
        }),
        handleHome() {
            this.$router.push({ name: 'home' });
            window.location.reload();

        },
        handleLogin() {
            if (!localStorageService.getToken() || !localStorageService.getGoogleAccessToken()) {
                this.$router.push({ name: 'login' });
            }

        },
        handleLogout() {

            if (localStorageService.getToken() || localStorageService.getGoogleAccessToken()) {
                localStorageService.clearToken()
            }
            this.dialog = false
            this.authorized = false
        },
        handleProfile() {
            if (!localStorageService.getToken() || !localStorageService.getGoogleAccessToken()) {
                this.$router.push({ name: 'my-profile' });
            }

        },
        async searchBooks() {
            if (this.search.length > 4) {
                this.SET_BOOK_TITLE(this.search)
                this.searchBookForTitle()
            } else if (this.search.length == 0) {
                this.SET_BOOK_TITLE(this.search)
                this.SET_FILTERS(true)
                this.fetchBooks()
            }


        },
    },
}
</script>

<style scoped>
.header-app {
    max-width: 1380px;
    margin-left: auto;
    margin-right: auto;
}

.header-divider {
    height: 100%;
}

.login-container {
    margin-top: 5px;
    cursor: pointer;
    text-align: center;
}

.login-icon {
    font-size: 24px;
}

.login-text {
    color: #8f8f8f;
    font-size: 14px;
}

.logo:hover {
    cursor: pointer;
}

.login-container:hover .login-text {
    color: black;
}

.login-container:hover {
    cursor: pointer;
}

#card-text {
    margin-top: 20px;
}
</style>