<template>
    <v-container class="container-books">
        <v-row>
            <v-col cols="12" sm="4" md="3" lg="3">
                <v-navigation-drawer permanent class="drawer">


                    <v-list v-if=getFilters>
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
                                <v-list-item-icon>
                                    <v-icon v-if="getSortBy === item.value" small>{{ getOrderAsc ? 'mdi-arrow-up' :
                                        'mdi-arrow-down' }}</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>


                    <v-list v-if=getFilters>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="navigation-title">Автор</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item-subtitle v-for="book in mostPopularAuthors" :key="book.author">
                            <v-checkbox v-model="selectedAuthors" :value="book.author" class="checkbox-subtitle"
                                hide-details @change="onAuthorCheckboxChange">
                                <template v-slot:label>
                                    <span class="sort-text">{{ book.author }}</span>
                                    <span class="book-count">{{ book.count }}</span>
                                </template>
                            </v-checkbox>
                        </v-list-item-subtitle>
                        <v-autocomplete class="search-author" :items="getPopularAuthors" item-value="author"
                            item-text="author" hide-details clearable chips multiple small-chips variant="outlined"
                            menu-props="{ maxHeight: '400px' }" v-model="selectedAuthors">
                            <template v-slot:item="{ item }">
                                <v-list-item @click="selectAuthor(item.author)" class="autocomplete-author">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.author }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-list>


                    <v-list v-if=getFilters>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="navigation-title">Год издания</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item-subtitle v-for="book in firstFiveYears" :key="book.year">
                            <v-checkbox v-model="selectedYears" :value="book.year" class="checkbox-subtitle"
                                hide-details @change="onYearCheckboxChange">
                                <template v-slot:label>
                                    <span class="sort-text">{{ book.year }}</span>
                                    <span class="book-count">{{ book.count }}</span>
                                </template>
                            </v-checkbox>
                        </v-list-item-subtitle>

                        <v-select :items="remainingYears" item-value="year" item-text="year"
                            :placeholder="'Еще ' + remainingYears.length + '...'" multiple class="year-select">
                            <template v-slot:item="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-checkbox v-model="selectedYears" :value="item.year" hide-details
                                            @change="onYearCheckboxChange">
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
                    <v-col v-for="book in getBooks" :key="book.id" cols="12" sm="6" md="4" lg="4">
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
                                        {{ book.author }}, {{ book.year }}
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
            <span v-if="getCurrentPage > 1" class="pagination-item" @click="handlePageChange(getCurrentPage - 1)">
                &laquo;
            </span>

            <span v-for="page in paginatedPages" :key="page"
                :class="['pagination-item', { 'active': page === currentPageFromRoute }, { 'points': page == '...' }]"
                @click="handlePageChange(page)">
                {{ page }}
            </span>

            <span v-if="getCurrentPage < totalPages" class="pagination-item"
                @click="handlePageChange(getCurrentPage + 1)">
                &raquo;
            </span>
        </div>
    </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';


