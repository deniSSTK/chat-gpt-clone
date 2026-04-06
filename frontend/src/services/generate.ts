import type {iMessage} from "../views/ChatPage.vue";
import type {Ref} from "vue";

import useErrorStore from "../use/useErrorStore.ts";
import { saveMessage } from "./chats.ts";

const { addError } = useErrorStore();

interface iGenerateFunction {
    messages: Ref<iMessage[]>,
    userInput: string,
    chatId: string;
}
interface iGenerateFunctionImage extends iGenerateFunction {
    isGenerating: Ref<boolean>,
}

const generateService = () => {
    async function generateImage({
                                     userInput,
                                     messages,
                                     isGenerating,
                                     chatId
    }: iGenerateFunctionImage) {
        if (userInput === "" || isGenerating.value) return;
        try {
            isGenerating.value = true;
            const prompt = userInput;
            messages.value = [
                ...messages.value,
                {role: "user", content: prompt},
                {role: "assistant", content: '', loadingImage: true},
            ];

            setTimeout(async () => {
                const response = await fetch("https://model-fast-api-w4du.onrender.com/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'accept': 'application/json',
                    },
                    body: JSON.stringify({ prompt })
                })

                const data = await response.json();

                const img = new Image();
                img.src = data.url;

                img.onload = () => {
                    messages.value[messages.value.length - 1] =  {role: "assistant", content: "", imageUrl: data.url};
                };

                await saveMessage(
                    [
                        {content: userInput, role: "user" },
                        {content: '', role: "assistant", imageUrl: data.url },
                    ],
                    chatId,
                    messages,
                    isGenerating
                )
            }, 200)
        } catch (error: any) {
            isGenerating.value = false;
            addError(error.message)
        }
    }

    async function generateText({
                              userInput,
                              messages,
                              chatId
    }: iGenerateFunction) {
        if (userInput === "") return;
        try {
            messages.value = [
                ...messages.value,
                {role: "user", content: userInput, generatingText: true}
            ];

            const response = await fetch('https://model-fast-api-w4du.onrender.com/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'accept': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages.value
                })
            })

            const data = await response.json();
            messages.value.push({role: "assistant", content: data})
            await saveMessage(
                [
                    {content: userInput, role: "user" },
                    {content: data, role: "assistant" },
                ],
                chatId,
                messages,
            )
        } catch (error: any) {
            addError(error.message)
            const userMessage = messages.value[messages.value.length - 2];
            if (userMessage.generatingText) {
                messages.value[messages.value.length - 2] = {...userMessage, generatingText: false};
            }
            addError(error.message)
        }
    }

    return {
        generateImage,
        generateText,
    }
}

export default generateService;