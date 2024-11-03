<script>
import ButtonLink from "../components/ButtonLink.vue";
import { APP_NAME } from "../core/config.js";
import { initFlowbite } from "flowbite";

export default {
	components: {
		ButtonLink,
	},
	data() {
		return {
			navLinks: [
				{
					path: "/#",
					name: "Главная",
				},
				{
					path: "/#about",
					name: "О нас",
				},
				{
					path: "/#contacts",
					name: "Контакты",
				},
			],
			appname: APP_NAME,
			authorized: sessionStorage.getItem("token") != null,
			cartItemsLength: JSON.parse(localStorage.getItem("cartItems") || "[]").length || 0,
		};
	},
	mounted() {
		initFlowbite();
	},
};
</script>

<template>
	<header>
		<nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
			<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
				<router-link to="/" class="flex items-center">
					<span class="self-center text-xl font-black whitespace-nowrap">{{ appname }}</span>
				</router-link>
				<div class="flex items-center lg:order-2">
					<!-- <router-link v-if="authorized" :to="'/user/cart'" class="flex items-center mr-4 border rounded-lg p-2 border-gray-200 hover:bg-gray-100 hover:cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" width="32" height="32" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M6.15 6l2.4 5h7l2.75-5zM5.2 4h14.75q.575 0 .875.513t.025 1.037l-3.55 6.4q-.275.5-.737.775T15.55 13H8.1L7 15h12v2H7q-1.125 0-1.7-.987t-.05-1.963L6.6 11.6L3 4H1V2h3.25zm3.35 7h7z"
							/>
						</svg>
						<span class="text-gray-600 ml-2 text-sm bg-gray-100 border border-gray-200 rounded-full px-2">{{ cartItemsLength }}</span>
					</router-link> -->
					<ButtonLink v-if="authorized" :to="'/logout'">Выйти</ButtonLink>

					<ButtonLink v-else :to="'/login'">Войти</ButtonLink>
					<button
						data-collapse-toggle="mobile-menu-2"
						type="button"
						class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="mobile-menu-2"
						aria-expanded="false"
					>
						<span class="sr-only">Open main menu</span>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
						</svg>
						<svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				</div>
				<div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
					<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
						<li v-if="!authorized" v-for="navLink in navLinks">
							<router-link :to="navLink['path']" class="block py-2 pr-4 pl-3 text-black lg:p-0">{{ navLink["name"] }}</router-link>
						</li>
						<!-- <li v-if="authorized">
                      <router-link to="/user/history" class="block py-2 pr-4 pl-3 text-black lg:p-0">История</router-link>
                    </li> -->
						<li v-if="authorized">
							<router-link to="/" class="block py-2 pr-4 pl-3 text-black lg:p-0">Главная</router-link>
						</li>
						<li v-if="authorized">
							<router-link to="/user/account" class="block py-2 pr-4 pl-3 text-black lg:p-0">Аккаунт</router-link>
						</li>
						<li v-if="authorized">
							<router-link to="/user/history" class="block py-2 pr-4 pl-3 text-black lg:p-0">История</router-link>
						</li>
						<li v-if="authorized">
							<router-link to="/user/calculator" class="block py-2 pr-4 pl-3 text-black lg:p-0">Калькулятор</router-link>
						</li>
					</ul>
					<hr />
				</div>
			</div>
		</nav>
	</header>
</template>
