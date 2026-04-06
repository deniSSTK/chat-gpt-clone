<template>
    <div class="personalization-styles-container">
        <div class="styles-container">
            <div class="style-icon default"
                 @click="changeStyle('default')"
                 :class="chosenStyle === 'default' && 'chosen'"
            >
                <Icon icon="proicons:chat" width="24" height="24" />
                <span>Default</span>
            </div>
            <div class="style-icon overmind"
                 @click="changeStyle('overmind')"
                 :class="chosenStyle === 'overmind' && 'chosen'"
            >
                <Icon icon="meteor-icons:robot" width="24" height="24" />
                <span>Overmind</span>
            </div>
            <div class="style-icon rival"
                 @click="changeStyle('rival')"
                 :class="chosenStyle === 'rival' && 'chosen'"
            >
                <Icon icon="majesticons:lightning-bolt" width="24" height="24" />
                <span>Rival</span>
            </div>
            <div class="style-icon soft"
                 @click="changeStyle('softCompanion')"
                 :class="chosenStyle === 'softCompanion' && 'chosen'"
            >
                <Icon icon="tabler:heart-handshake" width="24" height="24" />
                <span>Soft</span>
            </div>
            <div class="style-icon villain"
                 @click="changeStyle('villainMode')"
                 :class="chosenStyle === 'villainMode' && 'chosen'"
            >
                <Icon icon="mdi:drama-masks" width="24" height="24" />
                <span>Villain</span>
            </div>
            <div class="style-icon chaotic"
                 @click="changeStyle('chaoticMuse')"
                 :class="chosenStyle === 'chaoticMuse' && 'chosen'"
            >
                <Icon icon="mdi:wand" width="24" height="24" />
                <span>Chaotic</span>
            </div>
            <div class="style-icon snoop-dogg"
                 @click="changeStyle('snoopDogg')"
                 :class="chosenStyle === 'snoopDogg' && 'chosen'"
            >
                <img src="/snoop-dogg.svg" alt=""/>
                <span>Snoop dogg</span>
            </div>
        </div>
        <div v-if="showInfo">
            Refresh chat or <a href="/c">Create New</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import "../css/personalization-styles.css";
import {onBeforeMount, ref} from "vue";
import {getPersonalizationStyle, updatePersonalizationStyle} from "../services/personalization.ts";
import useLoading from "../use/useLoading.ts"
import useErrorStore from "../use/useErrorStore.ts";

const { setLoading } = useLoading();
const { addError } = useErrorStore();

const chosenStyle = ref<string>('');
const showInfo = ref<boolean>(false);

onBeforeMount(async () => {
    chosenStyle.value = await getPersonalizationStyle();
})

const changeStyle = async (value: string) => {
    try {
        setLoading(true);
        await updatePersonalizationStyle(value);
        chosenStyle.value = value;
        showInfo.value = true;
    } catch (error: any) {
        addError(error.message)
    } finally {
        setLoading(false);
    }
}
</script>