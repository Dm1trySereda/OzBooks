<template>
    <v-container class="container-books">
        <v-row>
            <v-col v-if="showFilters" cols="12" sm="4" md="3" lg="3">
                <v-navigation-drawer permanent class="drawer">


                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="navigation-title">Сортировать</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item-group>
                            <v-list-item v-for="item in sortItems" :key="item.text" @click="handleSort(item.value)"
                                link>
                                <v-list-item-content>
                                    <v-list-item-subtitle class="navigation-subtitle">{{ item.text
                                        }}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-icon @click="handleSort(item.value)">
                                    <v-icon v-if="sortBy === item.value" small>{{ orderAsc ? 'mdi-arrow-up' :
                                        'mdi-arrow-down' }}</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>


                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="navigation-title">Автор</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item-subtitle v-for="book in PopularAuthors" :key="book.author">
                            <v-checkbox v-model="selectedAuthors" :value="book.author" class="checkbox-subtitle"
                                hide-details>
                                <template v-slot:label>
                                    <span class="sort-text">{{ book.author }}</span>
                                    <span class="book-count">{{ book.count }}</span>
                                </template>
                            </v-checkbox>
                        </v-list-item-subtitle>
                        <v-text-field class="search-author" placeholder="Введите фамилию" hide-details v-model="search"
                            @input="searchBooks">
                            <template v-slot:append>
                                <v-icon small>mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-list>


                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="navigation-title">Год издания</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>


                        <v-list-item-subtitle v-for="book in firstFiveYears" :key="book.year">
                            <v-checkbox v-model="selectedYears" :value="book.year" class="checkbox-subtitle"
                                hide-details>
                                <template v-slot:label>
                                    <span class="sort-text">{{ book.year }}</span>
                                    <span class="book-count">{{ book.count }}</span>
                                </template>
                            </v-checkbox>
                        </v-list-item-subtitle>


                        <v-select v-model="selectedRemainingYears" :items="remainingYears" item-value="year"
                            item-text="year" :placeholder="'Еще ' + remainingYears.length + '...'" multiple
                            class="year-select">
                            <template v-slot:item="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-checkbox v-model="selectedRemainingYears" :value="item.year" hide-details >
                                            <template v-slot:label>
                                                <span class="sort-text">{{ item.year }}</span>
                                                <span class="book-count">{{ item.count }}</span>
                                            </template>
                                        </v-checkbox>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-select>
                    </v-list>
                </v-navigation-drawer>
            </v-col>


            <v-col cols="12" sm="8" md="9" lg="9">
                <v-row>
                    <v-col v-for="book in searchhandler" :key="book.id" cols="12" sm="6" md="4" lg="4">
                        <v-card>
                            <div id="discount-button" v-if="book.priceOld > book.priceNew"
                                class="text-left font-weight-regular text-xs">
                                -{{ book.discount }}
                            </div>
                            <div class="image-container">
                                <v-img class="card-image" :src="book.image" style="object-fit: contain"></v-img>
                            </div>
                            <div class="text-container">
                                <v-card-title style="padding-bottom: 0; padding-top: 0;">
                                    <div id="discount-button-none" v-if="book.priceOld < book.priceNew"
                                        class="text-h6 text-sm-left font-weight-regular"></div>
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
                                    <p class="text-sm-left text-truncate">{{ book.title }}</p>
                                    <p class="text-sm-center font-weight-400 size-0.875rem text-truncate text--disabled"
                                        style="margin-bottom: 0;">
                                        {{ book.author }}
                                    </p>
                                </v-card-actions>
                                <v-divider class="mx-4"></v-divider>
                                <v-card-subtitle class="text-center">
                                    <v-rating :value="book.rating" color="amber" dense half-increments readonly
                                        size="22" v-if="book.rating !== null"></v-rating>
                                    <div class="grey--text ms-4">{{ book.rating }}</div>
                                </v-card-subtitle>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>


        <div class="pagination">
            <span v-if="currentPage > 1" class="pagination-item" @click="handlePageChange(currentPage - 1)">
                &laquo;
            </span>

            <span v-for="page in paginatedPages" :key="page"
                :class="['pagination-item', { 'active': page === currentPageFromRoute }, { 'points': page == '...' }]"
                @click="handlePageChange(page)">
                {{ page }}
            </span>

            <span v-if="currentPage < totalPages" class="pagination-item" @click="handlePageChange(currentPage + 1)">
                &raquo;
            </span>
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
                { text: 'По названию', value: 'title' },
                { text: 'По автору', value: 'author' },
                { text: 'По дате поступления', value: 'created_at' },
                { text: 'По цене', value: 'price_new' },
                { text: 'По рейтингу', value: 'rating' },
                { text: 'Скидке', value: 'discount' },
                { text: 'Дате обновления', value: 'updated_at' },
            ],
            sortBy: 'title',
            orderAsc: true,
            loading: false,
            search: '',
            selectedSort: '',

            showFilters: true,

            books: [],  // Наполнение списка книг с бека

            PopularAuthors: [],  // Наполнение списка авторов с бека
            selectedAuthors: [],  // Выбранные авторы

            publishingYear: [], // Наполнение списка с бека
            selectedYears: [], // Годы, выбранные в основном списке
            selectedRemainingYears: [], // Годы, выбранные в раскрывающемся списке
        }
    },
    created() {
        this.fetchBooks();
        this.loadPopularAuthors();
        this.loadPublishingYear();
    },
    computed: {
        totalPages() {
            return this.books.length === this.booksQuantity ? Math.ceil(38483 / this.booksQuantity) : Math.ceil(this.books.length / this.booksQuantity);
        },
        currentPageFromRoute() {
            return parseInt(this.$route.query.page) || this.$route.params.page + 1 || this.currentPage;
        },
        searchhandler() {
            return this.books.filter(book => book.title.toLowerCase().includes(this.search.toLowerCase()));
        },
        paginatedPages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPageFromRoute;

            for (let i = Math.max(current - 3, 1); i <= Math.min(current + 3, total); i++) {
                pages.push(i);
            }

            if (!pages.includes(total) && total > 1) {
                pages.push("...", total);
            }
            if (!pages.includes(1) && total > 1) {
                pages.unshift(1);
            }

            return pages;
        },
        firstFiveYears() {
            return this.publishingYear.slice(0, 5);
        },
        remainingYears() {
            return this.publishingYear.slice(5);
        },
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
                    this.$router.push({
                        name: 'home-page',
                        query: { page: this.currentPage }
                    });
                }

                this.books = response.data;
                this.windowScroll();
            } catch (error) {
                console.error(error.message);
            } finally {
                this.loading = false;
            }
        },
        async loadPopularAuthors() {
            try {
                const count = { count: 5 };
                const response = await booksService.getMostPopularauthors(count);
                this.PopularAuthors = response.data;
            } catch (error) {
                console.error('Failed to load popular authors:', error);
            }
        },
        async loadPublishingYear() {
            try {
                const count = { count: 30 };
                const response = await booksService.getPublishingYears(count);
                this.publishingYear = response.data;
            } catch (error) {
                console.error('Failed to load popular publishing year:', error);
            }
        },
        async searchBooks() {
            const bookData = { title: this.search };
            const response = await booksService.searchBooks(bookData);
            this.books = response.data;
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
        },
        handlePageChange(page) {
            if (page !== this.currentPage) {
                this.currentPage = page;
                this.fetchBooks();
            }
        }
    },
}
</script>

