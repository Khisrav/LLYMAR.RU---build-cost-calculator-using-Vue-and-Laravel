<script>
import ButtonTag from "../components/ButtonTag.vue";
import InputTag from "../components/InputTag.vue";
import HeaderLayout from "../layouts/HeaderLayout.vue";
import {
  calc,
  opening_images,
  material_type,
  materials,
  profiles,
  totals,
  autoProfiles,
  additionals,
} from "../core/data.js";
import { getUser } from "../core/user.js";
import axios from "axios";
import { API_BASE_URL, CHAT_ID, STORAGE_LINK, TELEGRAM_TOKEN } from "../core/config.js";

export default {
  components: {
    HeaderLayout,
    InputTag,
    ButtonTag,
  },
  data() {
    return {
      token: sessionStorage.getItem("token") || "",
      calc: null,
      opening_images: opening_images,
      material_type: null,
      materials: [],
      profiles: null,
      autoProfiles: null,
      totals: null,
      additionals: null,
      defaultAdditionals: null,
      username: "",
      user_id: null,
      showSuccess: false,
      showError: false,
      showAuthError: false,
      discount: 0,
      vendors: null,
      comment: "",
      telegramBotToken: TELEGRAM_TOKEN,
      chatId: CHAT_ID,
    };
  },
  async beforeMount() {
    this.calc = calc;
    this.material_type = material_type;
    // this.materials = materials;
    this.profiles = profiles;
    this.autoProfiles = autoProfiles;
    this.totals = totals;
    this.vendors = await axios
      .get(API_BASE_URL + "/vendors", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return;
      });

    let temp_indexes = {
      L6: 0,
      L12: 1,
      L13: 2,
      L14: 3,
      L15: 4,
      L16: 5,
      L17: 6,
      L18: 7,
      L19: 8,
      L20: 9,
      L21: 10,
      L22: 11,
      L26: 12,
    };
    this.vendors.forEach((vendor) => {
      if (vendor.vendor_code <= 5) {
        this.profiles[`L${vendor.vendor_code}`] = {
          img: STORAGE_LINK + vendor.img,
          price: parseInt(vendor.price),
          name: vendor.name,
          unit: vendor.unit,
          discount: vendor.discount || this.discount,
          amount: 0,
          total: 0,
        };
      } else if (
        vendor.vendor_code == 6 ||
        (vendor.vendor_code >= 12 && vendor.vendor_code <= 22) ||
        vendor.vendor_code == 26
      ) {
        this.autoProfiles[temp_indexes[`L${vendor.vendor_code}`]] = {
          vendor_code: `L${vendor.vendor_code}`,
          name: vendor.name,
          img: STORAGE_LINK + vendor.img,
          price: vendor.price,
          unit: vendor.unit,
          discount: vendor.discount || this.discount,
          amount: 0,
          total: 0,
        };
      }
    });

    let temp = await materials();
    temp.forEach((item) => {
      if (item.type != null && this.materials.length != 4) {
        this.materials.push({
          vendor_code: `L${item.vendor_code}`,
          name: item.name,
          img: STORAGE_LINK + item.img,
          type: item.type,
          unit: item.unit,
          price: parseInt(item.price),
          discount: item.discount || this.discount,
          amount: 0,
          total: 0,
        });
      }
    });

    this.additionals = await additionals();
    this.defaultAdditionals = additionals;
    this.additionals.forEach((item) => {
      item.total = 0;
      item.amount = 0;
      item.img = STORAGE_LINK + item.img;
    });

    this.getUserName();

    this.calculatePrice();
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", function (event) {
      document.getElementById("updateProductButton").click();
    });
  },
  methods: {
    changeMaterial() {
      if (this.material_type == "aluminium") {
        this.material_type = "polycarbonate";
      } else {
        this.material_type = "aluminium";
      }

      this.calculatePrice();
    },
    addOpening() {
      this.calc.openings.unshift({
        type: "left", // center or right
        name: "Левый проем",
        doors: 1,
        width: 3000,
        height: 2700,
      });
      this.calculatePrice();
    },
    removeOpening(index) {
      this.calc.openings.splice(index, 1);
      this.calculatePrice();
    },
    changeOpeningType(index) {
      if (this.calc.openings[index].type == "center") {
        this.calc.openings[index].doors = 4;
      } else {
        this.calc.openings[index].doors = 2;
      }
      this.calculatePrice();
    },
    updateMaterialsData() {
      let lrAmount = 0,
        cAmount = 0,
        onlyCentralAmount = 0;
      this.calc.openings.forEach((opening) => {
        if (opening.type != "center") lrAmount += opening.doors * 2 - 2;
        else {
          cAmount += opening.doors * 2 - 4;
          onlyCentralAmount++;
        }
        // else cAmount++;
      });

      let tempCentral = 0,
        tempLeft = 0,
        tempRight = 0;
      this.calc.openings.forEach((o) => {
        if (o.type == "center") {
          tempCentral += o.doors;
        } else if (o.type == "right") {
          tempRight += o.doors;
        } else if (o.type == "left") {
          tempLeft += o.doors;
        }
      });

      this.materials[this.material_type == "aluminium" ? 0 : 2].amount = parseInt(
        lrAmount + cAmount
      );
      this.materials[this.material_type == "aluminium" ? 1 : 3].amount = parseInt(
        this.material_type == "aluminium" ? onlyCentralAmount : onlyCentralAmount * 2
      );

      this.materials.forEach((material) => {
        material.total = parseInt(
          material.amount *
            material.price *
            (material.discount ? 1 - material.discount / 100 : this.discount)
        );
      });

      this.profiles["L1"].total =
        this.profiles["L1"].amount *
        this.profiles["L1"].price *
        (this.profiles["L1"].discount
          ? 1 - this.profiles["L1"].discount / 100
          : this.discount);
      this.profiles["L3"].total =
        this.profiles["L3"].amount *
        this.profiles["L3"].price *
        (this.profiles["L3"].discount
          ? 1 - this.profiles["L3"].discount / 100
          : this.discount);

      this.profiles["L2"].amount = this.profiles["L1"].amount;
      this.profiles["L2"].total =
        this.profiles["L2"].amount *
        this.profiles["L2"].price *
        (this.profiles["L2"].discount
          ? 1 - this.profiles["L2"].discount / 100
          : this.discount);
      this.profiles["L4"].amount = this.profiles["L3"].amount;
      this.profiles["L4"].total =
        this.profiles["L4"].amount *
        this.profiles["L4"].price *
        (this.profiles["L4"].discount
          ? 1 - this.profiles["L4"].discount / 100
          : this.discount);

      this.profiles["L5"].total =
        this.profiles["L5"].amount *
        this.profiles["L5"].price *
        (this.profiles["L5"].discount
          ? 1 - this.profiles["L5"].discount / 100
          : this.discount);

      this.profiles["L1"].total = parseInt(this.profiles["L1"].total);
      this.profiles["L2"].total = parseInt(this.profiles["L2"].total);
      this.profiles["L3"].total = parseInt(this.profiles["L3"].total);
      this.profiles["L4"].total = parseInt(this.profiles["L4"].total);
      this.profiles["L5"].total = parseInt(this.profiles["L5"].total);

      this.autoProfiles.forEach((autoProfile) => {
        autoProfile.amount = 0;
        switch (autoProfile.vendor_code) {
          case "L6":
            // calc.openings.forEach(opening => { autoProfile.amount += (parseInt(opening.doors) * 6); });
            autoProfile.amount = this.calc.openings.length * 6;
            break;
          case "L12":
            autoProfile.amount =
              this.profiles.L2.amount * 6 + this.profiles.L4.amount * 4;
            if (this.material_type == "aluminium") {
              autoProfile.amount += this.materials[1].amount * 9;
            } else {
              autoProfile.amount +=
                this.materials[2].amount * 3 + this.materials[3].amount * 3;
            }
            // this.profiles.L5.amount * 2 +
            // this.materials[2].amount * 3 +
            // this.materials[3].amount * 3;
            break;
          case "L13":
            autoProfile.amount =
              (this.material_type == "aluminium" ? this.materials[0].amount * 3 : 0) +
              parseInt(this.profiles["L5"].amount) * 2;
            break;
          case "L14":
            autoProfile.amount = this.autoProfiles[0].amount * 2;
            break;
          case "L15":
            autoProfile.amount =
              (tempCentral != 0 ? tempCentral / 2 - 1 : 0) +
              (tempRight != 0 ? tempRight - 1 : 0);
            break;
          case "L16":
            autoProfile.amount =
              (tempCentral != 0 ? tempCentral / 2 - 1 : 0) +
              (tempLeft != 0 ? 1 : 0) +
              tempRight;
            break;
          case "L17":
            autoProfile.amount = tempCentral != 0 ? 1 : 0;
            break;
          case "L18":
            autoProfile.amount =
              (tempLeft != 0 ? tempLeft - 1 : 0) +
              (tempCentral != 0 ? tempCentral / 2 - 1 : 0);
            break;
          case "L19":
            autoProfile.amount =
              (tempLeft != 0 ? tempLeft : 0) +
              (tempRight != 0 ? 1 : 0) +
              (tempCentral != 0 ? tempCentral / 2 - 1 : 0);
            break;
          case "L20":
            autoProfile.amount = tempCentral != 0 ? 1 : 0;
            break;
          case "L21":
            autoProfile.amount =
              (tempCentral != 0 ? tempCentral - 2 : 0) +
              (tempLeft != 0 ? tempLeft - 1 : 0) +
              (tempRight != 0 ? tempRight - 1 : 0);
            break;
          case "L22":
            autoProfile.amount =
              (tempCentral != 0 ? tempCentral - 4 : 0) +
              (tempLeft != 0 ? tempLeft - 2 : 0) +
              (tempRight != 0 ? tempRight - 2 : 0);
            break;
          case "L26":
            autoProfile.amount = (tempLeft + tempCentral + tempRight) * 2;
            break;
          default:
            break;
        }
        autoProfile.total = parseInt(
          autoProfile.amount *
            autoProfile.price *
            (autoProfile.discount ? 1 - autoProfile.discount / 100 : 1)
        );
      });

      this.additionals.forEach((item) => {
        item.total = parseInt(
          item.amount *
            item.price *
            (item.discount ? 1 - item.discount / 100 : this.discount)
        );
      });
    },
    calculatePrice() {
      this.updateMaterialsData();

      this.totals.totalPrice = 0;

      this.materials.forEach((material) => {
        if (material.type == this.material_type) this.totals.totalPrice += material.total;
      });

      ["L1", "L2", "L3", "L4", "L5"].forEach((index) => {
        this.totals.totalPrice += this.profiles[index].total;
      });

      this.autoProfiles.forEach((autoProfile) => {
        this.totals.totalPrice += autoProfile.total;
      });

      this.additionals.forEach((add) => {
        this.totals.totalPrice += parseInt(add.total);
      });

      // this.totals.totalPrice = (this.totals.totalPrice * (100 - this.discount)) / 100;

      this.collectTotals();
    },
    async getUserName() {
      const response = await getUser();
      this.username = response.name.split(" ")[1];
      this.discount = (100 - response.discount) / 100;
      this.user_id = response.id;
    },
    clearFields() {
      // this.calc = calc;
      // this.materials = materials;
      // this.material_type = material_type;
      // this.profiles = profiles;
      // this.autoProfiles = autoProfiles;
      // this.totals = totals;
      // this.additionals = this.defaultAdditionals;
    },
    collectTotals() {
      this.totals.materialType = this.material_type;

      //collectin openings data
      this.totals.openings = [];
      this.calc.openings.forEach((opening) => {
        this.totals.openings.push({
          type: opening.type,
          name: opening.name,
          doors: parseInt(opening.doors),
          width: parseInt(opening.width),
          height: parseInt(opening.height),
        });
      });

      //collecting vendor codes amount data
      this.totals.vendorCodes = {};
      this.materials.forEach((material) => {
        if (material.type == this.material_type && parseInt(material.amount) > 0) {
          let vendor_code = parseInt(material.vendor_code.replace(/\D/g, ""));
          this.totals.vendorCodes[vendor_code] = {
            id: vendor_code,
            type: material.type,
            amount: parseInt(material.amount),
            price: material.price,
            discount: material.discount,
          };
        }
      });
      for (let v_code in this.profiles) {
        let profile = this.profiles[v_code],
          vc = parseInt(v_code.replace(/\D/g, ""));
        if (profile.amount > 0) {
          this.totals.vendorCodes[vc] = {
            id: vc,
            type: undefined,
            amount: profile.amount,
            price: profile.price,
            discount: profile.discount,
          };
        }
        // profile.parseInt(v_code.replace(/\D/g,''));
      }
      this.autoProfiles.forEach((autoProfile) => {
        let vc = parseInt(autoProfile.vendor_code.replace(/\D/g, ""));
        if (autoProfile.amount > 0) {
          this.totals.vendorCodes[vc] = {
            id: vc,
            type: undefined,
            amount: autoProfile.amount,
            price: autoProfile.price,
            discount: autoProfile.discount,
          };
        }
      });

      this.totals.additionals = [];
      this.additionals.forEach((additional) => {
        additional.amount = parseInt(additional.amount);
        if (additional.amount > 0) {
          let vendor_code = additional.vendor_code;
          this.totals.additionals.push({
            id: vendor_code,
            type: additional.type,
            amount: additional.amount,
            price: additional.price,
            discount: additional.discount,
          });
        }
      });

      this.totals.comment = this.comment;
      console.log(this.totals);
    },
    noDiscountPrice() {
      let tempTotals = 0;

      this.materials.forEach((material) => {
        tempTotals += material.price * material.amount;
      });

      for (let v_code in this.profiles) {
        let profile = this.profiles[v_code];
        tempTotals += profile.price * profile.amount;
      }

      this.additionals.forEach((additional) => {
        tempTotals += additional.price * additional.amount;
      });

      this.autoProfiles.forEach((autoProfile) => {
        tempTotals += autoProfile.price * autoProfile.amount;
      });

      return tempTotals;
    },
    async sendTotals() {
      try {
        let tempPrice = this.totals.totalPrice;
        const response = await axios.post(
          API_BASE_URL + "/order",
          {
            material_type: this.totals.materialType,
            total_price: tempPrice,
            openings: this.totals.openings,
            vendor_codes: this.totals.vendorCodes,
            additionals: this.totals.additionals,
            comment: this.comment,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200) {
          this.toast(true);
          this.clearFields();

          if (this.sendMessage(response.data.order_id)) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } else {
          this.toast(401);
        }
      } catch (error) {
        this.toast(false);
      }
    },
    async sendMessage(order_id) {
      const message = `
<b>Новый расчет №${order_id}</b>
\n
<u>Тип профиля:</u> <code>${
        this.totals.materialType == "aluminium" ? "Алюминий" : "Поликарбонат"
      }</code>
<u>Комментарий:</u> <i>${this.comment}</i>
<u>Общая стоимость: </u> <code>${this.totals.totalPrice}₽</code>
\n
<a href='https://llymar.ru/generate-pdf/${this.user_id}-${order_id}'>Ссылка на PDF</a>`;
      try {
        await axios.post(
          `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
          {
            chat_id: this.chatId,
            text: message,
            parse_mode: "HTML",
          }
        );
        return true;
      } catch (error) {
        alert("Failed to send message. Please try again later.");
      }
    },
    printOrder() {
      print();
    },
    toast(bln) {
      if (bln == 401) {
        this.showAuthError = true;
      } else if (bln) {
        this.showSuccess = true;
      } else {
        this.showError = true;
      }
    },
  },
};
</script>

<template>
  <HeaderLayout class="print:hidden" :authorized="token.length != 0" />
  <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-0 print:pt-2">
    <h1
      class="mb-4 text-2xl uppercase font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl lg:mb-8 print:hidden"
    >
      Здравствуйте,
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r to-yellow-400 from-orange-600"
        >{{ username }}</span
      >!
    </h1>

    <main>
      <div class="block">
        <div class="flex justify-between py-4">
          <h3 class="text-xl lg:text-2xl uppercase font-bold">Проемы</h3>
          <ButtonTag type="button" @click="addOpening()" class="print:hidden"
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
                v-for="(opening, index) in calc.openings"
                :key="index"
                class="bg-white border-b hover:bg-gray-50"
              >
                <th scope="row" class="px-6 py-4">
                  <img
                    :src="opening_images[opening.type]"
                    class="rounded-xl max-w-20 md:max-w-60"
                  />
                </th>
                <td class="px-6 py-4 text-base font-semibold text-black">
                  <select
                    v-model="calc.openings[index].type"
                    @change="changeOpeningType(index)"
                    class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-54 p-2.5"
                  >
                    <option value="left">Левый проем</option>
                    <option value="right">Правый проем</option>
                    <option value="center">Центральный проем</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <!-- <InputTag type="number" v-model="calc.openings[index].doors" @change="calculatePrice()" class="text-center"/> -->
                  <div class="relative print:hidden">
                    <select
                      v-model="calc.openings[index].doors"
                      @change="calculatePrice()"
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
                    <!-- <input
                      type="range"
                      v-model="calc.openings[index].doors"
                      @change="calculatePrice()"
                      min="2"
                      max="10"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span class="text-sm text-black absolute start-0 -bottom-6">2</span>
                    <span
                      class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6"
                      >6</span
                    >
                    <span class="text-sm text-black absolute end-0 -bottom-6">10</span> -->
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="inline-flex w-48" role="group">
                    <InputTag
                      type="number"
                      v-model="calc.openings[index].width"
                      @change="calculatePrice()"
                      class="w-1/2 rounded-r-none text-center"
                    />
                    <InputTag
                      type="number"
                      v-model="calc.openings[index].height"
                      @change="calculatePrice()"
                      class="w-1/2 rounded-s-none text-center"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 print:hidden">
                  <!-- <ButtonTag @click="removeOpening(index)" class="font-medium text-white bg-red-700 hover:bg-black">Удалить</ButtonTag> -->
                  <button
                    type="button"
                    @click="removeOpening(index)"
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

      <div class="block">
        <h3 class="text-xl lg:text-2xl uppercase font-bold py-4 mt-8">Профиль</h3>
        <div class="shadow-2xl rounded-2xl shadow-primary-200">
          <div class="m-4">
            <div class="sm:hidden">
              <label for="tabs" class="sr-only">Выберите межстворочный профиль</label>
              <select
                @change="changeMaterial()"
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
                  @click="changeMaterial()"
                  class="inline-block w-full p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-s-lg"
                  :class="[
                    material_type == 'aluminium'
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
                  @click="changeMaterial()"
                  class="inline-block w-full p-4 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-r-lg"
                  :class="[
                    material_type == 'polycarbonate'
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
                  v-for="(material, index) in materials.filter((m) => {
                    return m.type == material_type;
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

      <div class="block">
        <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
          <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-primary-900 uppercase bg-primary-100">
                <tr>
                  <th scope="col" class="px-6 py-3">Картинка</th>
                  <th scope="col" class="px-6 py-3">Арт.</th>
                  <th scope="col" class="px-6 py-3">Наименование</th>
                  <th scope="col" class="px-6 py-3">Цена за ед.</th>
                  <th scope="col" class="px-6 py-3">Ед. изм.</th>
                  <th scope="col" class="px-6 py-3">Кол-во</th>
                  <th scope="col" class="px-6 py-3">Итого</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th scope="row" class="px-6 py-4">
                    <img
                      :src="profiles['L1'].img"
                      class="rounded-xl max-w-20 md:max-w-60"
                    />
                  </th>
                  <td class="px-6 py-4 text-black">L1</td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ profiles["L1"].name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L1"].price }}₽</td>
                  <td class="px-6 py-4">
                    {{ profiles["L1"].unit }}
                  </td>
                  <td class="px-6 py-4">
                    <!-- <div class="text-center font-bold text-black">
                      {{ profiles["L1"].amount }}
                    </div> -->
                    <div class="relative mb-6 print:hidden">
                      <select
                        v-model="profiles['L1'].amount"
                        @change="calculatePrice()"
                        class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option v-for="i in [0, 3, 6, 9, 12, 15, 18, 21, 24]" :value="i">
                          {{ i }}
                        </option>
                      </select>
                      <!-- <input
                        type="range"
                        v-model="profiles['L1'].amount"
                        @change="calculatePrice()"
                        min="0"
                        max="24"
                        step="3"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                      <span
                        class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6"
                        >12</span
                      >
                      <span class="text-sm text-black absolute end-0 -bottom-6">24</span> -->
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L1"].total }}₽</td>
                </tr>
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th scope="row" class="px-6 py-4">
                    <img
                      :src="profiles['L2'].img"
                      class="rounded-xl max-w-20 md:max-w-60"
                    />
                  </th>
                  <td class="px-6 py-4 text-black">L2</td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ profiles["L2"].name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L2"].price }}₽</td>
                  <td class="px-6 py-4">
                    {{ profiles["L2"].unit }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-center font-bold text-black">
                      {{ profiles["L2"].amount }}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L2"].total }}₽</td>
                </tr>

                <tr class="bg-white border-b hover:bg-gray-50">
                  <th scope="row" class="px-6 py-4">
                    <img
                      :src="profiles['L3'].img"
                      class="rounded-xl max-w-20 md:max-w-60"
                    />
                  </th>
                  <td class="px-6 py-4 text-black">L3</td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ profiles["L3"].name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L3"].price }}₽</td>
                  <td class="px-6 py-4">
                    {{ profiles["L3"].unit }}
                  </td>
                  <td class="px-6 py-4">
                    <!-- <div class="text-center font-bold text-black">
                      {{ profiles["L3"].amount }}
                    </div> -->
                    <div class="relative mb-6 print:hidden">
                      <select
                        v-model="profiles['L3'].amount"
                        @change="calculatePrice()"
                        class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option v-for="i in [0, 3, 6, 9, 12, 15, 18, 21, 24]" :value="i">
                          {{ i }}
                        </option>
                      </select>
                      <!-- <input
                        type="range"
                        v-model="profiles['L3'].amount"
                        @change="calculatePrice()"
                        min="0"
                        max="24"
                        step="3"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                      <span
                        class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6"
                        >12</span
                      >
                      <span class="text-sm text-black absolute end-0 -bottom-6">24</span> -->
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L3"].total }}₽</td>
                </tr>
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th scope="row" class="px-6 py-4">
                    <img
                      :src="profiles['L4'].img"
                      class="rounded-xl max-w-20 md:max-w-60"
                    />
                  </th>
                  <td class="px-6 py-4 text-black">L4</td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ profiles["L4"].name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L4"].price }}₽</td>
                  <td class="px-6 py-4">
                    {{ profiles["L4"].unit }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-center font-bold text-black">
                      {{ profiles["L4"].amount }}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L4"].total }}₽</td>
                </tr>

                <tr class="bg-white border-b hover:bg-gray-50">
                  <th scope="row" class="px-6 py-4">
                    <img
                      :src="profiles['L5'].img"
                      class="rounded-xl max-w-20 md:max-w-60"
                    />
                  </th>
                  <td class="px-6 py-4 text-black">L5</td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ profiles["L5"].name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L5"].price }}₽</td>
                  <td class="px-6 py-4">
                    {{ profiles["L5"].unit }}
                  </td>
                  <td class="px-6 py-4">
                    <!-- <div class="text-center font-bold text-black">
                      {{ profiles["L5"].amount }}
                    </div> -->
                    <div class="relative mb-6 print:hidden">
                      <select
                        v-model="profiles['L5'].amount"
                        @change="calculatePrice()"
                        class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option v-for="i in [0, 3, 6, 9, 12, 15, 18, 21, 24]" :value="i">
                          {{ i }}
                        </option>
                      </select>
                      <!-- <input
                        type="range"
                        v-model="profiles['L5'].amount"
                        @change="calculatePrice()"
                        min="3"
                        max="24"
                        step="3"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span class="text-sm text-black absolute start-0 -bottom-6">3</span>
                      <span
                        class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6"
                        >12</span
                      >
                      <span class="text-sm text-black absolute end-0 -bottom-6">24</span> -->
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ profiles["L5"].total }}₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
          <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-primary-900 uppercase bg-primary-100">
                <tr>
                  <th scope="col" class="px-6 py-3">Картинка</th>
                  <th scope="col" class="px-6 py-3">Арт.</th>
                  <th scope="col" class="px-6 py-3">Наименование</th>
                  <th scope="col" class="px-6 py-3">Цена за ед.</th>
                  <th scope="col" class="px-6 py-3">Ед. изм.</th>
                  <th scope="col" class="px-6 py-3">Кол-во</th>
                  <th scope="col" class="px-6 py-3">Итого</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(autoProfile, index) in autoProfiles"
                  :key="index"
                  class="bg-white border-b hover:bg-gray-50"
                >
                  <th scope="row" class="px-6 py-4">
                    <img :src="autoProfile.img" class="rounded-xl max-w-20 md:max-w-60" />
                  </th>
                  <td class="px-6 py-4 text-black">
                    {{ autoProfile.vendor_code }}
                  </td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ autoProfile.name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ autoProfile.price }}₽</td>
                  <td class="px-6 py-4">
                    {{ autoProfile.unit }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-center font-bold text-black">
                      {{ autoProfile.amount }}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ autoProfile.total }}₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="block">
        <h3 class="text-xl lg:text-2xl uppercase font-bold py-4 mt-8">Дополнительно</h3>
        <div class="shadow-2xl rounded-2xl shadow-primary-200">
          <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-primary-900 uppercase bg-primary-100">
                <tr>
                  <th scope="col" class="px-6 py-3">Арт.</th>
                  <th scope="col" class="px-6 py-3">Картинка</th>
                  <th scope="col" class="px-6 py-3">Наименование</th>
                  <th scope="col" class="px-6 py-3">Цена за ед.</th>
                  <th scope="col" class="px-6 py-3">Ед. изм.</th>
                  <th scope="col" class="px-6 py-3">Кол-во</th>
                  <th scope="col" class="px-6 py-3">Итого</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in additionals"
                  class="bg-white border-b hover:bg-gray-50"
                >
                  <td class="px-6 py-4 text-black">L{{ item.vendor_code }}</td>
                  <td class="px-6 py-4">
                    <img :src="item.img" class="rounded-xl max-w-20 md:max-w-60" />
                  </td>
                  <td class="px-6 py-4 font-semibold text-black">
                    {{ item.name }}
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ item.price }}₽</td>
                  <td class="px-6 py-4">
                    {{ item.unit }}
                  </td>
                  <td class="px-6 py-4 font-semibold">
                    <!-- <div class="text-center font-bold text-black">{{ item.amount }}</div> -->
                    <div class="relative mb-6 print:hidden">
                      <select
                        v-model="item.amount"
                        @change="calculatePrice()"
                        class="w-20 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option
                          v-for="i in [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                          ]"
                          :value="i"
                        >
                          {{ i }}
                        </option>
                      </select>
                      <!-- <input
                        type="range"
                        v-model="item.amount"
                        @change="calculatePrice()"
                        min="0"
                        max="24"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                      <span
                        class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6"
                        >12</span
                      >
                      <span class="text-sm text-black absolute end-0 -bottom-6">24</span> -->
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ item.total }}₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h1 class="hidden print:block text-4xl mt-10 mb-10">
        Итого:
        <b>
          {{
            discount != 0
              ? (totals.totalPrice * (100 - discount)) / 100
              : totals.totalPrice
          }}₽</b
        >
      </h1>
      <div class="my-16"></div>
    </main>

    <div
      class="print:hidden fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 overflow-hidden bg-white border border-gray-200 rounded-full bottom-4 left-1/2 shadow-2xl"
    >
      <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
        <div
          class="inline-flex flex-col items-center justify-center text-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <span class="line-through block text-sm">{{ noDiscountPrice() }} ₽</span>
          <span
            ><b
              >{{
                discount != 0
                  ? parseInt((totals.totalPrice * (100 - discount)) / 100)
                  : totals.totalPrice
              }}₽</b
            ></span
          >
        </div>
        <div
          class="inline-flex flex-col justify-center px-5 rounded-full dark:hover:bg-gray-800 group"
        >
          <button
            id="updateProductButton"
            data-modal-target="updateProductModal"
            data-modal-toggle="updateProductModal"
            type="button"
            class="flex-col justify-center rounded-e-fulltext-white bg-yellow-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              class="w-5 h-5 text-black dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
              />
            </svg>
            <span class="text-xs font-semibold">Отправить</span>
          </button>
        </div>

        <div
          class="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <button
            @click="printOrder()"
            data-tooltip-target="tooltip-profile"
            type="button"
            class="inline-flex flex-col items-center justify-center px-5 rounded-e-full group"
          >
            <svg
              class="w-5 h-5 text-black dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"
              />
            </svg>
            <span class="text-xs font-semibold">Печать</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    id="toast-success"
    v-if="showSuccess"
    class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        />
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Расчеты заказа отправлены.</div>
    <button
      @click="showSuccess = false"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
      data-dismiss-target="#toast-success"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>

  <div
    id="toast-danger"
    v-if="showError"
    class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
        />
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Упс... Что-то пошло не так.</div>
    <button
      @click="showError = false"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
      data-dismiss-target="#toast-danger"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>

  <div
    id="toast-danger"
    v-if="showAuthError"
    class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
        />
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Вы не авторизованы.</div>
    <button
      @click="showError = false"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
      data-dismiss-target="#toast-danger"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>

  <!-- Main modal -->
  <div
    id="updateProductModal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
  >
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <!-- Modal header -->
        <div
          class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Комментарий</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="updateProductModal"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <textarea
              id="description"
              v-model="comment"
              rows="5"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Ваш комментарий..."
            ></textarea>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <ButtonTag @click="sendTotals()" type="button"> Отправить </ButtonTag>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img.rounded-xl {
  max-height: 120px;
}
</style>
