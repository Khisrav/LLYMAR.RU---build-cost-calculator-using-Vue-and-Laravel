<script>
import axios from "axios";
import { API_BASE_URL } from "../core/config";

export default {
  data() {
    return {
      order: [],
      additionals: [],
      vendorsAmount: [],
      openings: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get(API_BASE_URL + `/pdf/${this.$route.params.id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (response.data) {
        this.order = response.data.order;
        this.additionals = response.data.additionals;
        this.vendorsAmount = response.data.vendorsAmount;
        this.openings = response.data.openings;
        setTimeout(() => {
          print();
        }, 300);
      } else {
        console.error("Empty response data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);

      const monthNames = [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июня",
        "Июля",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ];

      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const day = String(date.getDate());
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      const formattedDate = `${hours}:${minutes}, ${month} ${day}`;

      return formattedDate;
    },
    formatNumber(number) {
      const numberString = String(number);

      if (numberString.length > 3) {
        const formattedNumber = numberString.slice(0, -3) + " " + numberString.slice(-3);
        return formattedNumber;
      } else {
        return numberString;
      }
    },
  },
};
</script>
<template>
  <div class="p-5 max-w-4xl mx-auto">
    <div
      class="block max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <h5 class="m-0 mb-2 text-2xl font-bold tracking-tight text-gray-900">
        Расчет №{{ order.id }}
      </h5>
      <p class="font-normal text-gray-700 mt-3">
        Статус:
        <span
          v-if="order.status == 'completed'"
          class="bg-green-100 border border-green-800 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded float-right"
        >
          Выполнен
        </span>
        <span
          v-else
          class="bg-gray-100 border border-gray-800 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded float-right"
        >
          В обработке
        </span>
      </p>
      <p class="fonta-normal text-gray-700 mt-3">
        Материал профиля:
        <span class="float-right font-semibold">{{
          order.material_type == "aluminium" ? "Алюминий" : "Поликарбонат"
        }}</span>
      </p>
      <p class="fonta-normal text-gray-700 mt-3">
        Дата создания:
        <span class="float-right font-semibold">{{ formatDate(order.created_at) }}</span>
      </p>
      <p class="fonta-normal text-gray-700 mt-3">
        Общая стоимость:
        <span class="float-right font-semibold"
          >{{ formatNumber(order.total_price) }} ₽</span
        >
      </p>
    </div>

    <h5 class="mb-3 mt-12 text-xl font-bold tracking-tight text-gray-900 uppercase">
      Проемы
    </h5>
    <table class="w-full">
      <thead>
        <tr>
          <th>Тип проема</th>
          <th>Кол-во створок</th>
          <th>Ш x В (мм)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(opening, index) in openings" :key="index">
          <td>{{ opening.name }}</td>
          <td>{{ opening.doors }}</td>
          <td>{{ opening.width }} x {{ opening.height }}</td>
        </tr>
      </tbody>
    </table>

    <h5 class="mb-3 mt-12 text-xl font-bold tracking-tight text-gray-900 uppercase">
      Артикулы
    </h5>
    <table class="w-full">
      <thead>
        <tr>
          <th>Арт.</th>
          <th>Цена</th>
          <th>Кол-во</th>
          <th>Итого</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vendor, index) in vendorsAmount" :key="index">
          <td>L{{ vendor.vendor_code_id }}</td>
          <td>{{ vendor.price }}</td>
          <td>{{ vendor.amount }}</td>
          <td>{{ vendor.price * vendor.amount }} ₽</td>
        </tr>
        <tr
          v-if="additionals.length != 0"
          v-for="(item, index) in additionals"
          :key="index"
        >
          <td>L{{ item.item_id }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.price * item.amount }} ₽</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
}
</style>
