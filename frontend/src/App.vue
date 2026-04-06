<template>
    <ErrorDisplay />
    <LoadingOverlay />
    <router-view />
</template>

<script setup lang="ts">
import ErrorDisplay from "./components/ErrorDisplay.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
</script>