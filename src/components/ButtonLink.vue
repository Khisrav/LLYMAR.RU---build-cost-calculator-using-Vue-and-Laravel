<script>
export default {
    props: ['to']
}
</script>

<template>
<router-link :to="to" class="text-black bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5">
<slot/>
</router-link>
</template>