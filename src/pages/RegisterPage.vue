<script>
import HeaderLayout from "../layouts/HeaderLayout.vue";
import ButtonTag from "../components/ButtonTag.vue";
import { mask } from "vue-the-mask";
import axios from "axios";
import { CHAT_ID, TELEGRAM_TOKEN } from "../core/config";

export default {
  components: {
    HeaderLayout,
    ButtonTag,
  },
  data() {
    return {
      phone: "",
      name: "",
      company: "",
      address: "",
      email: "",
      comment: "",
      telegramBotToken: TELEGRAM_TOKEN,
      chatId: CHAT_ID,
    };
  },
  methods: {
    async sendMessage() {
      const message = `
<b>Заявка на регистрацию</b>
\n
<u>Телефон:</u> <code>${this.phone}</code>
<u>Ф.И.О:</u> <code>${this.name}</code>
<u>Организация:</u> <code>${this.company}</code>
<u>Адрес:</u> <code>${this.address}</code>
<u>Почта:</u> <code>${this.email}</code>
\n
Комментарий: <i>${this.comment}</i>`;
      console.log("sending");
      try {
        await axios.post(
          `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
          {
            chat_id: this.chatId,
            text: message,
            parse_mode: "HTML",
          }
        );
        alert("Ваша заявка отправлена! Мы с вами скоро свяжемся!");
        // Optionally, you can clear the form fields after sending the message
        // this.phone = "";
        // this.name = "";
        // this.company = "";
        // this.address = "";
        // this.email = "";
        // this.comment = "";
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again later.");
      }
    },
  },
  directives: { mask },
};
</script>
<template>
  <HeaderLayout />

  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Заявка на регистрацию
      </h2>
      <form @submit.prevent="sendMessage()">
        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div class="sm:col-span-2">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Ф.И.О</label
            >
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Иванов Иван Иванович"
              v-model="name"
              required=""
            />
          </div>
          <div class="w-full">
            <label
              for="brand"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Телефон</label
            >
            <input
              type="text"
              v-mask="'+7 (###) ### ##-##'"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="+7 (999) 999 99-99"
              v-model="phone"
              required=""
            />
          </div>
          <div class="w-full">
            <label
              for="price"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Почта</label
            >
            <input
              type="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="ivanov@mail.ru"
              v-model="email"
              required=""
            />
          </div>
          <div>
            <label for="category" class="block mb-2 text-sm font-medium text-gray-900"
              >Организация</label
            >
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder='ООО "КОМПАНИЯ"'
              required=""
              v-model="company"
            />
          </div>
          <div>
            <label for="item-weight" class="block mb-2 text-sm font-medium text-gray-900"
              >Адрес</label
            >
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Москва, ул. Мира, 123/2"
              v-model="address"
              required=""
            />
          </div>
          <div class="sm:col-span-2">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Комментарий к заявке</label
            >
            <textarea
              id="description"
              rows="8"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="..."
              v-model="comment"
            ></textarea>
          </div>
        </div>
        <ButtonTag type="submit" class="mt-5">Отправить</ButtonTag>
      </form>
    </div>
  </section>
</template>
