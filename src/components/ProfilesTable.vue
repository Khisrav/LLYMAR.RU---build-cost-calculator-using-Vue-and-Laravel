<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
</script>

<template>
  <div class="block print:hidden">
    <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
      <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-primary-900 uppercase bg-primary-100">
            <tr>
              <th scope="col" class="px-6 py-3">Картинка</th>
              <th scope="col" class="px-6 py-3">Арт.</th>
              <th scope="col" class="px-6 py-3">Наименование</th>
              <th scope="col" class="px-6 py-3">Кол-во</th>
              <th scope="col" class="px-6 py-3">Цена за ед.</th>
              <th scope="col" class="px-6 py-3">Ед. изм.</th>
              <th scope="col" class="px-6 py-3">Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(profile, index) in calcStore.profiles"
              :key="index"
              class="bg-white border-b hover:bg-gray-50"
              :class="{
                'print:hidden': profile.amount == 0,
              }"
            >
              <td scope="row" class="px-6 py-4">
                <img :src="profile.img" class="max-w-20 md:max-w-60" />
              </td>
              <td class="px-6 py-4 text-black">{{ index }}</td>
              <td class="px-6 py-4 font-semibold text-black">
                {{ profile.name }}
              </td>
              <td class="px-6 py-4">
                <div class="relative mb-6 print:hidden">
                  <select
                    v-if="['L1', 'L3', 'L5'].includes(index)"
                    v-model="calcStore.profiles[index].amount"
                    @change="calcStore.calculatePrice()"
                    class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  >
                    <option v-for="i in [0, 3, 6, 9, 12, 15, 18, 21, 24]" :value="i">
                      {{ i }}
                    </option>
                  </select>
                  <div v-else class="text-center font-bold text-black">
                    {{ profile.amount }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-semibold">{{ profile.price }}₽</td>
              <td class="px-6 py-4">
                {{ profile.unit }}
              </td>
              <td class="px-6 py-4 font-semibold">{{ profile.total }}₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
