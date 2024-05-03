<script>
import ButtonTag from '../components/ButtonTag.vue'
import InputTag from '../components/InputTag.vue'
import HeaderLayout from '../layouts/HeaderLayout.vue'
import { calc, opening_images, material_type, materials, profiles, totals, autoProfiles, additionals } from '../core/data.js'
import { getUser } from '../core/user.js'
import axios from 'axios'
import { API_BASE_URL } from '../core/config.js'

export default {
    components: {
        HeaderLayout,
        InputTag,
        ButtonTag
    },
    data() {
        return {
            token: sessionStorage.getItem('token') || '',
            calc: null,
            opening_images: opening_images,
            material_type: null,
            materials: null,
            profiles: null,
            autoProfiles: null,
            totals: null,
            additionals: null,
            defaultAdditionals: null,
            username: '',
            showSuccess: false,
            showError: false,
            showAuthError: false
        }
    },
    async beforeMount() {
        this.calc = calc;
        this.material_type = material_type;
        this.materials = materials;
        this.profiles = profiles;
        this.autoProfiles = autoProfiles;
        this.totals = totals;

        this.additionals = await additionals();
        this.defaultAdditionals = additionals;
        this.additionals.forEach(item => {
            item.total = 0;
            item.amount = 0;
        });

        this.getUserName();

        this.calculatePrice();
    },
    methods: {
        changeMaterial() {
            if (this.material_type == 'aluminium') {
                this.material_type = 'polycarbonate';
            }
            else { 
                this.material_type = 'aluminium';
            }

            this.calculatePrice();
        },
        addOpening() {
            this.calc.openings.unshift({
                type: 'left', // center or right
                name: 'Левый проем',
                doors: 1,
                width: 3000,
                height: 2700
            });
            this.calculatePrice();
        },
        removeOpening(index) {
            this.calc.openings.splice(index, 1);
            this.calculatePrice();
        },
        changeOpeningType(index) {
            if (this.calc.openings[index].type == 'center') {
                this.calc.openings[index].doors = 4;
            } else {
                this.calc.openings[index].doors = 2;
            }
            this.calculatePrice();
        },
        updateMaterialsData() {
            let lrAmount = 0, cAmount = 0;
            this.calc.openings.forEach(opening => {
                if (opening.type != 'center') lrAmount += (opening.doors * 2 - 2);
                // else cAmount += (opening.doors * 2 - 4);
                else cAmount++;
            });


            this.materials[this.material_type == 'aluminium' ? 0 : 2].amount = parseInt(lrAmount + cAmount);
            this.materials[this.material_type == 'aluminium' ? 1 : 3].amount = parseInt(this.material_type == 'aluminium' ?  cAmount != 0 ? 1 : 0 : cAmount);

            this.materials.forEach(material => {
                material.total = material.amount * material.price;
            });

            this.profiles['L1'].total = this.profiles['L1'].amount * this.profiles['L1'].price;
            this.profiles['L3'].total = this.profiles['L3'].amount * this.profiles['L3'].price;

            this.profiles['L2'].amount = this.profiles['L1'].amount;
            this.profiles['L2'].total = this.profiles['L2'].amount * this.profiles['L2'].price;
            this.profiles['L4'].amount = this.profiles['L3'].amount;
            this.profiles['L4'].total = this.profiles['L4'].amount * this.profiles['L4'].price;

            this.profiles['L5'].total = this.profiles['L5'].amount * this.profiles['L5'].price;


            this.autoProfiles.forEach(autoProfile => {
                autoProfile.amount = 0;
                switch (autoProfile.vendor_code) {
                    case 'L6':
                        // calc.openings.forEach(opening => { autoProfile.amount += (parseInt(opening.doors) * 6); });
                        autoProfile.amount = this.calc.openings.length * 2;
                        break;
                    case 'L12':
                        autoProfile.amount = 
                            this.profiles.L2.amount * 6
                            + this.profiles.L4.amount * 4 
                            + this.profiles.L5.amount * 2 
                            + this.materials[2].amount * 3 
                            + this.materials[3].amount * 3;
                        break;
                    case 'L13':
                        autoProfile.amount = this.materials[0].amount * 3;
                        break;
                    case 'L14':
                        autoProfile.amount = this.autoProfiles[0].amount * 2;
                        break;
                    default:
                        break;
                }
                autoProfile.total = autoProfile.amount * autoProfile.price;
            });

            this.additionals.forEach(item => {
                item.total = item.amount * item.price;
            });

            console.log(this.calc.openings, calc.openings);
        },
        calculatePrice() {
            this.updateMaterialsData();

            this.totals.totalPrice = 0;

            this.materials.forEach(material => {
                if (material.type == this.material_type) this.totals.totalPrice += material.total;
            });

            ['L1', 'L2', 'L3', 'L4', 'L5'].forEach(index => {
                this.totals.totalPrice += this.profiles[index].total;
            });

            this.autoProfiles.forEach(autoProfile => {
                this.totals.totalPrice += autoProfile.total;
            });

            this.collectTotals();
        },
        async getUserName() {
            const response = await getUser();
            this.username = response.name.split(' ')[1];
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
            this.calc.openings.forEach(opening => {
                this.totals.openings.push({
                    type: opening.type,
                    name: opening.name,
                    doors: parseInt(opening.doors),
                    width: parseInt(opening.width),
                    height: parseInt(opening.height)
                });
            });

            //collecting vendor codes amount data
            this.totals.vendorCodes = {};
            this.materials.forEach(material => {
                if (material.type == this.material_type) {
                    let vendor_code = parseInt(material.vendor_code.replace(/\D/g,''));
                    this.totals.vendorCodes[vendor_code] = {
                        id: vendor_code,
                        type: material.type,
                        amount: parseInt(material.amount),
                        price: material.price
                    };
                }
            });
            for (let v_code in this.profiles) {
                let profile = this.profiles[v_code], vc = parseInt(v_code.replace(/\D/g,''));
                this.totals.vendorCodes[vc] = {
                    id: vc,
                    type: undefined,
                    amount: profile.amount,
                    price: profile.price
                };
                // profile.parseInt(v_code.replace(/\D/g,''));
            }

            this.totals.additionals = [];
            this.additionals.forEach(additional => {
                additional.amount = parseInt(additional.amount);
                if (additional.amount != 0) {
                    let vendor_code = additional.vendor_code; 
                    console.log(vendor_code);
                    this.totals.additionals.push({
                        id: vendor_code,
                        type: additional.type,
                        amount: additional.amount,
                        price: additional.price
                    });
                }
            });
        },
        async sendTotals() {
            try {
                const response = await axios.post(API_BASE_URL + '/order', {
                    material_type: this.totals.materialType,
                    total_price: this.totals.totalPrice,
                    openings: this.totals.openings,
                    vendor_codes: this.totals.vendorCodes,
                    additionals: this.totals.additionals
                }, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                if (response.status === 200) { this.toast(true);this.clearFields(); }
                else { this.toast(401); }
            } catch (error) {
                this.toast(false);
            }
        },
        printOrder() {
            print();
        },
        toast(bln) {
            if (bln == 401) { this.showAuthError = true; }
            else if (bln) { this.showSuccess = true; }
            else { this.showError = true; }
        }
    }
}
</script>

<template>
<HeaderLayout class="print:hidden" :authorized="token.length != 0"/>
<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-0 print:pt-2">
    <h1 class="mb-4 text-2xl uppercase font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl lg:mb-8 print:hidden">
        Здравствуйте, 
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-yellow-400 from-orange-600">{{ username }}</span>!
    </h1>

    <main>
        <div class="block">
            <div class="flex justify-between py-4">
                <h3 class="text-xl lg:text-2xl uppercase font-bold">Проемы</h3>
                <ButtonTag type="button" @click="addOpening()" class=" print:hidden">Добавить проем</ButtonTag>
            </div>
            <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
                <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
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
                        <tr v-for="(opening, index) in calc.openings" :key="index" class="bg-white border-b hover:bg-gray-50">
                            <th scope="row" class="px-6 py-4">
                                <img :src="opening_images[opening.type]" class="rounded-xl min-w-48 max-w-60">
                            </th>
                            <td class="px-6 py-4 text-base font-semibold text-black">
                                <select v-model="calc.openings[index].type" @change="changeOpeningType(index)" class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-54 p-2.5">
                                    <option value="left">Левый проем</option>
                                    <option value="right">Правый проем</option>
                                    <option value="center">Центральный проем</option>
                                </select>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-center font-bold text-black">{{ opening.doors }}</div>
                                <!-- <InputTag type="number" v-model="calc.openings[index].doors" @change="calculatePrice()" class="text-center"/> -->
                                <div v-if="opening.type!='center'" class="relative mb-6 print:hidden">
                                    <input type="range" v-model="calc.openings[index].doors" @change="calculatePrice()" min="2" max="10" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                    <span class="text-sm text-black absolute start-0 -bottom-6">2</span>
                                    <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">6</span>
                                    <span class="text-sm text-black absolute end-0 -bottom-6">10</span>
                                </div>
                                <div v-else class="relative mb-6 print:hidden">
                                    <input type="range" v-model="calc.openings[index].doors" @change="calculatePrice()" min="4" max="12" step="2" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                    <span class="text-sm text-black absolute start-0 -bottom-6">4</span>
                                    <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">8</span>
                                    <span class="text-sm text-black absolute end-0 -bottom-6">12</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="inline-flex w-48" role="group">
                                    <InputTag type="number" v-model="calc.openings[index].width" @change="calculatePrice()" class=" w-1/2 rounded-r-none text-center"/>
                                    <InputTag type="number" v-model="calc.openings[index].height" @change="calculatePrice()" class=" w-1/2 rounded-s-none text-center"/>
                                </div>
                            </td>
                            <td class="px-6 py-4 print:hidden">
                                <!-- <ButtonTag @click="removeOpening(index)" class="font-medium text-white bg-red-700 hover:bg-black">Удалить</ButtonTag> -->
                                <button type="button" @click="removeOpening(index)" class="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
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
                        <select @change="changeMaterial()" id="tabs" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option>Алюминиевый</option>
                            <option>Поликарбонат</option>
                        </select>
                    </div>
                    <ul class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex">
                        <li class="w-full focus-within:z-10">
                            <button type="button" @click="changeMaterial()" class="inline-block w-full p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-s-lg" :class="[material_type == 'aluminium' ? 'text-black bg-yellow-300 active font-bold' : 'bg-white hover:text-gray-700 hover:bg-primary-100']">Алюминиевый</button>
                        </li>
                        <li class="w-full focus-within:z-10">
                            <button type="button" @click="changeMaterial()" class="inline-block w-full p-4 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-r-lg" :class="[material_type == 'polycarbonate' ? 'text-black bg-yellow-300 active font-bold' : 'bg-white hover:text-gray-700 hover:bg-primary-100']">Поликарбонат</button>
                        </li>
                    </ul>
                </div>

                <div class="mt-6 relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
                    <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
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
                            <tr v-for="(material, index) in materials.filter((m) => { return m.type == material_type })" :key="index" class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="material.img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    {{ material.vendor_code }}
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ material.name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ material.price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ material.unit }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ material.amount }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ material.total }}₽
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="block">
            <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
                <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
                    <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
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
                                    <img :src="profiles['L1'].img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    L1
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ profiles['L1'].name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L1'].price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ profiles['L1'].unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ profiles['L1'].amount }}</div>
                                    <div class="relative mb-6 print:hidden">
                                        <input type="range" v-model="profiles['L1'].amount" @change="calculatePrice()" min="0" max="24" step="3" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                        <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                                        <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">12</span>
                                        <span class="text-sm text-black absolute end-0 -bottom-6">24</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L1'].total }}₽
                                </td>
                            </tr>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="profiles['L2'].img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    L2
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ profiles['L2'].name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L2'].price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ profiles['L2'].unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ profiles['L2'].amount }}</div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L2'].total }}₽
                                </td>
                            </tr>

                            
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="profiles['L3'].img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    L3
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ profiles['L3'].name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L3'].price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ profiles['L3'].unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ profiles['L3'].amount }}</div>
                                    <div class="relative mb-6 print:hidden">
                                        <input type="range" v-model="profiles['L3'].amount" @change="calculatePrice()" min="0" max="24" step="3" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                        <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                                        <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">12</span>
                                        <span class="text-sm text-black absolute end-0 -bottom-6">24</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L3'].total }}₽
                                </td>
                            </tr>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="profiles['L4'].img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    L4
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ profiles['L4'].name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L4'].price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ profiles['L4'].unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ profiles['L4'].amount }}</div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L4'].total }}₽
                                </td>
                            </tr>

                            <tr class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="profiles['L5'].img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    L5
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ profiles['L5'].name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L5'].price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ profiles['L5'].unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ profiles['L5'].amount }}</div>
                                    <div class="relative mb-6 print:hidden">
                                        <input type="range" v-model="profiles['L5'].amount" @change="calculatePrice()" min="3" max="24" step="3" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                        <span class="text-sm text-black absolute start-0 -bottom-6">3</span>
                                        <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">12</span>
                                        <span class="text-sm text-black absolute end-0 -bottom-6">24</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ profiles['L5'].total }}₽
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="block">
            <div class="shadow-2xl mt-8 pt-8 rounded-2xl shadow-primary-200">
                <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
                    <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
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
                            <tr v-for="(autoProfile, index) in autoProfiles" :key="index" class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4">
                                    <img :src="autoProfile.img" class="rounded-xl min-w-48 max-w-60">
                                </th>
                                <td class="px-6 py-4 text-black">
                                    {{ autoProfile.vendor_code }}
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ autoProfile.name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ autoProfile.price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ autoProfile.unit }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-center font-bold text-black">{{ autoProfile.amount }}</div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ autoProfile.total }}₽
                                </td>
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
                    <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs text-primary-900 uppercase bg-primary-100">
                            <tr>
                                <!-- <th scope="col" class="px-6 py-3">Картинка</th> -->
                                <th scope="col" class="px-6 py-3">Арт.</th>
                                <th scope="col" class="px-6 py-3">Наименование</th>
                                <th scope="col" class="px-6 py-3">Цена за ед.</th>
                                <th scope="col" class="px-6 py-3">Ед. изм.</th>
                                <th scope="col" class="px-6 py-3">Кол-во</th>
                                <th scope="col" class="px-6 py-3">Итого</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in additionals" class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 text-black">
                                    L{{ item.vendor_code }}
                                </td>
                                <td class="px-6 py-4 font-semibold text-black">
                                    {{ item.name }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ item.price }}₽
                                </td>
                                <td class="px-6 py-4">
                                    {{ item.unit }}
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    <div class="text-center font-bold text-black">{{ item.amount }}</div>
                                    <div class="relative mb-6 print:hidden">
                                        <input type="range" v-model="item.amount" @change="calculatePrice()" min="0" max="24" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                        <span class="text-sm text-black absolute start-0 -bottom-6">0</span>
                                        <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">12</span>
                                        <span class="text-sm text-black absolute end-0 -bottom-6">24</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-semibold">
                                    {{ item.total }}₽
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <h1 class="hidden print:block text-4xl mt-10 mb-10">Итого: <b> {{ totals.totalPrice }}₽</b></h1>
        <div class="my-16"></div>
    </main>

<div class="print:hidden fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 overflow-hidden bg-white border border-gray-200 rounded-full bottom-4 left-1/2 shadow-2xl">
    <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
        <div class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <span><b>{{ totals.totalPrice }}₽</b></span>
        </div>
        <div class="inline-flex flex-col justify-center px-5 rounded-full dark:hover:bg-gray-800 group">
            <button @click="sendTotals()" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-fulltext-white bg-yellow-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-5 h-5 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/>
                </svg>
                <span class="text-xs font-semibold">Отправить</span>
            </button>
        </div>

        <div class="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <button data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full group">
                <svg @click="printOrder()" class="w-5 h-5 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"/>
                </svg>
                <span class="text-xs font-semibold">Печать</span>
            </button>
        </div>
    </div>
</div>

</div>

<div id="toast-success" v-if="showSuccess" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="sr-only">Check icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Расчеты заказа отправлены.</div>
    <button @click="showSuccess = false" type="button" class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>

<div id="toast-danger" v-if="showError" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Упс... Что-то пошло не так.</div>
    <button @click="showError = false" type="button" class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>

<div id="toast-danger" v-if="showAuthError" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Вы не авторизованы.</div>
    <button @click="showError = false" type="button" class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>
</template>

<style scoped>

</style>