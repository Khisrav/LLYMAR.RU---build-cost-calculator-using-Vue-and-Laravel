<script setup>
import { useRouter } from "vue-router";
import { useCalcStore } from "../stores/calcStore";
// import { useCartStore } from "../stores/cartStore";
import { generatePDF, imageToBase64 } from "../utils/pdfUtils";
import axios from "axios";
import { calc, discountRate } from "../core/data";
import { ref } from "vue";

const calcStore = useCalcStore();
// const cartStore = useCartStore();
const router = useRouter();

const isLoading = ref(false);

const openCart = () => {
	calcStore.collectTotals();
	// cartStore.init();
	router.push("/user/cart");
};

const getOpeningsData = async () => {
	const temp = [];

	const imageToBase64 = async (imageUrl) => {
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = reject;
			});
		} catch (error) {
			console.error(`Error converting image to base64: ${error}`);
			return null;
		}
	};

	const processOpening = async (opening) => {
		const imageUrl = window.location.origin + calcStore.opening_images[opening.type];
		const imageBase64 = await imageToBase64(imageUrl);

		return {
			image: imageBase64,
			name: opening.name,
			doors: opening.doors,
			width: opening.width,
			height: opening.height,
		};
	};

	const openingPromises = calcStore.openings.map(processOpening);
	const openingsData = await Promise.all(openingPromises);

	return openingsData;
};

const printEnumeration = async () => {
	isLoading.value = true;
	try {
		calcStore.collectTotals();

		const tableData = [];
		const { vendorCodes: vendors, additionals } = calcStore.totals;

		// Helper to get a valid numeric value or default
		const toNumber = (value, defaultValue = 0) => parseFloat(value) || defaultValue;

		// Helper to calculate the discount
		const calculateDiscountedPrice = (price, discount) => parseInt(price * (discount || 1));

		// Helper to format item data for the table
		const formatTableData = (imgBase64, vendorInfo, id, price, amount) => ({
			image: imgBase64,
			vendor_code: `L${id}`,
			name: vendorInfo.name || "Unknown",
			price: calculateDiscountedPrice(price, vendorInfo.discount),
			amount: amount.toString(),
			unit: vendorInfo.unit || "",
			total: parseInt(calculateDiscountedPrice(price, vendorInfo.discount) * amount),
		});

		const processItems = async (items, source) => {
			const itemPromises = items.map(async (item) => {
				const vendorInfo = source.find((info) => info.vendor_code === item.id);
				if (!vendorInfo) return null;

				const imgBase64 = (await imageToBase64(vendorInfo.img)) || "";
				const price = toNumber(item.price);
				const amount = toNumber(item.amount);

				return formatTableData(imgBase64, vendorInfo, item.id, price, amount);
			});

			const processedItems = await Promise.all(itemPromises);
			return processedItems.filter((data) => data !== null);
		};

		// Process vendors and additionals simultaneously
		const [vendorData, additionalData] = await Promise.all([processItems(Object.values(vendors), calcStore.vendors), processItems(additionals, calcStore.additionals)]);

		// Combine results and generate PDF
		tableData.push(...vendorData, ...additionalData);
		const openingsData = await getOpeningsData();
		await generatePDF(openingsData, tableData, calcStore.totalPrice);
		isLoading.value = false;
	} catch (error) {
		isLoading.value = false;
		console.error(`Error generating PDF: ${error}`);
	}
};
</script>

