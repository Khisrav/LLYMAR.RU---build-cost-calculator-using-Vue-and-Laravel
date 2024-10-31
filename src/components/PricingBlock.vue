<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();

const deafArea = () => {
  return calcStore.openings.reduce((acc, val) => {
    if (!["triangle", "blind-glazing"].includes(val.type)) return acc;

    return acc + (val.width * val.height) / 1000000;
  }, 0);
};

const checkEmpty = (event) => {
  if (event.target.value === "") {
    calcStore.delivery = 0;
  }
};
</script>

<template>
  <div class="mt-8 pt-8 mx-auto max-w-screen-xl sm:py-16 lg:px-0 print:hidden">
    <div
      class="block max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <h5 class="m-0 mb-2 text-2xl font-bold tracking-tight text-gray-900">
        Расчет стоимости
      </h5>
      <p class="font-normal text-gray-700 mt-3">
        Цена со скидкой:
        <span class="float-right font-semibold">{{ calcStore.totalPrice }} ₽</span>
      </p>
      <p class="font-normal text-gray-700 mt-3">
        Розничная цена:
        <span class="float-right font-semibold">{{ calcStore.noDiscountPrice() }} ₽</span>
      </p>
      <p class="font-normal text-gray-700 mt-3">
        Ваша наценка:
        <span class="float-right font-semibold">{{ calcStore.customDiscount }}%</span>
      </p>
      <div class="relative mb-6">
        <label for="labels-range-input" class="sr-only">Labels range</label>
        <input
          id="labels-range-input"
          type="range"
          v-model="calcStore.customDiscount"
          min="-50"
          max="50"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6"
          >-50%</span
        >
        <span
          class="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6"
          >0%</span
        >
        <span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6"
          >50%</span
        >
      </div>
      <p class="font-normal text-gray-700 mt-3">
        Цена с наценкой на м<sup>2</sup>:
        <span class="float-right font-semibold"
          >{{ parseInt(calcStore.markupPrice() / calcStore.openingsWH()) }} ₽/м<sup
            >2</sup
          ></span
        >
      </p>
      <p class="font-normal text-gray-700 mt-3">
        Цена с наценкой <b>{{ calcStore.customDiscount }}%</b>:
        <span class="float-right font-semibold">{{ calcStore.markupPrice() }} ₽</span>
      </p>
      <p class="font-normal text-gray-700 mt-3">
        Площадь глухих проемов:
        <span class="float-right font-semibold"
          >{{ deafArea().toFixed(3) }} м<sup>2</sup></span
        >
      </p>
      <div class="font-normal text-gray-700 mt-3 flex justify-between items-center">
        <span> Доставка: </span>
        <div class="flex">
          <input
            type="number"
            min="0"
            @input="checkEmpty"
            v-model="calcStore.delivery"
            class="rounded-none rounded-e-0 rounded-s-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-24 text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <span
            class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-md border-gray-300 border-s-0 rounded-s-0 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
          >
            ₽
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
