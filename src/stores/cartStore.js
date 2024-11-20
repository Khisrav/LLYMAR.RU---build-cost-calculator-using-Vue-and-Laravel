// vendor_code inside removeItem, addItem and getItemInfo functions are just id's 

import { defineStore } from "pinia";
import { useCalcStore } from "./calcStore";
import { computed } from "vue";

export const useCartStore = defineStore("cartStore", () => {
    const calcStore = useCalcStore();

    // Reactive items derived from calcStore totals
    const items = computed(() => {
        const vendorItems = Object.values(calcStore.totals.vendorCodes || {});
        const additionalItems = calcStore.totals.additionals || [];
        return [...vendorItems, ...additionalItems];
    });

    const getItemInfo = (vendor_code) => {
        const vendor = calcStore.vendors?.find((item) => item.vendor_code == vendor_code);
        const additional = calcStore.additionals?.find((item) => item.vendor_code == vendor_code);
        return vendor || additional;
    };

    const removeItem = (vendor_code) => {
        // Check in additionals
        const index = calcStore.totals.additionals.findIndex(item => item.id === vendor_code);
        if (index !== -1) {
            // Replace the array to trigger reactivity
            calcStore.totals.additionals = [
                ...calcStore.totals.additionals.slice(0, index),
                ...calcStore.totals.additionals.slice(index + 1),
            ];
            console.log(`Item with id ${vendor_code} removed successfully from additionals.`);
        } 
        // Check in vendorCodes
        else if (calcStore.totals.vendorCodes.hasOwnProperty(vendor_code)) {
            // Replace the object to trigger reactivity
            calcStore.totals.vendorCodes = { 
                ...calcStore.totals.vendorCodes,
            };
            delete calcStore.totals.vendorCodes[vendor_code];
            console.log(`Item with id ${vendor_code} removed successfully from vendorCodes.`);
        } else {
            console.log(`Item with id ${vendor_code} not found.`);
        }
        // Recalculate totals and prices
        calcStore.calculatePrice();
        calcStore.collectTotals();
    };
    

    const addItem = (vendor_code) => {
        //...
    };

    const createOrder = () => {
        calcStore.sendTotals();
    };

    const totalPriceWithDiscount = computed(() => {
        return items.value.reduce(
            (acc, item) => acc + item.price * item.discount * (item.amount || 1),
            0
        );
    });

    const totalPriceWithNoDiscount = computed(() => {
        return items.value.reduce((acc, item) => acc + item.price * (item.amount || 1), 0);
    });

    return {
        items,
        getItemInfo,
        removeItem,
        addItem,
        createOrder,
        totalPriceWithDiscount,
        totalPriceWithNoDiscount,
    };
});
