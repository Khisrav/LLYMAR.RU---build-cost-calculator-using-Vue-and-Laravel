<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="$route.path" />
  </router-view>
</template>
<style>
@media print {
  @page {
    margin: 0 !important;
  }
  body {
    margin: 0 !important;
  }
}
</style>
