import axios from "axios";
import { API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const additionals = async () => {
    try {
        const response = await api.get("/items", { headers: { 'Authorization': `Bearer ${ sessionStorage.getItem('token') }` } });
        return response.data;
    } catch (error) { return error; }
};

export const opening_images = {
    left: 'https://random.imagecdn.app/300/149',
    right: 'https://random.imagecdn.app/300/151',
    center: 'https://random.imagecdn.app/300/150',
};
export let calc = {
    openings: [
        {
            type: 'left', // center or right
            name: 'Левый проем',
            doors: 2,
            width: 3000,
            height: 2700
        },
        {
            type: 'right',
            name: 'Правый проем',
            doors: 2,
            width: 3000,
            height: 2700
        },
        {
            type: 'center', 
            name: 'Центральный проем',
            doors: 4,
            width: 3000,
            height: 2700
        },
    ]
};
export let material_type = 'aluminium';
export let materials = [
    {
        type: 'aluminium',
        name: 'Алюминиевый межстворочный профиль',
        img: 'https://random.imagecdn.app/300/148',
        vendor_code: 'L8',
        price: 90,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        type: 'aluminium',
        name: 'Алюминиевый стекольно-торцевой профиль',
        img: 'https://random.imagecdn.app/300/148',
        vendor_code: 'L9',
        price: 90,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        type: 'polycarbonate',
        name: 'Поликарбонатный межстворочный профиль',
        img: 'https://random.imagecdn.app/301/148',
        vendor_code: 'L10',
        price: 90,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        type: 'polycarbonate',
        name: 'Поликарбонатный стекольно-торцевой профиль',
        img: 'https://random.imagecdn.app/301/148',
        vendor_code: 'L11',
        price: 90,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
];
export let profiles = {
    L1: {
        price: 800,
        name: 'Профиль опорный - нижний на 3 стекла',
        unit: 'м.п.',
        amount: 0,
        total: 0,
        img: 'https://random.imagecdn.app/300/150'
    },
    L2: {
        price: 900,
        name: 'Профиль опорный - верхний на 3 стекла',
        unit: 'м.п.',
        amount: 0,
        total: 0,
        img: 'https://random.imagecdn.app/300/150'
    },
    L3: {
        price: 700,
        name: 'Профиль опорный - нижний на 2 стекла',
        unit: 'м.п.',
        amount: 0,
        total: 0,
        img: 'https://random.imagecdn.app/300/150'
    },
    L4: {
        price: 800,
        name: 'Профиль опорный - верхний на 2 стекла',
        unit: 'м.п.',
        amount: 0,
        total: 0,
        img: 'https://random.imagecdn.app/300/150'
    },
    L5: {
        price: 700,
        name: 'Профиль створочный',
        unit: 'м.п.',
        amount: 3,
        total: 0,
        img: 'https://random.imagecdn.app/300/150'
    },
};
export let autoProfiles = [
    {
        vendor_code: 'L6',
        name: 'Профиль пристенный',
        img: 'https://random.imagecdn.app/299/149',
        price: 300,
        unit: 'м.п.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L12',
        name: 'Фетр щеточный 7*6',
        img: 'https://random.imagecdn.app/299/149',
        price: 25,
        unit: 'м.п.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L13',
        name: 'Фетр щеточный 4*8',
        img: 'https://random.imagecdn.app/299/149',
        price: 35,
        unit: 'м.п.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L14',
        name: 'Фетр щеточный 7*10',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'м.п.',
        amount: 0,
        total: 0
    },
];
export let totals = {
    totalPrice: 0,
};