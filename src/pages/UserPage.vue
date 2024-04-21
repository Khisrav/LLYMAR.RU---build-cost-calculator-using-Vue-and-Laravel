<script>
import ButtonTag from '../components/ButtonTag.vue'
import InputTag from '../components/InputTag.vue'
import HeaderLayout from '../layouts/HeaderLayout.vue'
import { calc, opening_images, material_type, materials, profiles, totals } from '../core/data'

export default {
    components: {
        HeaderLayout,
        InputTag,
        ButtonTag
    },
    data() {
        return {
            user: sessionStorage.getItem('user'),
            calc: calc,
            opening_images: opening_images,
            material_type: material_type,
            materials: materials,
            profiles: profiles,
            totals: totals,
        }
    },
    mounted() {
        if (!this.user) {this.$router.push('/login')}
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
        updateMaterialsData() {
            let lrAmount = 0, cAmount = 0;
            this.calc.openings.forEach(opening => {
                if (opening.type != 'center') lrAmount += (opening.doors * 2 - 2);
                else cAmount += (opening.doors * 2 - 4);
            });


            this.materials[this.material_type == 'aluminium' ? 0 : 2].amount = lrAmount;
            this.materials[this.material_type == 'aluminium' ? 1 : 3].amount = cAmount;

            this.materials.forEach(material => {
                material.total = material.amount * material.price;
            });

            console.log(this.materials)
        },
        calculatePrice() {
            console.log('change detected');
            this.updateMaterialsData();

            this.totals.totalPrice = 0;

            this.materials.forEach(material => {
                if (material.type == this.material_type) this.totals.totalPrice += material.total;
            });
        }
    }
}
</script>

<template>
<HeaderLayout :userinfo="user"/>
<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-0">
    <h1 class="mb-4 text-2xl uppercase font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl lg:mb-8">
        {{ totals.totalPrice }} Здравствуйте, 
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-yellow-400 from-orange-600">Александр</span>!
    </h1>

    <main>
        <div class="block">
            <div class="flex justify-between py-4">
                <h3 class="text-xl lg:text-2xl uppercase font-bold">Проемы</h3>
                <ButtonTag type="button" @click="addOpening()">Добавить проем</ButtonTag>
            </div>
            <div class="relative overflow-x-auto rounded-2xl shadow-2xl shadow-primary-200">
                <table class=" w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-primary-900 uppercase bg-primary-100">
                        <tr>
                            <th scope="col" class="px-6 py-3">Картинка</th>
                            <th scope="col" class="px-6 py-3">Вид проема</th>
                            <th scope="col" class="px-6 py-3">Кол-во створок</th>
                            <th scope="col" class="px-6 py-3 normal-case">Ш x В (в мм)</th>
                            <th scope="col" class="px-6 py-3">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(opening, index) in calc.openings" :key="index" class="bg-white border-b hover:bg-gray-50">
                            <th scope="row" class="px-6 py-4">
                                <img :src="opening_images[opening.type]" class="rounded-xl">
                            </th>
                            <td class="px-6 py-4 text-base font-semibold text-black">
                                <select v-model="calc.openings[index].type" @change="calculatePrice()" class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-54 p-2.5">
                                    <option value="left">Левый проем</option>
                                    <option value="right">Правый проем</option>
                                    <option value="center">Центральный проем</option>
                                </select>
                            </td>
                            <td class="px-6 py-4">
                                <!-- <InputTag type="number" v-model="calc.openings[index].doors" @change="calculatePrice()" class="text-center"/> -->
                                <div v-if="opening.type!='center'" class="relative mb-6">
                                    <input type="range" v-model="calc.openings[index].doors" @change="calculatePrice()" min="2" max="6" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                                    <span class="text-sm text-black absolute start-0 -bottom-6">2</span>
                                    <span class="text-sm text-black absolute start-1/2 -translate-x-1/2 -bottom-6">4</span>
                                    <span class="text-sm text-black absolute end-0 -bottom-6">6</span>
                                </div>
                                <div v-else class="relative mb-6">
                                    <input type="range" v-model="calc.openings[index].doors" @change="calculatePrice()" min="4" max="12" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
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
                            <td class="px-6 py-4">
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
                            <button type="button" @click="changeMaterial()" class="inline-block w-full p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-s-lg" :class="[material_type == 'aluminium' ? 'text-black bg-yelllow active' : 'bg-white hover:text-gray-700 hover:bg-primary-100']">Алюминиевый</button>
                        </li>
                        <li class="w-full focus-within:z-10">
                            <button type="button" @click="changeMaterial()" class="inline-block w-full p-4 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-r-lg" :class="[material_type == 'polycarbonate' ? 'text-black bg-yelllow active' : 'bg-white hover:text-gray-700 hover:bg-primary-100']">Поликарбонат</button>
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
                                    <img :src="material.img" class="rounded-xl">
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
                                    <img :src="material.img" class="rounded-xl">
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
    </main>

<!-- <div class="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 overflow-hidden bg-white border border-gray-200 rounded-full bottom-4 left-1/2 shadow-2xl shadow-primary-700">
    <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
        <div class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <span>ИТОГО: <b>26045₽</b></span>
        </div>
        <div class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <button type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-fulltext-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"/>
                </svg>
            </button>
        </div>

        <button data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full group">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"/>
            </svg>
            <span class="sr-only">Отпавить</span>
        </button>
    </div>
</div> -->

</div>
</template>

<style scoped>

</style>