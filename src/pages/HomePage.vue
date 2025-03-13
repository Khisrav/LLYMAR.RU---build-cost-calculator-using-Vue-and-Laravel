<script>
import HeaderLayout from "../layouts/HeaderLayout.vue";
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

export default {
	components: {
		HeaderLayout,
	},
	data() {
		return {};
	},
	mounted() {
		initFlowbite();
	},
};
</script>

<template>
	<HeaderLayout />
	<section class="bg-[url('/assets/mockuper.jpg')] bg-center bg-no-repeat bg-cover dark:bg-gray-900">
	<div class="bg-black/40">
		<div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 h-[calc(100vh-64px)]">
			<div class="mr-auto place-self-center lg:col-span-8 pb-8">
				<h1 class="max-w-2xl mb-4 text-white text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Система безрамного остекления LLYMAR</h1>
				<p class="max-w-2xl mb-6 font-light text-gray-100 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400">Сайт находится на стадии разработки.</p>
				<router-link to="tel:+7 (989) 804-12-34" class="block max-w-2xl mb-6 font-light text-gray-100 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">+7 (989) 804-12-34</router-link>
				<router-link to="/register" class="inline-flex text-center text-black bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5">
					<span>Регистрация для партнеров</span>
					<svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
					</svg>
				</router-link>
			</div>
		</div>
	</div>
	</section>
</template>
