<template>
    <div v-if="loading" class="loading-overlay"></div>
    <Icon v-if="loading" class="loading-overlay-icon" icon="eos-icons:loading" width="24" height="24" />
</template>

<script setup lang="ts">
import useLoading from "../use/useLoading.ts";
import { Icon } from "@iconify/vue"

const { loading } = useLoading();
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    background-color: rgba(var(--black-n), .5);
    pointer-events: all;
    animation: show-loading-overlay .3s;
}

.loading-overlay-icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    color: var(--white);
    height: 10vh;
    width: 10vh;
    animation: show-loading-overlay .3s;
}

@keyframes show-loading-overlay {
    from {
        opacity: 0;
    }
}
</style>
