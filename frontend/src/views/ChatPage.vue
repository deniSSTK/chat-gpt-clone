<template class="app">
    <Settings />
    <ShareChatController
        v-if="isShareButtonOpened"
        :key="shareKey"
        :is-showing="true"
        @update:modelValue="isShareButtonOpened = false"
        :messages="messages"
    />
    <div class="content">
        <ChatsPanel />
        <div class="chat">
            <div class="container container-messages" ref="messagesContainerRef">
                <Messages
                    :visibleMessages="visibleMessages"/>
            </div>
            <div class="container container-input"
                 v-if="!isSharedChat"
            >
                <input
                    v-model="inputValue"
                    placeholder="Ask anything"
                    @keydown.enter="generateChoose()"
                    class="input-text"
                />
                <div class=footer-input-buttons-container>
                    <div class="container-mode-inputs">
                        <div class="container-mode-input">
                            <input type="radio" class="input-checkbox" id="create-image" value="image" @click="toggleModeChoose('image')" v-model="selectedMode" />
                            <label for="create-image" class="input-checkbox-label">
                                <Icon icon="mynaui:image" width="25" height="25"/>
                                <span>Create Image</span>
                            </label>
                        </div>
<!--                        <div class="container-mode-input">-->
<!--                            <input type="radio" class="input-checkbox" id="reason" value="reason" @click="toggleModeChoose('reason')" v-model="selectedMode" />-->
<!--                            <label for="reason" class="input-checkbox-label">-->
<!--                                <Icon icon="mdi:think-outline" width="25" height="25"/>-->
<!--                                <span>Reason</span>-->
<!--                            </label>-->
<!--                        </div>-->
                    </div>
                    <div class="manipulate-buttons-container">
                        <button @click="openShare">
                            <Icon icon="humbleicons:share" width="60" height="60" />
                        </button>
                        <button @click="exportChat">
                            <Icon icon="ic:baseline-download" width="60" height="60" />
                        </button>
                         <button :disabled="
                                isGeneratingImage
                                || loading
                                || messages.length >= 2 && messages[messages.length - 1].generatingText"
                                @click="generateChoose()">
                            <Icon icon="line-md:arrow-up" width="60" height="60"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, ref, watch, onMounted } from "vue";

import generateService from "../services/generate.ts";
import {chatCheck, getAllMessages, getAllMessagesFromSharedChat} from "../services/chats.ts";
import {getPersonalizationStyle} from "../services/personalization.ts";

import '../css/page-chat.css';
import "../css/generated-image.css";
import Messages from "../components/Messages.vue";
import Settings from "../components/Settings.vue";
import ChatsPanel from "../components/ChatsPanel.vue";
import {personalityStylesConfig} from "../config/botSettingsConfig.ts";
import exportChatAsPDF from "../services/saveChatToPdf.ts"
import ShareChatController from "../components/ShareChatController.vue";

export interface iMessage {
    content: string;
    role: "system" | "user" | "assistant";
    imageUrl?: string;
    loadingImage?: boolean;
    generatingText?: boolean;
}

const chatId = useRoute().params.id as string;
const router = useRouter();
const route = useRoute();

const isSharedChat = computed(() => route.path.startsWith("/share/"));

const { generateImage, generateText } = generateService();

const inputValue = ref<string>("");
const isGeneratingImage = ref<boolean>(false);
const loading = ref<boolean>(false);
const selectedMode = ref<'image' | 'reason' | null>(null);
const isShareButtonOpened = ref<boolean>(false)
const shareKey = ref<number>(0)

const messagesContainerRef = ref<HTMLDivElement | null>(null);

const messages = ref<iMessage[]>([
    {
        role: 'system',
        content: `If the user explicitly mentions that they want to create an image, direct them to click the button below. Do not respond about images or pictures in text format, including links or URLs. You do not need to send any image-related text responses since image generation is handled separately.`,
    }
]);

const visibleMessages = computed(() =>
    messages.value.filter(msg => msg.role !== 'system')
);

watch(messages, async () => {
    await nextTick();
    if (messagesContainerRef.value) {
        messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
    }
});

const generateChoose = async () => {
    if(isGeneratingImage.value || messages.value[messages.value.length - 1].generatingText) return;
    const userInputValue = inputValue.value;
    inputValue.value = "";
    switch (selectedMode.value) {
        case 'image':
            selectedMode.value = null;
            await generateImage({
                chatId,
                userInput: userInputValue,
                messages,
                isGenerating: isGeneratingImage,
            });
            break;
        default:
            await generateText({
                chatId,
                userInput: userInputValue,
                messages,
            })
            break;
    }
}

const toggleModeChoose = (mode: 'reason' | 'image' | null) => {
    if (mode === selectedMode.value) {
        selectedMode.value = null;
    }
    else {
        selectedMode.value = mode;
    }
}

onMounted(async () => {
    const personalizationStyle = await getPersonalizationStyle();
    if (personalizationStyle) {
        messages.value.unshift({role: 'system', content: personalityStylesConfig[personalizationStyle]})
    }

    let data;

    if (isSharedChat.value) {
        data = await getAllMessagesFromSharedChat(chatId);
    } else {
        const chatCheckData = await chatCheck(
            chatId
        )
        if (!chatCheckData && messages.value.length !== 2) await router.push('/c')

        data = await getAllMessages(chatId, loading);
    }
    if (data.length !== 0 && !data.error) messages.value = [...messages.value, ...data];
})

const openShare = () => {
    isShareButtonOpened.value = false;
    nextTick(() => {
        shareKey.value = Date.now();
        isShareButtonOpened.value = true;
    });
}

const exportChat = () => {
    exportChatAsPDF(messages.value)
}
</script>