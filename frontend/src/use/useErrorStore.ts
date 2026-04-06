import { reactive } from 'vue';

interface iError {
    id: string;
    message: string;
    type: "error" | "success" | "warn";
}

const state = reactive({
    errors: [] as iError[]
});

const addError = (message: string, type: "error" | "success" | "warn"="error") => {
    const id = Date.now().toString();
    state.errors.push({ id, message, type });

    setTimeout(() => {
        const index = state.errors.findIndex((error) => error.id === id);
        if (index !== -1) state.errors.splice(index, 1);
    }, 4000);
};

export default function useErrorStore() {
    return {
        errors: state.errors,
        addError
    };
}
