<script>
import ButtonTag from '../components/ButtonTag.vue';
import InputTag from '../components/InputTag.vue';
import HeaderLayout from '../layouts/HeaderLayout.vue';
import { getUser } from '../core/user';
import axios from 'axios';
import {mask} from 'vue-the-mask';
import { API_BASE_URL } from '../core/config';

export default {
    components: {
        HeaderLayout
    },
    data() {
        return {
            token: sessionStorage.getItem('token'),
            name: null,
            phone: null,
            company: null,
            email: null
        }
    },
    async mounted() {
        if (this.token.length == 0) {
            this.$router.push('/login');
        } else {
            let user = await getUser();
            console.log(user);
            this.name = user.name;
            this.company = user.company;
            this.phone = user.phone;
            this.email = user.email;
        }
    },
    methods: {
        async updateUser() {
            let user = {
                name: this.name,
                company: this.company,
                phone: this.phone,
                email: this.email
            }
            let res = await axios.put(API_BASE_URL + '/user', user, { headers: { Authorization: `Bearer ${this.token}` } });
            if (res.status) {
                this.showSuccess = true;
            } else {
                this.showError = true;
            }
        },
    },
    directives: { mask }
}
</script>

<template>
    <HeaderLayout :authorized="token.length != 0"/>

    <section class="bg-white dark:bg-gray-900">
        <div class="max-w-2xl px-4 py-8 mx-auto lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Настройки аккаунта</h2>
            <form @submit.prevent="updateUser()">
                <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                    <div class="w-full">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ф.И.О.</label>
                        <input type="text" v-model="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Иванов Иван Иванович" required="">
                    </div>
                    <div class="w-full">
                        <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Телефон</label>
                        <input type="tel" v-model="phone" v-mask="'+7 (###) ### ##-##'" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="+7 (987) 654 32-10" required="">
                    </div>
                    <div class="w-full">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Почта</label>
                        <input type="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="ivanov@mail.ru" required="">
                    </div>
                    <div class="w-full">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Организация</label>
                        <input type="text" v-model="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Росатом" required="">
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button type="submit" class="text-black bg-yellow-300 inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        <svg class="w-5 h-5 mr-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" clip-rule="evenodd"/></svg>                          
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>