export default {
    data() {
        return {
            sortItems: [
                { text: 'По названию', value: 'title' },
                { text: 'По автору', value: 'author' },
                { text: 'По дате поступления', value: 'created_at' },
                { text: 'По цене', value: 'price_new' },
                { text: 'По рейтингу', value: 'rating' },
                { text: 'Скидке', value: 'discount' },
                { text: 'Дате обновления', value: 'updated_at' },
            ],
            selectedAuthors: [],
            selectedYears: [],

        }
    },
    created() {
        this.setQueryParamsToState(this.$route.query);
        this.loadPopularAuthors();
        this.loadPublishingYears();
    },

    computed: {
        ...mapGetters('books', ['getBooks', 'getLoadings', 'getFilters', 'getCurrentPage', 'getBooksQuantity', 'getSortBy', 'getOrderAsc', 'getbooksQuantity']),
        ...mapGetters('filters', ['getPopularAuthors', 'getPublishingYears', 'getSelectedAuthors', 'getSelectedYears', 'getSelectedRemainingYears', 'getFilteredBooks', 'getSearchebleBooks']),
        totalPages() {
            return this.getBooks.length === this.getBooksQuantity ? Math.ceil(33974 / this.getBooksQuantity) : Math.floor(this.getBooks.length / this.getBooksQuantity);
        },
        currentPageFromRoute() {
            return parseInt(this.$route.query.page) || this.getCurrentPage;
        },
        paginatedPages() {
            const pages = [];
            const current = this.currentPageFromRoute;
            let total;

            if (this.getSelectedAuthors.length > 0) {
                total = Math.ceil(this.getSearchebleBooks / this.getbooksQuantity);
            } else {

                total = this.totalPages;
            }
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
            return this.getPublishingYears.slice(0, 5);

        },
        remainingYears() {
            return this.getPublishingYears.slice(5);
        },
        mostPopularAuthors() {
            return this.getPopularAuthors.slice(0, 5);
        }



    },
    methods: {
        ...mapActions('books', ['fetchBooks']),
        ...mapActions('filters', ['loadPopularAuthors', 'loadPublishingYears', 'loadFilteringsBooks',]),
        ...mapMutations('books', ['SET_CURRENT_PAGE', 'SET_SORT_BY', 'SET_ORDER_ASC', 'SET_FILTERS']),
        ...mapMutations('filters', ['SET_SELECTED_AUTHORS', 'SET_SELECTED_YEARS']),

        updateRoute() {
            const queryParams = {
                sort_by: this.getSortBy,
                order_asc: this.getOrderAsc,
                page: this.getCurrentPage,
            };

            if (this.selectedAuthors.length > 0) {
                queryParams.authors = this.selectedAuthors.join(',');
            }

            if (this.selectedYears.length > 0) {
                queryParams.years = this.selectedYears.join(',');
            }

            this.$router.push({
                name: 'home-page',
                query: queryParams
            }).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error(err);
                }
            });
        },
        setQueryParamsToState(query) {

            const { sort_by, order_asc, page, authors, years } = query;

            if (sort_by) {
                this.SET_SORT_BY(sort_by);
            }
            if (order_asc) {
                this.SET_ORDER_ASC(order_asc);
            }
            if (page) {
                this.SET_CURRENT_PAGE(parseInt(page));
            }

            if (authors) {
                this.selectedAuthors = authors.split(',');
                this.SET_SELECTED_AUTHORS(this.selectedAuthors);
            }
            if (years) {
                this.SET_SELECTED_YEARS(years.split(','));

            }
        },
        handleSort(value) {
            if (this.getSortBy === value) {
                this.SET_ORDER_ASC(!this.getOrderAsc);

            } else {
                this.SET_SORT_BY(value);
                this.SET_ORDER_ASC(true);
            }
            if (this.getSelectedAuthors.length > 0 || this.getSelectedYears.length > 0) {
                this.updateRoute()
            } else {
                this.fetchBooks();
                this.updateRoute()
            }



        },
        windowScroll() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        handlePageChange(page) {
            if (page !== this.getCurrentPage) {
                this.SET_CURRENT_PAGE(page);

                if (this.selectedAuthors.length >= 1) {
                    this.updateRoute();
                } else {
                    this.updateRoute();
                    this.fetchBooks();
                }
                this.windowScroll();
            }
        },


        onAuthorCheckboxChange() {
            const authors = this.selectedAuthors.join(',');
            this.updateRoute(authors);
        },
        selectAuthor(author) {
            if (!this.selectedAuthors.includes(author)) {
                this.selectedAuthors.push(author);
                this.onAuthorCheckboxChange()
            }

        },
        onYearCheckboxChange() {
            const years = this.selectedYears.join(',');
            this.updateRoute(years);
        },

    },
    watch: {
        '$route.query': {
            handler(newValue) {
                this.setQueryParamsToState(newValue);
                this.loadFilteringsBooks();

            },
            immediate: true
        }
    }
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

.autocomplete-author {
    font-size: 0.9rem;
    text-align: start;
    color: black;
    margin-right: 5px;
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

.bth-search:hover {
    color: #000;
    cursor: pointer;
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