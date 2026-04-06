<template>
    <div class="pre-container">
        <div class="pre-title">
            {{ language || "plaintext" }}
            <Icon
                icon="iconamoon:copy-light"
                width="24"
                height="24"
                class="icon-copy"
                @click="copyToClipboard"
            />
        </div>
        <iframe ref="iframeRef" class="hljs-frame" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import hljs from 'highlight.js';
import { Icon } from '@iconify/vue';

interface Props {
    code: string;
    language: string | undefined;
    highlightedCodePref?: 'dark' | 'light' | 'a11y';
}

const props = defineProps<Props>();
const iframeRef = ref<HTMLIFrameElement | null>(null);

const getThemeHref = (theme: string) => {
    const themes: Record<string, string> = {
        dark: 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-dark.css',
        light: 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css',
        dracula: 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/a11y-dark.min.css',
    };
    return themes[theme] || themes['dracula'];
};

const highlightCode = () => {
    const lang = props.language && hljs.getLanguage(props.language)
        ? props.language
        : 'plaintext';

    const highlighted = hljs.highlight(props.code, { language: lang }).value;

    const iframe = iframeRef.value;
    if (!iframe) return;

    const doc = iframe.contentDocument!;
    doc.open();
        doc.write(`
  <html>
    <head>
      <link rel="stylesheet" href="${getThemeHref('dark')}">
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        pre.hljs {
          margin: 0;
          padding: 15px;
          border-radius: 0 0 10px 10px;
          font-family: monospace;
          font-size: 14px;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <pre class="hljs">${highlighted}</pre>
    </body>
  </html>
`);

    doc.close();

    setTimeout(() => {
        if (iframe.contentDocument && iframe.contentDocument.body) {
            const height = iframe.contentDocument.body.scrollHeight;
            iframe.style.height = height + 'px';
        }
    }, 0);
};

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(props.code);
};

onMounted(highlightCode);
watch(() => props.code, highlightCode);
watch(() => props.highlightedCodePref, highlightCode);
</script>

<style scoped>
.pre-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: fit-content;
}
.pre-title {
    width: 100%;
    padding: 15px;
    background-color: var(--grey);
    color: var(--white);
    border-radius: var(--border-md) var(--border-md) 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.icon-copy {
    cursor: pointer;
    transition: color 0.2s;
}
.icon-copy:active {
    color: var(--green);
}
.hljs-frame {
    border: none;
    width: 100%;
    height: 130px;
    border-radius: 0 0 var(--border-md) var(--border-md);
}
</style>
