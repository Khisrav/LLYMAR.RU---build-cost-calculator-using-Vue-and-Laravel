import { useCalcStore } from "./calcStore";
import { defineStore } from "pinia";

const calcStore = useCalcStore();

export const useCartStore = defineStore('cartStore', {
    state: () => ({
        items: [],
    }),
    actions: {
        init() {
            const additionals = calcStore.totals.additionals;
        	const vendors = [];
        
        	for (const key in calcStore.totals.vendorCodes) {
        		if (calcStore.totals.vendorCodes.hasOwnProperty(key)) {
        			vendors.push(calcStore.totals.vendorCodes[key]);
        		}
        	}
        
        	this.items = [...additionals, ...vendors];
        },
        getItemInfo: vendor_code => {
            const allItems = [...calcStore.additionals, ...calcStore.vendors];
            return allItems.find(item => item.vendor_code == vendor_code);
            // return "https://placehold.co/600x400";
        },
    },
    getters: {
    }
});