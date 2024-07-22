<template>
    <v-container class="conatiner-books">
        <v-row>
            <v-navigation-drawer permanent style="width: 300px; margin-right: 50px;">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                          Сортировать по
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item v-for="item in sortItems" :key="item.text" link @click="handleSort(item.value)">
                        <v-list-item-content class="d-flex align-center justify-center">
                            <v-col>
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                            </v-col>
                            <v-col>
                                <v-icon v-if="sortBy === item.value">
                                    {{ orderAsc ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                                </v-icon>
                            </v-col>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <!-- <v-text-field class="mx-3" label="Search book by title" flat hide-details prepend-icon="mdi-magnify" solo
                v-model="search" @input="searchBooks">
            </v-text-field> -->
            <v-col v-for="book in searchhandler" :key="book.id" cols="12" sm="6" md="4" lg="3"
                style="padding-right: 20px;">
                <v-card class="mx-auto my-5" max-width="374" tile>
                    <div class="image-container">
                        <v-img class="card-image" :src="book.image" style="object-fit: cover"></v-img>
                        <div id="discount-button" v-if="book.priceOld > book.priceNew"
                            class="text-left font-weight-regular text-xs">
                            -{{ book.discount }}
                        </div>
                    </div>
                    <v-card-title style="padding-bottom: 0; padding-top: 0;">
                        <div id="discount-button-none" v-if="book.priceOld < book.priceNew"
                            class="text-h6 text-sm-left font-weight-regular">
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <div class="d-flex justify-space-between align-center">
                            <div :class="{ 'text-black': book.priceOld == null || book.priceOld < book.priceNew, 'background-orange': book.priceOld !== null && book.priceOld > book.priceNew }"
                                class="font-weight-400 size-0.875rem" id="price-button">
                                {{ book.priceNew ? book.priceNew + ' р.' : '' }}
                            </div>
                            <div class="text--disabled" v-if="book.priceOld > book.priceNew">
                                <del>{{ book.priceOld }} р.</del>
                            </div>
                        </div>
                    </v-card-actions>

                    <v-card-actions class="d-block">
                        <p class="text-sm-left text-truncate">
                            {{ book.title }}
                        </p>
                        <p class=" text-sm-center font-weight-400 size-0.875rem text-truncate text--disabled"
                            style="margin-bottom: 0;">
                            {{ book.author }}
                        </p>
                    </v-card-actions>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-subtitle class="text-center">
                        <v-rating :value="book.rating" color="amber" dense half-increments readonly size="22"
                            v-if="book.rating !== null"></v-rating>
                        <div class="grey--text ms-4">
                            {{ book.rating }}
                        </div>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-center">
            <v-pagination v-model="currentPage" :length=totalPages :total-visible="5" circle
                @input="fetchBooks"></v-pagination>
        </div>
    </v-container>
</template>

<script>
import booksService from "@/services/books.service.js";

export default {
    data() {
        return {
            currentPage: 1,
            booksQuantity: 60,
            sortItems: [
                { text: 'Название', value: 'title' },
                { text: 'Автор', value: 'author' },
                { text: 'Цена', value: 'price_new' },
                { text: 'Скидка', value: 'discount' },
                { text: 'Рейтинг', value: 'rating' },
                { text: 'Дата добавления', value: 'created_at' },
                { text: 'Дата обновления', value: 'updated_at' },

            ],
            sortBy: 'title',
            orderAsc: true,
            loading: false,
            books: [],
            right: null,
            search: ''




        }
    },  
    computed: {
        totalPages() {
            return this.books.length == this.booksQuantity ? Math.ceil(38483 / this.booksQuantity) : Math.ceil(this.books.length / this.booksQuantity);
        },
        currentPageFromRoute() {
            return parseInt(this.$route.query.page) || this.$route.params.page + 1 || this.currentPage;
        },
        searchhandler() {
            return this.books.filter(book => book.title.toLowerCase().includes(this.search.toLowerCase()));
        }
    },
    methods: {
        async fetchBooks() {
            try {
                this.loading = true;
                const page = this.currentPageFromRoute;
                const bookData = {
                    page: page,
                    books_quantity: this.booksQuantity,
                    sort_by: this.sortBy,
                    order_asc: this.orderAsc
                };
                console.log(bookData);

                const response = await booksService.getBooks(bookData);

                if (parseInt(this.$route.params.page || 1) !== this.currentPage) {

                    this.$router.push({ name: 'home-page', params: { page: this.currentPage } });
                }

                this.books = response.data
                this.windowScroll()
                console.log(this.books.length);
            } catch (error) {
                console.error(error.message);
            } finally {
                this.loading = false;
            }

        },
        async searchBooks() {
            const bookData = {
                title: this.search,
            };
            const response = await booksService.searchBooks(bookData);
            this.books = response.data
            console.log(this.books);
        },
        handleSort(sortBy) {
            if (this.sortBy === sortBy) {
                this.orderAsc = !this.orderAsc;
            } else {
                this.sortBy = sortBy;
                this.orderAsc = true;
            }
            this.fetchBooks();
        },

        windowScroll() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }

    },
    created() {
        this.fetchBooks();
    },
}
</script>
<style scoped>
.conatiner-books {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

.v-card {
    text-align: center;
    padding: 16px;
    height: 400px;
}

.v-card .v-image {
    text-align: center;
    margin-left: 80px;
}

.card-image {
    width: 45%;
    height: 200px;
    object-fit: cover;
}

#discount-button {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    background-color: #f07800;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
}

#discount-button-none {
    position: absolute;
    top: 10px;
    left: 10px;
    visibility: hidden;
}

#price-button {
    margin-right: 7px;
}

.text-black {
    color: black;
}

.background-orange {
    color: #f07800;
}
</style>