<template>
    <div
        v-for="(message, id) in visibleMessages"
        :key="id" class="message-container"
        :class="[message.role]">
        <div class="container-loader-image" v-if="message.loadingImage">
            <div class="loader-image"/>
        </div>
        <generated-image
            v-if="message.imageUrl"
            :add-to-public="true"
            :image="message.imageUrl"/>
        <div class="container-message-content" :class="{user: message.role === 'user', assistant: message.role === 'assistant'}">
            <template v-for="(part, index) in splitContent(message.content)" :key="index">
                <template v-if="message.content === ''">
                    <span class="text-error">Unexpected error</span>
                </template>
                <template v-else-if="part.type === 'code'">
                    <CodeBlock :code="part.content" :language="part.language" />
                </template>
                <template v-else>
                    <div v-html="formatMessage(part.content)" />
                </template>
            </template>
        </div>
        <div class="generating-loading"
             v-if="message.generatingText"
        ></div>
        <span v-if="message.role === 'assistant'" class="line" />
    </div>
</template>

<script setup lang="ts">
import GeneratedImage from "./GeneratedImage.vue";
import type { iMessage } from "../views/ChatPage.vue"
import { marked } from "marked";
import CodeBlock from "./CodeBlock.vue";
import "../css/messages.css"

defineProps<{
    visibleMessages: iMessage[],
}>();

const formatMessage = (content: string) => {
    let thinkingPart = "";
    let responsePart = content;

    if (/<\/?think>/.test(content)) {
        const parts = content.split(/<\/?think>/);
        [thinkingPart, responsePart] = parts.length === 2
            ? [parts[0].trim(), parts[1]?.trim() || '']
            : parts.length === 3
                ? [parts[1].trim(), parts[2]?.trim() || '']
                : [thinkingPart, responsePart];
    }

    responsePart = responsePart.replace(/https?:\/\/\S+/g, '');

    return `
        ${thinkingPart ? `<div class="think">${marked(thinkingPart)}</div>` : ''}
        ${responsePart ? `<div class="response">${marked(responsePart)}</div>` : ''}
    `;
};

const splitContent = (content: string) => {
    const parts = [];
    const regex = /(```\w*[\s\S]+?```)/g;
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: content.slice(lastIndex, match.index)
            });
        }

        const codeBlock = match[0];
        const languageMatch = codeBlock.match(/^```(\w*)\n/);
        const language = languageMatch ? languageMatch[1] : 'plaintext';
        const codeContent = codeBlock.replace(/^```\w*\n/, '').replace(/```$/, '');

        parts.push({
            type: 'code',
            language: language,
            content: codeContent
        });

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push({
            type: 'text',
            content: content.slice(lastIndex)
        });
    }

    return parts;
}
</script>