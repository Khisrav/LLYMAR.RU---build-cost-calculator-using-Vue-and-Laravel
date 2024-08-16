<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="$route.path" />
  </router-view>
</template>
<style>
@media print {
  @page {
    margin: 0;
  }
  body {
    margin: 0;
  }
}
</style>
