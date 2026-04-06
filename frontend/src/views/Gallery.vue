<template>
    <a href="/c" class="gallery-back-button">
        <Icon icon="material-symbols:close" width="30" height="30" />
    </a>
    <div class="page-container">
        <div class="title">Gallery</div>
        <div class="gallery-container">
            <div class="image generation-loader"
                 v-if="loading"
                 v-for="n in 10"
                 :key="n"
            />
            <GeneratedImage
                :add-to-public="true"
                v-for="(image, index) in images"
                :image="image.imageUrl"
                :key="index"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import "../css/generating-loading.css";
import "../css/page-gallery.scss"
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { getAllImages } from "../services/chats.ts";
import gsap from "gsap";
import GeneratedImage from "../components/GeneratedImage.vue";

interface iImage {
    imageUrl: string;
    prompt: string;
}

const loading = ref<boolean>(true);
const images = ref<iImage[]>([]);

onMounted(async () => {
    const data = await getAllImages();
    if (data) {
        gsap.to(".generation-loader", {
            opacity: 0,
            duration: .3,
            onComplete: () => {
                images.value = data;
                loading.value = false;
            }
        })
    }
})
</script>