<template>
    <a href="/c" class="profile-back-button">
        <Icon icon="material-symbols:close" width="30" height="30" />
    </a>
    <div class="profile-page">
        <div class="profile-header">
            <div class="profile-user-section">
                <img :src="userIconUrl ? userIconUrl : '/default-icon.png'" alt="profile icon" class="profile-avatar">
                <div class="profile-user-info">
                    <div class="profile-username">{{userName}}</div>
                    <div class="profile-user-id"
                        @click="copyToClipboard"
                    >{{ `@${pageUserId}` }}</div>
<!--                    <button class="edit-profile-button"-->
<!--                        v-if="canEditPage"-->
<!--                    >Edit profile</button>-->
                </div>
            </div>
            <div class="profile-stats">
                <div class="profile-stat">
                    <div class="stat-value">{{chatsCount}}</div>
                    <div class="stat-label">Chats</div>
                </div>
                <div class="profile-stat">
                    <div class="stat-value">{{imagesCount}}</div>
                    <div class="stat-label">Images</div>
                </div>
            </div>
        </div>
        <div class="profile-gallery">
            <div class="gallery-title">Gallery</div>
            <div class="gallery public-gallery">
                <div class="image generation-loader"
                     v-if="loading"
                     v-for="n in 10"
                     :key="n"
                />
                <GeneratedImage
                    v-for="(image, index) in images"
                    :image="image.imageUrl"
                    :key="index"
                    :remove-from-public="true"
                />
            </div>
            <div class="gallery-title"
                v-if="canEditPage"
            >Private Images</div>
            <div class="gallery private-gallery"
                 v-if="canEditPage"
            >
                <div class="image generation-loader"
                     v-if="loading"
                     v-for="n in 10"
                     :key="n"
                />
                <GeneratedImage
                    v-for="(image, index) in privateImages"
                    :image="image.imageUrl"
                    :key="index"
                    :add-to-public="true"
                />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import "../css/page-profile.scss";
import GeneratedImage from "../components/GeneratedImage.vue";
import {onMounted, ref} from "vue";
import "../css/generating-loading.css"
import {useRoute, useRouter} from "vue-router";
import {getUserId, getUserProfileInfo} from "../services/authentication.ts";
import useErrorStore from "../use/useErrorStore.ts";
import gsap from "gsap";
import {Icon} from "@iconify/vue";

interface iImage {
    imageUrl: string;
}

const route = useRoute();
const router = useRouter();
const pageUserId = route.params.id as string;
const baseUrl = window.location.origin;

const loading = ref<boolean>(true);
const canEditPage = ref<boolean>(false);

const images = ref<iImage[]>([]);
const privateImages = ref<iImage[]>([]);
const userName = ref<string>("");
const chatsCount = ref<number>(0);
const imagesCount = ref<number>(0);
const userIconUrl = ref<string>("");

const { addError } = useErrorStore();

onMounted(async () => {
    try {
        const userId = await getUserId();
        if (userId === pageUserId) {
            canEditPage.value = true;
        }

        const userInfo = await getUserProfileInfo(pageUserId, canEditPage.value);
        if (!userInfo) {
            await router.push('/not-found');
        }
        gsap.to(".generation-loader", {
            opacity: 0,
            duration: .3,
            onComplete: () => {
                images.value = userInfo.publicGallery;
                userName.value = userInfo.userName;
                chatsCount.value = userInfo.chatsCount;
                imagesCount.value = userInfo.imagesCount;
                userIconUrl.value = userInfo.userIconUrl;

                if (canEditPage.value) {
                    privateImages.value = userInfo.galleryList.filter(
                        ( image: iImage ) => !images.value.some(img => img.imageUrl === image.imageUrl)
                    );
                }
                loading.value = false;
            }
        })
    } catch (error: any) {
        addError(error.message)
    }
})

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/p/${pageUserId}`);
};
</script>