<template>
	<div class="hidden print:block">
		<div class="flex justify-end">
			<div class="text-right">
				<p>Доставка: {{ calcStore.delivery }} ₽</p>
				<h1 class="font-medium text-xl print:block">
					Итого: <span class="font-bold">{{ calcStore.markupPrice() }} ₽</span>
				</h1>
			</div>
		</div>
	</div>

	<div class="print:hidden fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 overflow-hidden bg-white border border-gray-200 rounded-full bottom-4 left-1/2 shadow-2xl">
		<div class="grid h-full max-w-lg grid-cols-4 mx-auto">
			<div class="inline-flex flex-col items-center justify-center px-3 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="line-through block text-sm" v-if="calcStore.totalPrice != calcStore.noDiscountPrice()">{{ calcStore.noDiscountPrice() }} ₽</span>
				<span
					><b>{{ calcStore.totalPrice }} ₽</b></span
				>
			</div>

			<div class="inline-flex flex-col items-center justify-center px-3 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<button @click="calcStore.printOrder()" data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full group">
					<svg class="w-5 h-5 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
					</svg>
					<span class="text-xs font-semibold">КП</span>
				</button>
			</div>

			<div class="inline-flex flex-col items-center justify-center px-3 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<button @click="printEnumeration()" data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full group">
					<svg class="w-5 h-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
						<path fill="currentColor" d="M6 13h9v-2H6zm0-3h9V8H6zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6z" />
					</svg>
					<span class="text-xs font-semibold">{{ isLoading ? "Загрузка..." : "Перечень" }}</span>
				</button>
			</div>
			<div class="inline-flex flex-col justify-center px-3 rounded-full dark:hover:bg-gray-800 group">
				<button
					id="updateProductButton"
					data-modal-target="updateProductModal"
					data-modal-toggle="updateProductModal"
					type="button"
					class="flex-col justify-center rounded-e-fulltext-white bg-yellow-300 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<svg class="w-5 h-5 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" />
					</svg>
					<span class="text-xs font-semibold">Заказ</span>
				</button>
			</div>
		</div>
	</div>

	<!-- <div id="toast-success" v-if="calcStore.showSuccess" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
			</svg>
			<span class="sr-only">Check icon</span>
		</div>
		<div class="ms-3 text-sm font-normal">Расчеты заказа отправлены.</div>
		<button
			@click="calcStore.showSuccess = false"
			type="button"
			class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
			data-dismiss-target="#toast-success"
			aria-label="Close"
		>
			<span class="sr-only">Close</span>
			<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
			</svg>
		</button>
	</div>

	<div id="toast-danger" v-if="calcStore.showError" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
			</svg>
			<span class="sr-only">Error icon</span>
		</div>
		<div class="ms-3 text-sm font-normal">Упс... Что-то пошло не так.</div>
		<button
			@click="calcStore.showError = false"
			type="button"
			class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
			data-dismiss-target="#toast-danger"
			aria-label="Close"
		>
			<span class="sr-only">Close</span>
			<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
			</svg>
		</button>
	</div> -->

	<div id="toast-danger" v-if="calcStore.showAuthError" class="fixed top-4 inset-x-0 mx-auto flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-gray-200 bg-gray-800" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-200 text-red-600">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
			</svg>
			<span class="sr-only">Error icon</span>
		</div>
		<div class="ms-3 text-sm font-normal">Вы не авторизованы.</div>
		<button
			@click="calcStore.showError = false"
			type="button"
			class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8 text-gray-100 hover:text-white bg-gray-800 hover:bg-gray-700"
			data-dismiss-target="#toast-danger"
			aria-label="Close"
		>
			<span class="sr-only">Close</span>
			<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
			</svg>
		</button>
	</div>

	<!-- Main modal -->
	<div id="updateProductModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
		<div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
			<!-- Modal content -->
			<div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
				<!-- Modal header -->
				<div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Комментарий</h3>
					<button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
						<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				<div class="grid gap-4 mb-4 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<textarea
							id="description"
							v-model="calcStore.comment"
							rows="5"
							class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="Ваш комментарий..."
						></textarea>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<button
						@click="openCart(), disableButton"
						type="button"
						data-modal-toggle="updateProductModal"
						id="sendButton"
						class="text-black bg-yellow-300 hover:bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-yellow dark:hover:bg-yellow-300"
					>
						Готово
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
