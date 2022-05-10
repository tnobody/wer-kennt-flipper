<script setup lang="ts">
const props = defineProps<{
    show: boolean,
    index: string,
    locked: boolean
}>()

</script>

<template>
    <Transition name="slide-fade">
        <li v-if="show" 
        :class="{'ring-lime-500 ring-4 ring-offset-4 ring-offset-blue-100': locked}"
        class="transition-all duration-200 ease-out ring-offset-0 focus-within:ring-4 focus-within:ring-offset-4 focus-within:ring-offset-blue-100 hover:ring-4 hover:ring-offset-4 hover:ring-offset-blue-100 rounded-md overflow-hidden shadow-lg">
            <button class="flex focus:outline-none gap-4 h-full w-full  p-4 border-blue-100 bg-white ">
                <span class="font-bold  text-slate-500 uppercase">{{ index }}</span>
                <span class="text-left">                    
                    <slot></slot>
                </span>
            </button>
        </li>
    </Transition>
</template>
<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>