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
    left: '/assets/openings-left.jpg',
    right: '/assets/openings-right.jpg',
    center: '/assets/openings-center.jpg',
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

export let materials = async () => {
    try {
        const response = await api.get("/vendors", { headers: { 'Authorization': `Bearer ${ sessionStorage.getItem('token') }` } });
        return response.data;
    } catch (error) { return error; }
};

export let profiles = {
    L1: {
        price: 800,
        name: 'Профиль опорный - нижний на 3 стекла',
        unit: 'м.п.',
        amount: 0,
        total: 0,
        img: 'http://127.0.0.1:8000/storage/01HXEGR50V6ANM434PZH9JT7HB.png'
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
        img: '/assets/L5.jpg',
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
    {
        vendor_code: 'L15',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L16',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L17',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L18',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L19',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L20',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L21',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L22',
        name: '',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
    {
        vendor_code: 'L26',
        name: 'Ролик',
        img: 'https://random.imagecdn.app/299/149',
        price: 39,
        unit: 'шт.',
        amount: 0,
        total: 0
    },
];
export let totals = {
    totalPrice: 0,
};