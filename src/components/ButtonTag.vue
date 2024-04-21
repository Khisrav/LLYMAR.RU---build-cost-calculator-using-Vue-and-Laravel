<script>
export default {
    props: ['type']
}
</script>

<template>
<button :type="type" class="text-black bg-yellow-300 hover:bg-yellow-300 font-semibold focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-yellow dark:hover:bg-yellow-300">
<slot/>
</button>
</template>