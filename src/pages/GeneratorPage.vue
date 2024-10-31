<script>
import axios from "axios";
import { API_BASE_URL, STORAGE_LINK } from "../core/config";
import { additionals, discountRate, opening_images } from "../core/data";
import ButtonLink from "../components/ButtonLink.vue";

export default {
  components: {
    ButtonLink,
  },
  data() {
    return {
      order: [],
      additionals: [],
      vendorsAmount: [],
      openings: [],
      user: [],
      opening_images: opening_images,
      vendors: [],
      items: [],
      totalImages: 0,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        API_BASE_URL + `/pdf/${this.$route.params.userID}/${this.$route.params.orderID}`,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );

      if (response.data) {
        this.user = response.data.user;
        this.order = response.data.order;
        this.additionals = response.data.additionals;
        this.vendorsAmount = response.data.vendorsAmount;
        this.openings = response.data.openings;
        this.vendors = response.data.vendors;
        this.items = response.data.items;

        this.processDiscounts();

        var timeoutRef = setTimeout(() => {
          let isPrinted = false;
          var intervalRef = setInterval(() => {
            this.checkImages((allLoaded) => {
              if (allLoaded) {
                print();
                isPrinted = true;
                clearInterval(intervalRef); // Clear the interval
                clearTimeout(timeoutRef); // Clear the timeout
              }
            });
          }, 100);
        }, 300);
      } else {
        console.error("Empty response data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    processDiscounts() {
      console.log("processing discounts");
      console.log(this.additionals);
      Object.values(this.additionals).forEach((add) => {
        add.discount = discountRate(add.discount || this.user.discount);
      });

      Object.values(this.vendorsAmount).forEach((vendor) => {
        vendor.discount = discountRate(vendor.discount || this.user.discount);
      });
    },
    checkImages(callback) {
      var imgs = document.images,
        len = imgs.length,
        counter = 0;

      [].forEach.call(imgs, function (img) {
        if (img.complete) {
          incrementCounter();
        } else {
          img.addEventListener("load", incrementCounter, false);
        }
      });

      function incrementCounter() {
        counter++;
        if (counter === len) {
          callback(true);
        }
      }
    },
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
    async userInfo(userID) {
      console.log(this.openings[0]);
      try {
        const response = await axios.get(API_BASE_URL + "/user", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });

        if (response.data) {
          this.user = response.data;
          console.log(this.user);
          // setTimeout(() => {
          //   print();
          // }, 300);
        } else {
          console.error("Empty response data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getVendorImage(vendor_id) {
      let temp;
      this.vendors.forEach((v) => {
        if (v.vendor_code == vendor_id) {
          temp = STORAGE_LINK + v.img;
        }
      });
      return temp;
    },
    getVendorName(vendor_id) {
      let temp;
      this.vendors.forEach((v) => {
        if (v.vendor_code == vendor_id) {
          temp = v.name;
        }
      });
      return temp;
    },
    getItemName(item_id) {
      let temp;
      this.items.forEach((i) => {
        if (i.vendor_code == item_id) {
          temp = i.name;
        }
      });
      return temp;
    },
    getItemImage(item_id) {
      let temp;
      this.items.forEach((i) => {
        if (i.vendor_code == item_id) {
          temp = STORAGE_LINK + i.img;
        }
      });
      return temp;
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
        <sup>*</sup>Общая стоимость:
        <span class="float-right font-semibold"
          >{{ formatNumber(order.total_price) }} ₽</span
        >
      </p>
      <span class="text-xs text-slate-400 mb-3 inline-block"
        ><sup>*</sup>Общая стоимость указана с учетом скидок</span
      >
      <hr class="border-1" />
      <p class="fonta-normal text-gray-700 mt-3">
        Ф.И.О:
        <span class="float-right font-semibold">{{ user.name }}</span>
      </p>
      <p class="fonta-normal text-gray-700 mt-3">
        Почта:
        <a :href="`mailto:${user.email}`" class="float-right font-semibold">{{
          user.email
        }}</a>
      </p>
      <p class="fonta-normal text-gray-700 mt-3">
        Телефон:
        <a :href="`tel:${user.phone}`" class="float-right font-semibold">{{
          user.phone
        }}</a>
      </p>
      <p v-if="user.company" class="fonta-normal text-gray-700 mt-3">
        Организация:
        <span class="float-right font-semibold">{{ user.company }}</span>
      </p>
      <p v-if="user.address" class="fonta-normal text-gray-700 mt-3">
        Адрес:
        <span class="float-right font-semibold">{{ user.address }}</span>
      </p>
    </div>

    <h5 class="mb-3 mt-12 text-xl font-bold tracking-tight text-gray-900 uppercase">
      Проемы
    </h5>
    <table class="w-full">
      <thead>
        <tr>
          <th>Картинка</th>
          <th>Тип проема</th>
          <th>Кол-во створок</th>
          <th>Ш x В (мм)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(opening, index) in openings" :key="index">
          <td>
            <img :src="opening_images[opening.type]" style="max-width: 300px" />
          </td>
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
          <th>Картинка</th>
          <th>Наименование</th>
          <th>Арт.</th>
          <th>Цена</th>
          <th>Кол-во</th>
          <th>Итого</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vendor, index) in vendorsAmount" :key="index">
          <td>
            <img
              :src="getVendorImage(vendor.vendor_code_id)"
              style="max-width: 150px; max-height: 150px"
            />
          </td>
          <td>{{ getVendorName(vendor.vendor_code_id) }}</td>
          <td>L{{ vendor.vendor_code_id }}</td>
          <td>{{ vendor.price }}</td>
          <td>{{ vendor.amount }}</td>
          <td>{{ parseInt(vendor.price * vendor.amount * vendor.discount) }} ₽</td>
        </tr>
        <tr
          v-if="additionals.length != 0"
          v-for="(item, index) in additionals"
          :key="index"
        >
          <td>
            <img
              :src="getItemImage(item.item_id)"
              style="max-width: 150px; max-height: 150px"
            />
          </td>
          <td>{{ getItemName(item.item_id) }}</td>
          <td>L{{ item.item_id }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ parseInt(item.price * item.amount * item.discount) }} ₽</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  border: 1px solid #000;
  padding: 4px;
  text-align: center;
}
</style>
