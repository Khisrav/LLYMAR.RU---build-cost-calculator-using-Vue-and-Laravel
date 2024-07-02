<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
</script>

<template>
  <div class="block">
    <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
      <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-primary-900 uppercase bg-primary-100">
            <tr>
              <th scope="col" class="px-6 py-3">Картинка</th>
              <th scope="col" class="px-6 py-3">Арт.</th>
              <th scope="col" class="px-6 py-3">Наименование</th>
              <th scope="col" class="px-6 py-3">Цена за ед.</th>
              <th scope="col" class="px-6 py-3">Ед. изм.</th>
              <th scope="col" class="px-6 py-3">Кол-во</th>
              <th scope="col" class="px-6 py-3">Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(autoProfile, index) in calcStore.autoProfiles"
              :key="index"
              class="bg-white border-b hover:bg-gray-50"
            >
              <th scope="row" class="px-6 py-4">
                <img :src="autoProfile.img" class="rounded-xl max-w-20 md:max-w-60" />
              </th>
              <td class="px-6 py-4 text-black">
                {{ autoProfile.vendor_code }}
              </td>
              <td class="px-6 py-4 font-semibold text-black">
                {{ autoProfile.name }}
              </td>
              <td class="px-6 py-4 font-semibold">{{ autoProfile.price }}₽</td>
              <td class="px-6 py-4">
                {{ autoProfile.unit }}
              </td>
              <td class="px-6 py-4">
                <div class="text-center font-bold text-black">
                  {{ autoProfile.amount }}
                </div>
              </td>
              <td class="px-6 py-4 font-semibold">{{ autoProfile.total }}₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
