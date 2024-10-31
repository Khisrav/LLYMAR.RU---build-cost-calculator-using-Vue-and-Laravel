<script setup>
import { reactive, watchEffect } from "vue";
import { mask } from "vue-the-mask";

const vMask = mask;

const user = reactive({
  name: "",
  company: "",
  phone: "",
});

// Retrieve and set user data from sessionStorage at component mount
const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};

// If user exists in sessionStorage, update the reactive user object
Object.assign(user, storedUser);

const dealer = reactive({
  fullname: user.name,
  organization: user.company,
  phone: user.phone,
});

const client = reactive({
  fullname: "",
  address: "",
  phone: "",
});

// Watch for changes in user object and update dealer reactively
watchEffect(() => {
  dealer.fullname = user.name;
  dealer.organization = user.company;
  dealer.phone = user.phone;
});

// Optional: Re-check sessionStorage every 2 seconds (or upon any triggering events)
setTimeout(() => {
  const updatedUser = JSON.parse(sessionStorage.getItem("user"));
  if (updatedUser) {
    Object.assign(user, updatedUser); // Reactively update user object
  }
}, 2000);

</script>



<template>
  <div class="block mb-2">
    <h1 class="text-center font-bold text-2xl hidden print:block">
      Коммерческое предложение
    </h1>
    <h2 class="text-center font-semibold text-base mb-8 hidden print:block">
      на поставку безрамной системы остекления
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-3 border border-gray-200 rounded-xl">
        <h3 class="text-center font-bold">Информация о клиенте</h3>
        <p class="hidden print:block">
          Клиент: <span class="float-right">{{ client.fullname }}</span>
        </p>
        <p class="hidden print:block">
          Адрес: <span class="float-right">{{ client.address }}</span>
        </p>
        <p class="hidden print:block">
          Телефон: <span class="float-right">{{ client.phone }}</span>
        </p>

        <!-- Name -->
        <div class="print:hidden">
          <label for="first_name" class="block mb-2 text-sm text-gray-900 dark:text-white"
            >ФИО клиента:</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Иванов Иван Иванович"
            v-model="client.fullname"
          />
        </div>

        <!-- Address -->
        <div class="print:hidden">
          <label for="first_name" class="block mb-2 text-sm text-gray-900 dark:text-white"
            >Адрес:</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Москва, ул. Пушкина 123, №11"
            v-model="client.address"
          />
        </div>

        <!-- Phone -->
        <div class="print:hidden">
          <label for="first_name" class="block mb-2 text-sm text-gray-900 dark:text-white"
            >Номер телефона:</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+7 (___) ___ __-__"
            v-mask="'+7 (###) ### ##-##'"
            v-model="client.phone"
          />
        </div>
      </div>

      <div class="p-4 border border-gray-200 rounded-xl">
        <h3 class="text-center font-bold">Информация о производителе</h3>
        <p>
          Производитель: <span class="float-right">{{ dealer.fullname }}</span>
        </p>
        <p>
          Организация: <span class="float-right">{{ dealer.organization }}</span>
        </p>
        <p>
          Телефон: <span class="float-right">{{ dealer.phone }}</span>
        </p>
        <p class="mt-8 text-sm italic print:hidden">
          * Для печати коммерческого предложения нажмите кнопку "Печать" внизу экрана
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  margin-top: 8px;
}
</style>
