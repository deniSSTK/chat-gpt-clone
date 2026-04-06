<template>
    <div class="share-container"
        v-if="isShowing"
    >
        <button class="close-button"
            @click="hideContainer">
            <Icon icon="material-symbols:close" width="24" height="24" />
        </button>
        <div class="information-container">
            <div>{{baseUrl}}/share/{{shareLink.id}}</div>
            <button class="copy-button"
                    @click="copyToClipboard">Copy</button>
            <a class="copy-button open"
               :href="`${baseUrl}/share/${shareLink.id}`"
                target="_blank"
            >Open</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import {shareChat} from "../services/chats.ts";
import useErrorStore from "../use/useErrorStore.ts";
import useLoading from "../use/useLoading.ts";
import {Icon} from "@iconify/vue";
import {onMounted, ref} from "vue";
import type {iMessage} from "../views/ChatPage.vue";

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
    isShowing: boolean;
    messages: iMessage[];
}>()

const { addError } = useErrorStore();
const { setLoading } = useLoading();

const shareLink = ref<{ id: string }>({id: ''});
const baseUrl = window.location.origin;

const hideContainer = () => {
    gsap.to(".share-container", {
        opacity: 0,
        duration: .3,
        onComplete: () => {
            emit("update:modelValue", false);
        }
    })
}

onMounted(async () => {
    setLoading(true)
    try {
        shareLink.value = await shareChat(props.messages)
    } catch (error: any) {
        addError(error.message)
    }
    setLoading(false)
})

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/share/${shareLink.value.id}`);
};

</script>

<style>
.share-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background-color: rgba(var(--black-n), 0.8);
    backdrop-filter: blur(15px);
    z-index: 9999;
    animation: show-opacity .3s;
}

.close-button {
    color: var(--white);
    background: none;
    border: none;
    outline: none;
    top: 15px;
    left: 15px;
    position: fixed;
}

.information-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--white);
    width: fit-content;
    height: 100px;
    border-radius: var(--border-md);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 15px 20px;
}

.copy-button {
    color: var(--white);
    background-color: var(--black);
    border-radius: var(--border-md);
    padding: 10px 15px;
    text-decoration: none;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;

    transition: background-color .3s;
}

.copy-button:active {
    background-color: var(--green);
    border: none;
    outline: none;
}

@keyframes show-opacity {
    from {
        opacity: 0;
    }
}
</style>