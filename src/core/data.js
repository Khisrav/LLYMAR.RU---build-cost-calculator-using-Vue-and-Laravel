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
        unit: 'м.п.',
        amount: 0,
        total: 0,
    },
    L2: {
        price: 900,
        unit: 'м.п.',
        amount: 0,
        total: 0,
    },
    L3: {
        price: 700,
        unit: 'м.п.',
        amount: 0,
        total: 0,
    },
    L4: {
        price: 800,
        unit: 'м.п.',
        amount: 0,
        total: 0,
    },
    L5: {
        price: 700,
        unit: 'м.п.',
        amount: 0,
        total: 0,
    },
};
export let totals = {
    totalPrice: 0,
} 