import useErrorStore from "../use/useErrorStore.ts";

const { addError } = useErrorStore()

const getPersonalizationStyle = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/personalization/get-personalization-style`, {
            method: "GET",
            credentials: "include",
        })

        if (response.ok) {
            return await response.text();
        }

        return "default";
    } catch (error: any) {
        addError(error.message);
        return "default";
    }
}

const updatePersonalizationStyle = async (style: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/personalization/update-personalization-style`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({ style }),
        })

        if (response.ok) {
            return await response.text();
        }

        return false;
    } catch (error: any) {
        addError(error.message)
    }
}

const updateUserIcon = async (
    imageUrl: string,
) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/personalization/update-user-icon`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
        })

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        return true;
    } catch(error: any) {
        addError(error.message);
    }
}

const addImageToPublicGallery = async (imageUrl: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/personalization/add-image-to-public-gallery`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
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

const removeImageFromPublicGallery = async (imageUrl: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/personalization/remove-image-from-public-gallery`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
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

export {
    updateUserIcon,
    getPersonalizationStyle,
    addImageToPublicGallery,
    updatePersonalizationStyle,
    removeImageFromPublicGallery
}