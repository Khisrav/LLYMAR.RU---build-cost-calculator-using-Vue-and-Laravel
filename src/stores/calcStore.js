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

            this.getUserData();

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
            this.discount = (100 - response.discount) / 100;
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
            const lrAmount = this.openings.reduce((acc, opening) => {
                if (opening.type !== "center") {
                    acc += opening.doors * 2 - 2;
                }
                return acc;
            }, 0);
        
            const cAmount = this.openings.reduce((acc, opening) => {
                if (opening.type === "center") {
                    acc += opening.doors * 2 - 4;
                }
                return acc;
            }, 0);
        
            const doorCounts = this.openings.reduce((acc, opening) => {
                acc[opening.type] = (acc[opening.type] || 0) + opening.doors;
                return acc;
            }, {});
        
            this.materials[this.material_type === "aluminium" ? 0 : 2].amount = lrAmount + cAmount;
            this.materials[this.material_type === "aluminium" ? 1 : 3].amount = doorCounts.center || 0;

            [2, 4].forEach(l => {
                this.profiles[`L${l}`].amount = this.profiles[`L${l - 1}`].amount;
            });
        },

        calculatePrice() {
            this.updateVendorsData();

            this.additionals.forEach(additional => {
                additional.total = additional.price * additional.amount * additional.discount;
            });

            this.materials.forEach(material => {
                material.total = parseInt(material.amount * material.price * material.discount);
            });

            Object.keys(this.profiles).forEach(key => {
                this.profiles[key].total = parseInt(this.profiles[key].amount * this.profiles[key].price * this.profiles[key].discount);
            });

            this.additionals.forEach(additional => {
                additional.total = additional.price * additional.amount * additional.discount;
            });
        }
    },
    getters: {
        totalPrice: (state) => {
            return state.materials.reduce((acc, material) => acc + material.total, 0);
        }
    }
});