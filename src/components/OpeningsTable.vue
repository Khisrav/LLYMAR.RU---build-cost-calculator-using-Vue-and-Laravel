<script setup>
import { useCalcStore } from "../stores/calcStore";

import ButtonTag from "./ButtonTag.vue";
import InputTag from "./InputTag.vue";

const calcStore = useCalcStore();
</script>

<template>
  <div class="block">
    <div class="flex justify-between py-4">
      <h3 class="text-xl lg:text-2xl uppercase font-bold">Проемы</h3>
      <ButtonTag type="button" @click="calcStore.addOpening()" class="print:hidden"
        >Добавить проем</ButtonTag
      >
    </div>
    <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-primary-900 uppercase bg-primary-100">
          <tr>
            <th scope="col" class="px-6 py-3">Картинка</th>
            <th scope="col" class="px-6 py-3">Вид проема</th>
            <th scope="col" class="px-6 py-3">Кол-во створок</th>
            <th scope="col" class="px-6 py-3 normal-case">Ш x В (в мм)</th>
            <th scope="col" class="px-6 py-3 print:hidden">Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(opening, index) in calcStore.openings"
            :key="index"
            class="bg-white border-b hover:bg-gray-50"
          >
            <td scope="row" class="px-6 py-4">
              <img
                :src="calcStore.opening_images[opening.type]"
                class="max-w-20 md:max-w-60"
              />
            </td>
            <td class="px-6 py-4 text-base font-semibold text-black">
              <select
                v-model="calcStore.openings[index].type"
                @change="calcStore.changeOpeningType(index)"
                class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-54 p-2.5"
              >
                <option value="left">Левый проем</option>
                <option value="right">Правый проем</option>
                <option value="center">Центральный проем</option>
                <option value="inner-left">Входная группа левая</option>
                <option value="inner-right">Входная группа правая</option>
              </select>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                v-if="opening.type == 'inner-left' || opening.type == 'inner-right'"
                >{{ opening.doors }}</span
              >
              <!-- <InputTag type="number" v-model="calc.openings[index].doors" @change="calculatePrice()" class="text-center"/> -->
              <div v-else class="relative print:hidden flex justify-center">
                <select
                  v-model="calcStore.openings[index].doors"
                  @change="calcStore.calculatePrice()"
                  class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option
                    v-if="opening.type != 'center'"
                    v-for="i in [2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :value="i"
                  >
                    {{ i }}
                  </option>
                  <option v-else v-for="i in [4, 6, 8, 10, 12]" :value="i">
                    {{ i }}
                  </option>
                </select>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="inline-flex w-48" role="group">
                <InputTag
                  type="number"
                  v-model="calcStore.openings[index].width"
                  @change="calcStore.calculatePrice()"
                  class="w-1/2 rounded-r-none text-center"
                />
                <InputTag
                  type="number"
                  v-model="calcStore.openings[index].height"
                  @change="calcStore.calculatePrice()"
                  class="w-1/2 rounded-s-none text-center"
                />
              </div>
            </td>
            <td class="px-6 py-4 print:hidden">
              <button
                type="button"
                @click="calcStore.removeOpening(index)"
                class="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
