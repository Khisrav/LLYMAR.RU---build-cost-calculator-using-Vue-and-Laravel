<script>
import HeaderLayout from '../layouts/HeaderLayout.vue'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'

export default {
    components: {
        HeaderLayout
    },
    data() {
        return {
            
        }
    },
    mounted() {
        initFlowbite()
    }
}
</script>

<template>
<HeaderLayout/>

</template>
