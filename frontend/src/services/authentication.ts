import type {Ref} from "vue";
import useErrorStore from "../use/useErrorStore.ts";

const { addError } = useErrorStore();

interface iAuthCheck {
    isAuthenticated: boolean;
}

async function signUp (
    email: string,
    password: string,
    loading: Ref<boolean>
){
    loading.value = true;

    try {
        const res = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/create-user`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                password,
                email,
            })
        })

        const data = await res.json();

        if (data.status === 201) return true;
        else {
            addError(data.error)
            return false;
        }
    } catch(error: any) {
        addError(error.message)
        return false;
    } finally {
        loading.value = false;
    }
}

async function logIn(
    email: string,
    password: string,
    loading: Ref<boolean>
) {
    loading.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/log-in`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
            body: JSON.stringify({
                password,
                email,
            })
        })

        const data = await response.json();

        if (data.status === 200) {return true}
        else {
            addError(data.error)
            return false;
        }
    } catch(error: any) {
        addError(error.message)
    } finally {
        loading.value = false;
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/check-auth`, {
            method: 'GET',
            credentials: 'include',
        })
        const data: iAuthCheck = await response.json()
        return data.isAuthenticated;
    } catch (error: any) {
        addError(error.message)
    }
}

// async function maintenanceCheck() {
//     try {
//         const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/check-maintenance`, {
//             method: 'GET',
//         })
//         const data = await response.json();
//         return data.maintenance
//     } catch (error: any) {
//         addError(error.message)
//     }
// }

async function getUserId() {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/get-user-id`, {
            method: 'GET',
            credentials: 'include',
        })
        return await response.text();
    } catch (error: any) {
        addError(error.message)
    }
}

async function logOut(loading?: Ref<boolean>) {
    try {
        if (loading) loading.value = true;
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/log-out`, {
            method: 'DELETE',
            credentials: 'include',
        })

        const data = await response.json();
        return data.success;
    } catch (error: any) {
        addError(error.message)
    } finally {
        if (loading) loading.value = false;
    }
}

async function getUserProfileInfo(
    userId: string,
    canEditPage: boolean
) {
    try {
        const response = await fetch(`${import.meta.env.VITE_NEST_API_URL}/authentication/get-user-profile-info/${userId}`, {
            method: 'POST',
            body: JSON.stringify({canEditPage}),
            headers: {
                "Content-Type": "application/json",
                'accept': 'application/json',
            },
        })

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        return await response.json();
    } catch (error: any) {
        addError(error.message)
    }
}

export {
    logIn,
    signUp,
    logOut,
    getUserId,
    checkAuth,
    getUserProfileInfo
};