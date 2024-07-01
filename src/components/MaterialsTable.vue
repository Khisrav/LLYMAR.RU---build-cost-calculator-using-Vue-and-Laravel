<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
</script>

<template>
  <div class="block">
    <h3 class="text-xl lg:text-2xl uppercase font-bold py-4 mt-8">Профиль</h3>
    <div class="shadow-2xl rounded-2xl shadow-primary-200">
      <div class="m-4">
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Выберите межстворочный профиль</label>
          <select
            @change="calcStore.changeMaterial()"
            id="tabs"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option>Алюминиевый</option>
            <option>Поликарбонат</option>
          </select>
        </div>
        <ul
          class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex"
        >
          <li class="w-full focus-within:z-10">
            <button
              type="button"
              @click="calcStore.changeMaterial()"
              class="inline-block w-full p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-s-lg"
              :class="[
                calcStore.material_type == 'aluminium'
                  ? 'text-black bg-yellow-300 active font-bold'
                  : 'bg-white hover:text-gray-700 hover:bg-primary-100',
              ]"
            >
              Алюминиевый
            </button>
          </li>
          <li class="w-full focus-within:z-10">
            <button
              type="button"
              @click="calcStore.changeMaterial()"
              class="inline-block w-full p-4 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-r-lg"
              :class="[
                calcStore.material_type == 'polycarbonate'
                  ? 'text-black bg-yellow-300 active font-bold'
                  : 'bg-white hover:text-gray-700 hover:bg-primary-100',
              ]"
            >
              Поликарбонат
            </button>
          </li>
        </ul>
      </div>

      <div
        class="mt-6 relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200"
      >
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-primary-900 uppercase bg-primary-100">
            <tr>
              <th scope="col" class="px-6 py-3">Картинка</th>
              <th scope="col" class="px-6 py-3">Арт.</th>
              <th scope="col" class="px-6 py-3">Вид профиля</th>
              <th scope="col" class="px-6 py-3">Цена за ед.</th>
              <th scope="col" class="px-6 py-3">Ед. изм.</th>
              <th scope="col" class="px-6 py-3">Кол-во</th>
              <th scope="col" class="px-6 py-3">Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(material, index) in calcStore.materials.filter((m) => {
                return m.type == calcStore.material_type;
              })"
              :key="index"
              class="bg-white border-b hover:bg-gray-50"
            >
              <th scope="row" class="px-6 py-4">
                <img :src="material.img" class="rounded-xl max-w-20 md:max-w-60" />
              </th>
              <td class="px-6 py-4 text-black">
                {{ material.vendor_code }}
              </td>
              <td class="px-6 py-4 font-semibold text-black">
                {{ material.name }}
              </td>
              <td class="px-6 py-4 font-semibold">{{ material.price }}₽</td>
              <td class="px-6 py-4">
                {{ material.unit }}
              </td>
              <td class="px-6 py-4">
                {{ material.amount }}
              </td>
              <td class="px-6 py-4 font-semibold">{{ material.total }}₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
