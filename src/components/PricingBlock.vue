<script setup>
import { useCalcStore } from "../stores/calcStore";

const calcStore = useCalcStore();
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
          min="0"
          max="100"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6"
          >0%</span
        >
        <span
          class="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6"
          >50%</span
        >
        <span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6"
          >100%</span
        >
      </div>
      <p class="font-normal text-gray-700 mt-3">
        Цена с наценкой <b>{{ calcStore.customDiscount }}%</b>:
        <span class="float-right font-semibold">{{ calcStore.markupPrice() }} ₽</span>
      </p>
    </div>
  </div>
</template>
