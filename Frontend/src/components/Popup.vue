<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <button class="popup-close" @click="togglePopup">X</button>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        togglePopup: Boolean,
    })
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    .popup-inner {
        position: relative;
        background: rgb(33, 32, 32);
        padding: 32px;
    }

    .popup-close {
        position: absolute;
        top: 10px;
        right: 10px;
        
    }

}
</style>
