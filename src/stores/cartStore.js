import { useCalcStore } from "./calcStore";
import { defineStore } from "pinia";

const calcStore = useCalcStore();

// Ensure vendors are fetched before using them
if (!calcStore.vendors) {
    await calcStore.fetchVendors();
}

export const useCartStore = defineStore('cartStore', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
    }),
    actions: {
        async init() {
            // Ensure vendors are fetched before initializing cart
            if (!calcStore.vendors) {
                await calcStore.fetchVendors();
            }

            const additionals = calcStore.totals.additionals;
            const vendors = [];

            for (const key in calcStore.totals.vendorCodes) {
                if (calcStore.totals.vendorCodes.hasOwnProperty(key)) {
                    vendors.push(calcStore.totals.vendorCodes[key]);
                }
            }

            this.items = [...vendors, ...additionals];
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        getItemInfo(vendor_code) {
            const vendor = calcStore.vendors.find(item => item.vendor_code == vendor_code);
            const additional = calcStore.additionals.find(item => item.vendor_code == vendor_code);
            return vendor || additional;
        },
        removeItem(vendor_code) {
            this.items = this.items.filter(item => item.id != vendor_code);
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        addItem(vendor_code) {
            const item = this.getItemInfo(vendor_code);
            console.log('Adding item:', item);
            if (item) {
                this.items.push({
                    id: item.vendor_code,
                    price: item.price,
                    amount: 1,
                    discount: item.discount
                });
                localStorage.setItem('cartItems', JSON.stringify(this.items));
            }
        },
        createOrder() {
            calcStore.sendTotals();
        }
    },
    getters: {
        totalPriceWithDiscount: (state) => {
            console.log(state.items);
            return state.items.reduce((acc, item) => acc + parseInt(item.price * item.discount * item.amount), 0);
        },
        totalPriceWithNoDiscount: (state) => {
            console.log(state.items);
            return state.items.reduce((acc, item) => acc + parseInt(item.price * item.amount), 0);
        },
    }
});
