<template>
    <div class="image-container" v-if="isShowing">
        <div class="button-container left-button-container">
            <button v-if="addToPublic || removeFromPublic" @click="updateUserIconContainer()">
                <Icon icon="clarity:avatar-outline-alerted" width="24" height="24" />
            </button>
            <button v-if="addToPublic" @click="addImageToPublicGalleryContainer()">
                <Icon icon="solar:gallery-add-outline" width="24" height="24" />
            </button>
            <button v-if="removeFromPublic" @click="removeImageFromPublicGalleryContainer()">
                <Icon icon="mdi:eye-remove-outline" width="24" height="24" />
            </button>
        </div>
        <div class="button-container right-button-container">
            <button @click="downloadImageBlob(image, `generated-image`)">
                <Icon icon="material-symbols:download" width="24" height="24" class="icon-download"/>
            </button>
            <button @click="hideImage">
                <Icon icon="material-symbols:close" width="24" height="24" />
            </button>
        </div>
        <img
            :src="image"
            alt=""
            class="big-image"
        >
    </div>
</template>

<script setup lang="ts">
import {Icon} from "@iconify/vue";
import gsap from "gsap";
import {addImageToPublicGallery, removeImageFromPublicGallery, updateUserIcon} from "../services/personalization.ts";
import useErrorStore from "../use/useErrorStore.ts";
import useLoading from "../use/useLoading.ts";

const props = defineProps<{
    image: string,
    isShowing: boolean,
    addToPublic?: boolean;
    removeFromPublic?: boolean;
}>()

const emit = defineEmits(['update:modelValue']);

const { addError } = useErrorStore();
const { setLoading } = useLoading();

const hideImage = () => {
    gsap.to(".image-container", {
        opacity: 0,
        duration: .3,
        onComplete: () => {
            emit("update:modelValue", false);
        }
    })
}

const downloadImageBlob = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
};

const updateUserIconContainer = async () => {
    setLoading(true)
    const data = await updateUserIcon(props.image);

    if (data) addError('Icon changed', "success")
    else addError("Unexpected error")

    setLoading(false)
}

const addImageToPublicGalleryContainer = async () => {
    setLoading(true);
    const data = await addImageToPublicGallery(props.image);
    if (data) addError('Successfuly', "success");
    else addError("Unexpected error");
    setLoading(false);
}

const removeImageFromPublicGalleryContainer = async () => {
    setLoading(true);
    const data = await removeImageFromPublicGallery(props.image);
    if (data) addError('Successfuly', "success");
    else addError("Unexpected error");
    setLoading(false);
}
</script>

<style>
.image-container {
    z-index: 9999;
    width: 100%;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.8);
    animation: show-full-screen-image .3s;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image-container img {
    width: 600px;
    aspect-ratio: 1;
    transition: width .3s, height .3s;
}
.button-container {
    position: fixed;
    display: flex;
    gap: 15px;
    top: 15px;
}
.left-button-container {
    left: 15px;
}
.right-button-container {
    right: 15px;
}
.button-container button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    background: inherit;
    outline: none;
    border: none;
    border-radius: var(--border-sm);
}
.button-container button svg {
    color: var(--white);
}
@keyframes show-full-screen-image {
    from {
        opacity: 0;
        backdrop-filter: blur(0);
        background: rgba(0, 0, 0, 0);
    }
}
@media (max-width: 900px) {
    .image-container img {
        width: 60vw;
    }
}
</style>