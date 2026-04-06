<template>
    <div class="page">
        <Icon class="icon-maintenance" icon="wpf:maintenance" />
        Maintenance in progress
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
</script>

<style>
.page {
    width: 100%;
    height: 100dvh;
    background-color: var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: var(--white);
    gap: 10dvh;
    font-size: var(--font-lg);
    user-select: none;
}
.icon-maintenance {
    width: 10dvh;
    height: 10dvh;
}
</style>