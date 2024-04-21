<script>

</script>

<template>
    <router-view v-slot="{ Component }">
            <component :is="Component" :key="$route.path" />
    </router-view>
</template>

<style scoped>
body {
}
</style>
