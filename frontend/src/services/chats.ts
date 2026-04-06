import useErrorStore from "../use/useErrorStore.ts";
import type {iMessage} from "../views/ChatPage.vue";
import type { Ref } from 'vue';

const { addError } = useErrorStore()

async function saveMessage(
    messages: iMessage[],
    chatId: string,
    messagesRef?: Ref<iMessage[]>,
    isGenerating?: Ref<boolean>,
) {
    try {
        if (messagesRef) {
            const userMessage = messagesRef.value[messagesRef.value.length - 2];
            if (userMessage.generatingText) {
                messagesRef.value[messagesRef.value.length - 2] = {...userMessage, generatingText: false};
                messagesRef.value[messagesRef.value.length - 1] = {...messagesRef.value[messagesRef.value.length - 1], generatingText: true};
            }
        }

        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/save-message`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                messages,
                chatId,
            })
        })

        const data = await response.json();

        const last = messages[messages.length - 1];
        const prev = messages[messages.length - 2];

        if (last?.imageUrl && prev?.content) {
            await saveImageToGallery(last.imageUrl, prev.content);
        }

        if (data) {
            if (isGenerating) {
                isGenerating.value = false;
            } else if (messagesRef) {
                const userMessage = messagesRef.value[messagesRef.value.length - 1];
                if (userMessage.generatingText) {
                    messagesRef.value[messagesRef.value.length - 1] = {...userMessage, generatingText: false};
                }
            }
        }
    } catch (error: any) {
        addError(error.message);
    }
}

async function chatCheck(
    chatId: string,
) {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/chat-check`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                chatId,
            })
        })

        return await response.json();
    } catch(error: any) {
        addError(error.message);
        return false;
    }
}

async function getChats() {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/get-chats`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            }
        })
        return await response.json();
    } catch (error: any) {
        addError(error.message);
    }
}

async function getAllMessages(
    chatId: string,
    loading: Ref<boolean>,
) {
    loading.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/get-messages`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                chatId,
            })
        })

        return await response.json();
    } catch (error: any) {
        addError(error.message);
    } finally {
        loading.value = false;
    }
}

const deleteUserChats = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/delete-user-chats`, {
            method: 'DELETE',
            credentials: 'include',
        })

        return await response.json();
    } catch (error: any) {
        addError(error.message);
    }
}

const saveImageToGallery = async (imageUrl: string, prompt: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/save-image-to-gallery`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                imageUrl,
                prompt
            })
        })

        return await response.json();
    } catch (error: any) {
        addError(error.message);
    }
}

const getAllImages = async () => {
    const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/get-all-images`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'accept': 'application/json',
        }
    })
    return await response.json();
};

const shareChat = async (messages: iMessage[]) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/add-share-chat`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                messages
            })
        })

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        return await response.json();
    } catch(error: any) {
        addError(error.message);
    }
}

const getAllMessagesFromSharedChat = async (chatId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/chats/get-all-share-chat-messages/${chatId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            }
        })

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        return await response.json();
    } catch (error: any) {
        addError(error.message);
    }
}

export {
    getAllMessages,
    getChats,
    saveMessage,
    chatCheck,
    deleteUserChats,
    getAllImages,
    shareChat,
    getAllMessagesFromSharedChat
};