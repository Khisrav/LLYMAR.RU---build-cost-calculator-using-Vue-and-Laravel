<script>
import HeaderLayout from "../layouts/HeaderLayout.vue";
import { useCalcStore } from "../stores/calcStore";
import { useCartStore } from "../stores/cartStore";
import ButtonTag from "../components/ButtonTag.vue";
import InputTag from "../components/InputTag.vue";
import { ref } from "vue";
import { mask } from "vue-the-mask";

export default {
	components: {
		HeaderLayout,
		ButtonTag,
		InputTag,
	},
	data() {
		return {
			calcStore: useCalcStore(),
			cartStore: useCartStore(),
			user: JSON.parse(sessionStorage.getItem("user")),
			itemToAdd: undefined,
		};
	},
	directives: {
		mask,
	},
};
</script>

<template>
	<HeaderLayout />
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:px-0 print:pt-2">
		<div class="md:flex gap-4">
			<div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200 print:shadow-none p-4">
				<h1 class="font-semibold text-xl mb-6">Корзина</h1>
				<table class="w-full text-sm rtl:text-right text-gray-500 text-center">
					<thead>
						<tr class="border-b">
							<th>Изображение</th>
							<th>Название</th>
							<th>Цена</th>
							<th>Кол-во</th>
							<th>Сумма</th>
							<!-- <th>Удалить</th> -->
						</tr>
					</thead>
					<tbody class="text-black">
						<tr v-for="item in cartStore.items" :key="item.id" class="border-b hover:bg-gray-50">
							<td>
								<!-- {{ cartStore.getItemInfo(item.id) }} -->
								<img :src="cartStore.getItemInfo(item.id).img || ''" class="max-w-20 my-2 md:max-w-40 max-h-20" />
							</td>
							<td class="text-left">L{{ cartStore.getItemInfo(item.id).vendor_code }} - {{ cartStore.getItemInfo(item.id).name }}</td>
							<td class="min-w-20">{{ item.price }} ₽</td>
							<td>
								<div class="flex items-center">
									<button
										type="button"
										@click="() => (item.amount != 1 ? (item.amount -= 1) : 1)"
										class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-md h-5 w-5 flex justify-center items-center"
									>
										<svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
											<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
										</svg>
									</button>
									<input type="text" v-model="item.amount" class="w-12 text-center text-sm mx-2 border-0 bg-transparent focus:outline-none" />
									<button type="button" @click="() => (item.amount += 1)" class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-md h-5 w-5 flex justify-center items-center">
										<svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
											<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
										</svg>
									</button>
								</div>
							</td>
							<td class="w-20 text-center font-bold">{{ parseInt(item.amount * (item.discount * item.price)) }}₽</td>
							<td class="">
								<button @click="cartStore.removeItem(item.id)" type="button" class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white font-medium rounded-full p-2.5 flex justify-center items-center">
									<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
									</svg>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="text-right mt-4 flex items-center gap-4">
					<select
						placeholder="Выберите позицию"
						v-model="itemToAdd"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option disabled selected>Выберите позицию</option>
						<optgroup label="Артикулы">
							<option v-for="vendor in calcStore.vendors" :key="vendor.vendor_code" :value="vendor.vendor_code">L{{ vendor.vendor_code }} - {{ vendor.name }}</option>
						</optgroup>
						<optgroup label="Дополнительно">
							<option v-for="item in calcStore.additionals" :key="item.vendor_code" :value="item.vendor_code">L{{ item.vendor_code }} - {{ item.name }}</option>
						</optgroup>
					</select>
					<ButtonTag type="button" @click="cartStore.addItem(itemToAdd)">Добавить</ButtonTag>
				</div>
			</div>
			<div class="rounded-2xl shadow-2xl shadow-primary-200 print:shadow-none p-4 md:w-1/3 mt-8 md:mt-0">
				<h2 class="text-xl font-semibold mb-6">Итог</h2>
				<div class="flex gap-4 justify-between border-b border-gray-300">
					<span class="text-sm">Всего: </span>
					<span class="font-medium">{{ cartStore.totalPriceWithNoDiscount }}₽</span>
				</div>
				<div class="flex gap-4 justify-between border-b border-gray-300 mt-2">
					<span class="text-sm">С учетом скидок: </span>
					<span class="font-medium">{{ cartStore.totalPriceWithDiscount }}₽</span>
				</div>
				<div class="flex gap-4 justify-between border-b border-gray-300 mt-2">
					<span class="text-sm">Экономия: </span>
					<span class="font-bold">{{ cartStore.totalPriceWithDiscount - cartStore.totalPriceWithNoDiscount }}₽</span>
				</div>
				<div class="flex gap-4 justify-between border-b border-gray-300 mt-4">
					<span class="text-sm">Итого: </span>
					<span class="font-bold">{{ cartStore.totalPriceWithDiscount }}₽</span>
				</div>

				<h2 class="text-xl font-semibold mt-8">Оформление</h2>

				<form @submit.prevent="calcStore.sendTotals(user)">
					<label class="block mt-2 text-sm text-gray-900 dark:text-white">ФИО:</label>
					<p class="font-medium">{{ user.name }}</p>

					<label class="block mt-2 text-sm text-gray-900 dark:text-white">Email:</label>
					<p class="font-medium">{{ user.email }}</p>

					<label class="block mt-2 text-sm text-gray-900 dark:text-white">Телефон:</label>
					<p class="font-medium">{{ user.phone }}</p>

					<label class="block mt-2 text-sm text-gray-900 dark:text-white">Адрес:</label>
					<p class="font-medium">{{ user.address }}</p>

					<label v-if="user.comment" for="message" class="block mb-2 mt-2 text-sm text-gray-900 dark:text-white">Комментарий:</label>
					<p class="font-medium">{{ user.comment }}</p>

					<ButtonTag type="button" @click="calcStore.sendTotals()" class="mt-5">Подтвердить заказ</ButtonTag>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
td {
	padding: 0 8px;
}
</style>
