<script>
import HeaderLayout from '../layouts/HeaderLayout.vue'
import axios from 'axios'
import { API_BASE_URL } from '../core/config.js'

export default {
    components: {
        HeaderLayout
    },
    data() {
        return {
            token: sessionStorage.getItem('token'),
            orders: []
        }
    },
    async beforeMount() {
        this.orders = await axios.get(API_BASE_URL + '/user/history', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            alert(`Ошибка: ${error}`)
        });

        this.orders.reverse();
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);

            const monthNames = [
                "Янв", "Фев", "Мар", "Апр", "Май", "Июня", "Июля",
                "Авг", "Сен", "Окт", "Ноя", "Дек"
            ];

            const year = date.getFullYear();
            const month = monthNames[date.getMonth()];
            const day = String(date.getDate());
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            const formattedDate = `${hours}:${minutes}, ${month} ${day}`;

            return formattedDate;
        },
        formatNumber(number) {
            const numberString = String(number);

            if (numberString.length > 3) {
                const formattedNumber = numberString.slice(0, -3) + ' ' + numberString.slice(-3);
                return formattedNumber;
            } else {
                return numberString;
            }
        }
    }
}
</script>

<template>
    <HeaderLayout :authorized="token.length != 0"/>
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12 lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900">История расчетов</h2>

        <div class="grid lg:grid-cols-3 gap-4 text-sm">
            <div v-for="(order, index) in orders" :key="index" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <h5 class="m-0 mb-2 text-xl font-bold tracking-tight text-gray-900">Расчет #{{ order.id }}</h5>
                <p class="font-normal text-gray-700 mt-3">
                    Статус: 
                    <span v-if="order.status == 'completed'" class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded float-right">
                        Выполнен
                    </span>
                    <span v-else class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded float-right">
                        В обработке
                    </span>
                </p>
                <p class="fonta-normal text-gray-700 mt-3">
                    Материал профиля:
                    <span class="float-right font-semibold">{{ order.material_type == 'aluminium' ? 'Алюминий' : 'Поликарбонат' }}</span>
                </p>
                <p class="fonta-normal text-gray-700 mt-3">
                    Дата создания: 
                    <span class="float-right font-semibold">{{ formatDate(order.created_at) }}</span>
                </p>
                <p class="fonta-normal text-gray-700 mt-3">
                    Общая стоимость: 
                    <span class="float-right font-semibold">{{ formatNumber(order.total_price) }} ₽</span>
                </p>
            </div>
        </div>
    </div>
</template>