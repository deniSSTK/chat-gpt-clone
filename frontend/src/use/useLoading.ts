import { ref } from 'vue';

const loading = ref<boolean>(false);

export default function useLoading() {
    return {
        loading,
        setLoading: (value: boolean) => loading.value = value,
    }
}