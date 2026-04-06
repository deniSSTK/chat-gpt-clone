<template>
    <div class="page-container">
        <div class="auth-container">
            <span
                class="title"
            >
                Create Account
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
            <span class="password-score" :class="passwordScore" />
            <div class="password-input-container">
                <input
                    maxlength="16"
                    class="input-auth password"
                    placeholder="confirm password"
                    v-model="confirmPasswordRef"
                    :type="canViewConfirmPassword ? 'text' : 'password'"
                >
                <input type="checkbox" id="checkbox-confirm-password" v-model="canViewConfirmPassword">
                <label for="checkbox-confirm-password">
                    <Icon
                        :icon="canViewConfirmPassword ? 'iconamoon:eye-thin' : 'iconoir:eye-closed'"
                        width="30"
                        height="30"/>
                </label>
            </div>
            <button
                class="button-auth"
                :disabled="
                !validator.isEmail(emailRef)
                || passwordScore !== 'high'
                || passwordRef !== confirmPasswordRef
                || passwordRef.length < 8
                || loading"
                @click="signUpRouter()"
            >
                {{ loading ? "Loading..." : "Create Account"  }}
            </button>
            <a href="/log-in">Already have an account?</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import useLoading from "../use/useLoading.ts";

const { setLoading } = useLoading();
import { signUp } from "../services/authentication.ts";
import '../css/auth.css';
import '../css/auth-sign-up.css'

import validator from 'validator'
import zxcvbn from 'zxcvbn';

const router = useRouter();

const emailRef = ref<string>('');
const passwordRef = ref<string>('');
const confirmPasswordRef = ref<string>('');
const loading = ref<boolean>(false);

const canViewPassword = ref<boolean>(false);
const canViewConfirmPassword = ref<boolean>(false);

const passwordScore = ref<
    'low' | 'mid' | 'high'
>('low');

watch(passwordRef, (newPassword) => {
    const result = zxcvbn(newPassword);
    if (result.score <= 1) {
        passwordScore.value = 'low';
    }
    else if (result.score >= 2 && result.score < 4) {
        passwordScore.value = 'mid';
    }
    else if (result.score === 4) {
        passwordScore.value = 'high';
    }
});

const signUpRouter = async () => {
    setLoading(true)
    const data = await signUp(
        emailRef.value,
        passwordRef.value,
        loading
    )
    setLoading(false)
    if (data) await router.push('/c');
    emailRef.value = '';
    passwordRef.value = '';
    confirmPasswordRef.value = '';
}
</script>