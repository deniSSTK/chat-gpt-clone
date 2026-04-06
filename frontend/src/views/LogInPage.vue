<template>
    <div class="page-container">
        <div class="auth-container">
            <span
                class="title"
            >
                Log In
            </span>
            <input
                class="input-auth"
                placeholder="input email"
                v-model="emailRef"
            >
            <div class="password-input-container">
                <input
                    class="input-auth password"
                    placeholder="input password"
                    v-model="passwordRef"
                    maxlength="16"
                    :type="canViewPassword ? 'text' : 'password'"
                >
                <input type="checkbox" id="checkbox-password" v-model="canViewPassword">
                <label for="checkbox-password">
                    <Icon
                        :icon="canViewPassword ? 'iconamoon:eye-thin' : 'iconoir:eye-closed'"
                        width="30"
                        height="30"/>
                </label>
            </div>
            <button
                class="button-auth"
                :disabled="
                !validator.isEmail(emailRef)
                || passwordRef.length < 8
                || loading"
                @click="logInRouter()"
            >
                {{ loading ? 'Loading...' : 'Log in'}}
            </button>
            <a href="/sign-up">Don't have an account yet?</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import '../css/auth.css';
import {ref} from 'vue'
import validator from 'validator'
import { useRouter } from "vue-router";
import { logIn } from "../services/authentication.ts";
import { Icon } from "@iconify/vue";
import useLoading from "../use/useLoading.ts";

const { setLoading } = useLoading();
const router = useRouter();

const emailRef = ref<string>('');
const passwordRef = ref<string>('');
const loading = ref<boolean>(false);
const canViewPassword = ref<boolean>(false);

const logInRouter = async () => {
    setLoading(true);
    const data = await logIn(
        emailRef.value,
        passwordRef.value,
        loading
    )
    setLoading(false);
    if (data) await router.push('/c')
    emailRef.value = ''
    passwordRef.value = ''
}
</script>