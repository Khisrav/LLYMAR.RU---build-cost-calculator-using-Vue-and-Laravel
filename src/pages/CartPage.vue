<script setup>
import HeaderLayout from "../layouts/HeaderLayout.vue";
import { useCalcStore } from "../stores/calcStore";
import { useCartStore } from "../stores/cartStore";

const calcStore = useCalcStore();
const cartStore = useCartStore();
</script>

<template>
	<HeaderLayout />
	<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-0 print:pt-2">
		<div class="flex gap-4">
			<div class="w-3/4 p-4 border border-gray-200 rounded-2xl">
				<h1 class="font-semibold text-xl mb-6">Корзина</h1>
				<div>
					<div v-for="item in cartStore.items" :key="item.id" class="cart-item flex gap-4 my-4 justify-between items-center">
						<div>
							<img :src="cartStore.getItemInfo(item.id).img" class="max-w-20 md:max-w-60 max-h-20" />
						</div>

						<div>
							<p class="font-medium pb-2">{{ cartStore.getItemInfo(item.id).name }}</p>
							<p class="text-xs">Цена: {{ item.price }} ₽</p>
						</div>

						<div>
							<label for="counter-input" class="mr-4 text-xs text-gray-900 dark:text-white">Кол-во:</label>
							<div class="relative flex items-center content-center">
								<button
									type="button"
									id="decrement-button"
									@click="() => (item.amount != 1 ? (item.amount -= 1) : 1)"
									data-input-counter-decrement="counter-input"
									class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
								>
									<svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
									</svg>
								</button>
								<input
									type="text"
									id="counter-input"
									data-input-counter
									class="font-bold flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
									placeholder=""
									min="1"
									v-model="item.amount"
									required
								/>
								<button
									type="button"
									id="increment-button"
									@click="() => (item.amount += 1)"
									data-input-counter-increment="counter-input"
									class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
								>
									<svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
									</svg>
								</button>
							</div>
						</div>

						<span class="font-bold">{{ parseInt(item.amount * (item.discount * item.price)) }} ₽</span>

						<button
							type="button"
							class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
						>
							<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
							</svg>

							<span class="sr-only">Icon description</span>
						</button>
					</div>
				</div>
			</div>
			<div class="w-1/4 border border-gray-200 rounded-2xl p-4">
				<h2 class="text-xl font-semibold mb-6">Итог</h2>
				<div class="flex gap-4 justify-between border-b border-gray-300">
					<span>Всего: </span>
					<span class="font-medium">{{ calcStore.noDiscountPrice() }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
