<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
</script>

<template>
	<div class="block pb-8">
		<div class="flex justify-between py-4 mt-8 print:m-0">
			<h3 class="text-xl lg:text-2xl uppercase font-bold">Дополнительно</h3>
			<button type="button" @click="calcStore.resetRadio()" class="print:hidden text-black bg-yellow-300 hover:bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-yellow dark:hover:bg-yellow-300">Сбросить</button>
		</div>
		<div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200 print:shadow-none">
			<table class="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead class="text-xs text-primary-900 uppercase bg-primary-100">
					<tr>
						<th scope="col" class="px-6 py-3 print:hidden">Арт.</th>
						<th scope="col" class="px-6 py-3">Картинка</th>
						<th scope="col" class="px-6 py-3">Наименование</th>
						<th scope="col" class="px-6 py-3 print:hidden"></th>
						<th scope="col" class="px-6 py-3 print:hidden">Цена за ед.</th>
						<th scope="col" class="px-6 py-3">Ед. изм.</th>
						<th scope="col" class="px-6 py-3">Кол-во</th>
						<th scope="col" class="px-6 py-3 print:hidden">Итого</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in calcStore.additionals"
						:key="item.id"
						class="bg-white border-b hover:bg-gray-50"
						:class="{
							'print:hidden': item.amount == 0 || (item.is_checkable && !item.checked) || (item.vendor_code == 1234 && item.price == 0) || item.vendor_code == 230,
						}"
					>
						<td class="px-6 py-4 text-black print:hidden">L{{ item.vendor_code }}</td>
						<td class="px-6 py-4">
							<img :src="item.img" class="max-w-20 md:max-w-60 max-h-20" />
						</td>
						<td class="px-6 py-4 font-semibold text-black">
							{{ item.name }}
						</td>
						<td class="px-6 py-4 print:hidden">
							<div class="flex items-center" v-if="item.is_checkable == 1">
								<input
									v-model="item.checked"
									@change="calcStore.calculatePrice()"
									type="checkbox"
									class="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
							</div>
							<div class="flex items-center mb-4" v-else-if="item.is_checkable == 2">
								<input
									v-if="[100, 110, 120, 130, 140].includes(item.vendor_code)"
									v-model="calcStore.selectedGlassType"
									type="radio"
									@change="calcStore.calculatePrice()"
									:value="item.vendor_code"
									class="w-4 h-4 text-blue-600 focus:ring-blue-500 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
							</div>
						</td>
						<td class="px-6 py-4 font-semibold print:hidden">
							<span v-if="item.vendor_code != 1234">{{ parseInt(item.price * item.discount) }}₽</span>
							<div class="flex" v-else>
								<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"> ₽ </span>
								<input
									type="number"
									v-model="item.price"
									@change="calcStore.calculatePrice()"
									@keyup="calcStore.calculatePrice()"
									min="0"
									class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-20 text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</div>
						</td>
						<td class="px-6 py-4">
							<span v-if="item.unit == 'м2'">м<sup>2</sup></span>
							<span v-else>{{ item.unit }}</span>
						</td>
						<td class="px-6 py-4 font-semibold">
							<div class="relative mb-6" v-if="item.vendor_code != 1234">
								<span v-if="item.is_checkable"> {{ item.amount }} </span>
								<input v-else v-model="item.amount" type="number" min="0" @change="calcStore.calculatePrice()" class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
							</div>

							<span class="hidden print:block" v-else>{{ item.price }}₽</span>
						</td>
						<td class="px-6 py-4 font-semibold print:hidden">
							<span v-if="item.vendor_code != 1234">{{ item.total }}₽</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
