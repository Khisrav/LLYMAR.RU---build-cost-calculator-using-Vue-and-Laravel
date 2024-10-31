<script>
import { defineComponent, onMounted } from "vue";
import { useCalcStore } from "../stores/calcStore.js";

import ButtonTag from "../components/ButtonTag.vue";
import InputTag from "../components/InputTag.vue";
import HeaderLayout from "../layouts/HeaderLayout.vue";
import OpeningsTable from "../components/OpeningsTable.vue";
import AdditionalsTable from "../components/AdditionalsTable.vue";
import MaterialsTable from "../components/MaterialsTable.vue";
import ProfilesTable from "../components/ProfilesTable.vue";
import AutoProfilesTable from "../components/AutoProfilesTable.vue";
import SubmitBox from "../components/SubmitBox.vue";
import PricingBlock from "../components/PricingBlock.vue";
import OfferInfo from "../components/OfferInfo.vue";

export default defineComponent({
	components: {
		ButtonTag,
		InputTag,
		HeaderLayout,
		OpeningsTable,
		AdditionalsTable,
		MaterialsTable,
		ProfilesTable,
		AutoProfilesTable,
		SubmitBox,
		PricingBlock,
		OfferInfo,
	},
	setup() {
		const calcStore = useCalcStore();

		onMounted(async () => {
			await calcStore.fetchVendors();
		});

		return { calcStore };
	},
});
</script>

<template>
	<HeaderLayout class="print:hidden" />
	<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-0 print:pt-2">
		<h1 class="mb-4 text-2xl uppercase font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl lg:mb-8 print:hidden">Калькулятор</h1>

		<main>
			<OfferInfo />

			<OpeningsTable />

			<MaterialsTable />

			<ProfilesTable />

			<AutoProfilesTable />

			<PricingBlock />

			<AdditionalsTable />

			<SubmitBox />
		</main>
	</div>
</template>
