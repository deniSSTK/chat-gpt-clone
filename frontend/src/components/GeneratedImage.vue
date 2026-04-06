<template>
    <img
        :src="image"
        alt=""
        class="image"
        @load="emit('loaded')"
        @click="isShowing = true"
    >
    <FullScreenImage v-model="isShowing"
                     :image="image"
                     :is-showing="isShowing"
                     :add-to-public="addToPublic"
                     :remove-from-public="removeFromPublic"

    />
</template>

<script setup lang="ts">
import {ref} from "vue";
import FullScreenImage from "./FullScreenImage.vue";

defineProps<{
    image: string;
    isShowingFirstValue?: boolean;
    addToPublic?: boolean;
    removeFromPublic?: boolean;
}>();

const emit = defineEmits<{
    (e: 'loaded'): void;
}>();

const isShowing = ref<boolean>(false);
</script>