<style scoped>
.v-navigation-drawer {
    width: 310px !important;
}

.v-navigation-drawer .v-list {
    padding-top: 0;
}

.navigation-title {
    font-size: 1.2rem;
    text-align: start;
}

.navigation-subtitle {
    color: black !important;
    margin-right: 5px;
    font-size: 0.9rem;
    text-align: start;
}

.checkbox-subtitle {
    margin-left: 10px;
}

.sort-text {
    font-size: 0.9rem;
    text-align: start;
    color: black;
    margin-right: 5px;
}

.book-count {
    color: gray;
    font-size: 0.8rem;
    margin-top: 2px;
}

.container-books {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

.search-author {
    margin-top: 10px;
    border-radius: 8px;
    width: 90%;
    padding: 8px;
    margin-left: 5px;
}

.year-select {
    margin-top: 10px;
    border-radius: 8px;
    width: 90%;
    padding: 8px;
    margin-left: 5px;
}



.v-card {
    text-align: center;
    padding: 16px;
    height: 420px;
}

.image-container {
    width: 50%;
    height: 220px;
    position: relative;
    margin-left: 70px;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
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



.pagination {
    margin-top: 20px;
    text-align: center;
}

.pagination-item {
    display: inline-block;
    margin: 0 4px;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    color: #000;
}

.pagination-item:hover {
    background-color: #f0f0f0;
}

.pagination-item.active {
    color: #000;
    background-color: #dcdcdc;
}

.pagination-item:not(.active) {
    color: #333;
}

.pagination-item.points {
    color: #ccc;
    cursor: default;
    pointer-events: none;
}
</style>