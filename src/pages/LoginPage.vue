<script>
// import { onBeforeMount } from 'vue';
import ButtonTag from '../components/ButtonTag.vue';
import InputTag from '../components/InputTag.vue';
import HeaderLayout from '../layouts/HeaderLayout.vue';
import { login } from '../core/auth';

export default {
    components: {
        HeaderLayout,
        InputTag,
        ButtonTag
    },
    data() {
        return {
            email: '',
            password: '',
            displayError: false,
            displayEmptyFields: false,
            processing: false,
        }
    },
    mounted() {
        if (sessionStorage.getItem('token')) {
            this.$router.push('/user/calculator');
        }
    },
    methods: {
        async performLogin() {
            this.processing = true;
            try {
                if (this.email == '' || this.password == '') {
                    this.displayEmptyFields = true;
                    this.processing = false;
                    return;
                } else {
                    this.displayEmptyFields = false;
                }

                const response = await login(this.email, this.password);
                if (response.access_token) {
                    this.$router.push('/user/calculator');
                } else {
                    this.displayError = true;
                    this.processing = false;
                }
            } catch (error) {
                this.processing = false;
            }
        },
    }
}
</script>

<template>
<HeaderLayout/>
<section class="bg-gray-50 dark:bg-black">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-white">Вход</h1>
                <form class="space-y-4 md:space-y-6" method="post" @submit.prevent="performLogin()">
                    <div>
                        <label for="phone" class="block mb-1 text-sm font-medium text-black dark:text-white">Почта</label>
                        <InputTag type="email" id="email" v-model="email" placeholder="Введите почту" class="w-full" required/>
                    </div>
                    <div>
                        <label for="password" class="block mb-1 text-sm font-medium text-black dark:text-white">Пароль</label>
                        <InputTag type="password" id="password" v-model="password" placeholder="Введите ваш пароль" class="w-full" required/>
                    </div>
                    <div v-if="displayError" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span class="sr-only">Info</span>
                        <div class="ms-3 text-sm font-medium">Неправильная почта или пароль</div>
                    </div>
                    <div v-if="displayEmptyFields" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span class="sr-only">Info</span>
                        <div class="ms-3 text-sm font-medium">Заполните поля</div>
                    </div>
                    <ButtonTag type="submit" class="w-full">{{ processing ? 'Загрузка...' : 'Войти' }}</ButtonTag>
                </form>
            </div>
        </div>
    </div>
</section>
</template>