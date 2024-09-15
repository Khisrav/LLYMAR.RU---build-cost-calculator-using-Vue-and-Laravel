<script setup>
import { ref } from "vue";
import { useCalcStore } from "../stores/calcStore";

import ButtonTag from "./ButtonTag.vue";
import InputTag from "./InputTag.vue";

const calcStore = useCalcStore();
const selectedSeparateOpening = ref(null);

const openingNames = {
  left: "Левый проем",
  right: "Правый проем",
  center: "Центральный проем",
  "inner-left": "Входная группа левая",
  "inner-right": "Входная группа правая",
  "blind-glazing": "Глухое остекление",
  triangle: "Треугольник",
};

const openingName = (openingType) => {
  return openingNames[openingType];
};
</script>

<template>
  <div class="block">
    <div class="flex justify-between py-4 print:py-0">
      <h3 class="text-xl lg:text-2xl uppercase font-bold">Проемы</h3>
      <ButtonTag type="button" @click="calcStore.addOpening()" class="print:hidden"
        >Добавить проем</ButtonTag
      >
    </div>
    <div
      class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200 print:shadow-none"
    >
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-primary-900 uppercase bg-primary-100">
          <tr>
            <th scope="col" class="px-6 py-3 print:px-0">Картинка</th>
            <th scope="col" class="px-6 py-3 print:px-0">Вид проема</th>
            <th scope="col" class="px-6 py-3 print:px-0">Кол-во створок</th>
            <th scope="col" class="px-6 py-3 print:px-0 normal-case">Ш x В (в мм)</th>
            <th scope="col" class="px-6 py-3 print:hidden">Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(opening, index) in calcStore.openings"
            :key="index"
            class="bg-white border-b hover:bg-gray-50"
          >
            <td scope="row" class="px-6 print:px-0 py-4 print:py-2">
              <img
                :src="calcStore.opening_images[opening.type]"
                class="max-w-20 md:max-w-60 print:min-w-40"
              />
            </td>
            <td
              class="px-6 print:px-0 py-4 print:py-2 text-base font-semibold text-black"
            >
              <span class="hidden print:block font-bold">{{
                openingName(calcStore.openings[index].type)
              }}</span>
              <select
                v-model="calcStore.openings[index].type"
                @change="calcStore.changeOpeningType(index)"
                class="print:hidden bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-54 p-2.5"
              >
                <option v-for="(name, key) in openingNames" :key="key" :value="key">
                  {{ name }}
                </option>
              </select>
            </td>
            <td class="px-6 print:px-0 py-4 print:py-2 text-center">
              <span
                v-if="opening.type == 'inner-left' || opening.type == 'inner-right'"
                class="font-bold"
                >{{ opening.doors }} шт.</span
              >
              <div v-else class="relative flex justify-center">
                <span class="hidden print:block font-bold">{{ opening.doors }} шт.</span>
                <div>
                  <select
                    v-model="calcStore.openings[index].doors"
                    @change="calcStore.calculatePrice()"
                    class="print:hidden w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  >
                    <option
                      v-if="opening.type != 'center'"
                      v-for="i in ['triangle', 'blind-glazing'].includes(opening.type)
                        ? [0, 1]
                        : [2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :value="i"
                    >
                      {{ i }}
                    </option>
                    <option v-else v-for="i in [4, 6, 8, 10, 12]" :value="i">
                      {{ i }}
                    </option>
                  </select>
                  <span
                    v-if="['triangle', 'blind-glazing'].includes(opening.type)"
                    class="block font-bold pt-3"
                  >
                    {{ opening.price }}₽
                  </span>
                </div>
              </div>
            </td>
            <td class="px-6 print:px-0 py-4 print:py-2">
              <span class="hidden print:block font-bold"
                >{{ opening.width }} × {{ opening.height }}</span
              >
              <div class="inline-flex w-48 print:hidden" role="group">
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
            <td class="px-6 print:px-0 py-4 print:py-2 print:hidden">
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
