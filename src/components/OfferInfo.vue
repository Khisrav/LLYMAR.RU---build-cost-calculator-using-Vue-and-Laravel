<script>
import { reactive } from "vue";
import { mask } from "vue-the-mask";

export default {
  directives: {
    mask,
  },
  setup() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      user = {
        name: "",
        company: "",
        phone: "",
      };
    }

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

    return {
      dealer,
      client,
    };
  },
};
</script>

<template>
  <div class="block mb-4">
    <h1 class="text-center font-bold text-3xl hidden print:block">
      Коммерческое предложение
    </h1>
    <h2 class="text-center font-bold text-xl mb-8 hidden print:block">
      на поставку безрамной системы остекления
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 border border-gray-200 rounded-xl">
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
        <h3 class="text-center font-bold">Информация о дилере</h3>
        <p>
          Дилер: <span class="float-right">{{ dealer.fullname }}</span>
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
.float-right {
  font-weight: bold;
}
label {
  margin-top: 8px;
}
</style>
