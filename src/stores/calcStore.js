import { defineStore } from "pinia";
import { API_BASE_URL, CHAT_ID, TELEGRAM_TOKEN, STORAGE_LINK } from "../core/config";
import { additionals, calc, discountRate, material_type, opening_images, openings, totals, profiles } from "../core/data";
import { getUser } from '../core/user.js';
import axios from "axios";

export const useCalcStore = defineStore('calcStore', {
    state: () => ({
        token: sessionStorage.getItem('token') || '',
        openings: openings,
        opening_images: opening_images,
        material_type: material_type,
        materials: [],
        profiles: profiles,
        autoProfiles: [],
        // totals: totals,
        additionals: [],
        defaultAdditionals: [],
        username: '',
        user_id: null,
        showSuccess: false,
        showError: false,
        showAuthError: false,
        discount: 0,
        vendors: null,
        totals: {
            materialType: '',
            openings: [],
            additionals: [],
            vendorCodes: [],
            totalPrice: 0,
        },
        comment: '',
        telegramBotToken: TELEGRAM_TOKEN,
        chatId: CHAT_ID,
    }),
    actions: {
        async fetchVendors() {
            this.vendors = await axios.get(API_BASE_URL + '/vendors', {
                headers: { Authorization: `Bearer ${this.token}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.response);
                return;
            })

            this.additionals = await additionals();

            this.additionals.forEach((item) => {
                item.total = 0;
                item.amount = 0;
                item.img = STORAGE_LINK + item.img;
                item.discount = discountRate(item.discount || this.discount);
            });

            await this.getUserData();

            this.desctructureVendors();

            this.calculatePrice();

            return this.vendors;
        },

        desctructureVendors() {
            const temp_indexes = {
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
            }

            this.vendors.forEach(vendor => {
                if (vendor.vendor_code <= 5) {
                    console.log('DISCOUNT-RATE:', discountRate(vendor.discount || this.discount));
                    console.log(`L${vendor.vendor_code} discount | user discount: ${vendor.discount} | ${this.discount}`);
                    this.profiles[`L${vendor.vendor_code}`] = {};
                    this.profiles[`L${vendor.vendor_code}`] = {
                        img: STORAGE_LINK + vendor.img,
                        price: parseInt(vendor.price),
                        name: vendor.name,
                        unit: vendor.unit,
                        discount: discountRate(vendor.discount || this.discount),
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
                        discount: discountRate(vendor.discount || this.discount),
                        amount: 0,
                        total: 0,
                    };
                }

                if (vendor.type != null && this.materials.length != 4) {
                    this.materials.push({
                        vendor_code: `L${vendor.vendor_code}`,
                        name: vendor.name,
                        img: STORAGE_LINK + vendor.img,
                        type: vendor.type,
                        unit: vendor.unit,
                        price: parseInt(vendor.price),
                        discount: discountRate(vendor.discount || this.discount),
                        amount: 0,
                        total: 0,
                    });
                }
            });
        },

        async getUserData() {
            const response = await getUser();
            this.username = response.name.split(" ")[0];
            this.discount = response.discount;
            this.user_id = response.id;
        },

        addOpening() {
            this.openings.unshift({
                type: 'left',
                name: 'Левый проем',
                doors: 2,
                width: 3000,
                height: 2700,
            })
        },

        removeOpening(index) {
            this.openings.splice(index, 1);
        },

        changeOpeningType(index) {
            if (this.openings[index].type == "center") {
                this.openings[index].doors = 4;
            } else {
                this.openings[index].doors = 2;
            }
        },

        changeMaterial() {
            this.material_type = this.material_type == 'aluminium' ? 'polycarbonate' : 'aluminium';

            this.calculatePrice();
        },

        updateVendorsData() {
            let lrAmount = 0,
                cAmount = 0,
                onlyCentralAmount = 0;
            this.openings.forEach((opening) => {
                if (opening.type != "center") lrAmount += opening.doors * 2 - 2;
                else {
                    cAmount += opening.doors * 2 - 4;
                    onlyCentralAmount++;
                }
                // else cAmount++;
            });

            this.materials[this.material_type == "aluminium" ? 0 : 2].amount = parseInt(
                lrAmount + cAmount
              );
              this.materials[this.material_type == "aluminium" ? 1 : 3].amount = parseInt(
                this.material_type == "aluminium" ? onlyCentralAmount : onlyCentralAmount * 2
              );

            [2, 4].forEach(l => {
                this.profiles[`L${l}`].amount = this.profiles[`L${l - 1}`].amount;
            });

            this.updateAutoProfilesData();
        },

        calculatePrice() {
            this.updateVendorsData();

            this.materials.forEach(material => {
                material.total = parseInt(material.amount * material.price * material.discount);
            });

            Object.keys(this.profiles).forEach(key => {
                this.profiles[key].total = parseInt(this.profiles[key].amount * this.profiles[key].price * this.profiles[key].discount);
            });

            this.autoProfiles.forEach(autoProfile => {
                autoProfile.total = parseInt(autoProfile.amount * autoProfile.price * autoProfile.discount);
            });

            this.additionals.forEach(additional => {
                additional.total = parseInt(additional.price * additional.amount * additional.discount);
            });
        },

        noDiscountPrice() {
            let tempPrice = 0;

            this.materials.forEach(material => {
                tempPrice += parseInt(material.amount * material.price);
            });

            Object.keys(this.profiles).forEach(key => {
                tempPrice += parseInt(this.profiles[key].amount * this.profiles[key].price);
            });

            this.autoProfiles.forEach(autoProfile => {
                tempPrice += parseInt(autoProfile.amount * autoProfile.price);
            });

            this.additionals.forEach(additional => {
                tempPrice += additional.price * additional.amount;
            });

            return tempPrice;
        },

        updateAutoProfilesData() {
            let tempCentral = 0,
                tempLeft = 0,
                tempRight = 0;
            this.openings.forEach((o) => {
                if (o.type == "center")     { tempCentral += o.doors; }
                else if (o.type == "right") { tempRight   += o.doors; }
                else if (o.type == "left")  { tempLeft    += o.doors; }
            });

            this.autoProfiles.forEach(autoProfile => {
                autoProfile.amount = 0;
                switch (autoProfile.vendor_code) {
                  case "L6":
                    autoProfile.amount = this.openings.length * 6;
                    break;
                  case "L12":
                    autoProfile.amount = this.profiles.L2.amount * 6 + this.profiles.L4.amount * 4;
                    if (this.material_type == "aluminium") {
                        autoProfile.amount += this.materials[1].amount * 9;
                    } else {
                        autoProfile.amount += this.materials[2].amount * 3 + this.materials[3].amount * 3;
                    }
                    break;
                  case "L13":
                    autoProfile.amount = (this.material_type == "aluminium" ? this.materials[0].amount * 3 : 0) + parseInt(this.profiles["L5"].amount) * 2;
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
            });
        },

        collectTotals() {
            this.totals.materialType = this.material_type;

            //collectin openings data
            this.totals.openings = [];
            this.openings.forEach((opening) => {
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
                let profile = this.profiles[v_code], vc = parseInt(v_code.replace(/\D/g, ""));
                if (profile.amount > 0) {
                    this.totals.vendorCodes[vc] = {
                        id: vc,
                        type: undefined,
                        amount: profile.amount,
                        price: profile.price,
                        discount: profile.discount,
                    };
                }
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
        },

        async sendTotals() {
            this.collectTotals();

            try {
                console.log('sending...');
                const response = await axios.post(
                    API_BASE_URL + "/order",
                    {
                        material_type: this.totals.materialType,
                        total_price: this.totals.totalPrice,
                        openings: this.totals.openings,
                        vendor_codes: this.totals.vendorCodes,
                        additionals: this.totals.additionals,
                        comment: this.totals.comment,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    }
                );
      
              if (response.status === 200) {
                    this.toast(true);
        
                    if (await this.sendMessage(response.data.order_id)) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
              } else {
                    this.toast(401);
              }
            } catch (error) {
                console.log(error);
                this.toast(false);
            }
        },

        async sendMessage(order_id) {
            const message = `<b>Новый расчет №${order_id}</b>\n\n<u>Тип профиля:</u> <code>${this.totals.materialType == "aluminium" ? "Алюминий" : "Поликарбонат"}</code>\n<u>Комментарий:</u> <i>${this.comment}</i>\n<u>Общая стоимость: </u> <code>${this.totals.totalPrice}₽</code>\n<a href='https://llymar.ru/generate-pdf/${this.user_id}-${order_id}'>Ссылка на PDF</a>`;
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
    getters: {
        totalPrice: (state) => {
            const materials_price = state.materials.reduce((acc, material) => acc + material.total, 0);
            const autoProfiles_price = state.autoProfiles.reduce((acc, autoProfile) => acc + autoProfile.total, 0);
            const additionals_price = state.additionals.reduce((acc, additional) => acc + additional.total, 0);

            let profiles_price = 0;
            Object.keys(state.profiles).forEach(key => profiles_price += state.profiles[key].total);

            state.totals.totalPrice = materials_price + autoProfiles_price + additionals_price + profiles_price;

            return state.totals.totalPrice;
        }
    }
});