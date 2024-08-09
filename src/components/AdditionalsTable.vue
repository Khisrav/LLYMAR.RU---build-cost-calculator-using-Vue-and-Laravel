<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
</script>

<template>
  <div class="block mb-8 pb-8">
    <div class="flex justify-between py-4 mt-8">
      <h3 class="text-xl lg:text-2xl uppercase font-bold">Дополнительно</h3>
      <button
        type="button"
        @click="calcStore.resetRadio()"
        class="text-black bg-yellow-300 hover:bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-yellow dark:hover:bg-yellow-300"
      >
        Сбросить
      </button>
    </div>
    <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-primary-900 uppercase bg-primary-100">
          <tr>
            <th scope="col" class="px-6 py-3">Арт.</th>
            <th scope="col" class="px-6 py-3">Картинка</th>
            <th scope="col" class="px-6 py-3">Наименование</th>
            <th scope="col" class="px-6 py-3">Цена за ед.</th>
            <th scope="col" class="px-6 py-3">Ед. изм.</th>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Кол-во</th>
            <th scope="col" class="px-6 py-3">Итого</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in calcStore.additionals"
            :key="item.id"
            class="bg-white border-b hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-black">L{{ item.vendor_code }}</td>
            <td class="px-6 py-4">
              <img :src="item.img" class="max-w-20 md:max-w-60 max-h-20" />
            </td>
            <td class="px-6 py-4 font-semibold text-black">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 font-semibold">{{ item.price }}₽</td>
            <td class="px-6 py-4">
              <span v-if="item.unit == 'м2'">м<sup>2</sup></span>
              <span v-else>{{ item.unit }}</span>
            </td>
            <td class="px-6 py-4">
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
                <!-- <input
                  v-if="[200, 210].includes(item.vendor_code)"
                  v-model="calcStore.selectedProfile"
                  disabled=""
                  type="radio"
                  :value="item.vendor_code"
                  class="w-4 h-4 text-green-600 focus:ring-green-500 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                /> -->
              </div>
            </td>
            <td class="px-6 py-4 font-semibold">
              <div class="relative mb-6 print:hidden">
                <span v-if="item.is_checkable">
                  {{ item.amount }}
                </span>
                <input
                  v-else
                  v-model="item.amount"
                  type="number"
                  min="0"
                  @change="calcStore.calculatePrice()"
                  class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
            </td>
            <td class="px-6 py-4 font-semibold">{{ item.total }}₽</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
