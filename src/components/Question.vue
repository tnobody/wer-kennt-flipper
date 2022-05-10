<script setup lang="ts">
import { QuestionModel } from '../question-model';
import snarkdown from 'snarkdown';
import Answer from './Answer.vue';
const props = defineProps<{
    question: QuestionModel,
    showAnswer: number,
    lockedAnswer: string | null
}>()
const emit = defineEmits<{
    (e: 'answered', answer: string): void
}>()

const md = snarkdown;

const answerIndices: Array<keyof QuestionModel> = ['a', 'b', 'c', 'd']

</script>

<template>
    <div class="container p-4 flex flex-col gap-8">
        <div class="text-center text-3xl">
            <span class="text-slate-500">{{ question.author.name }}:&nbsp;</span>
            <span v-html="md(question.question)"></span>
        </div>
        <ol class="question text-xl grid grid-cols-2 gap-4">
            <Answer v-for="(index, i) in answerIndices" :key="index" @click="emit('answered', index)"
                :locked="lockedAnswer === index" :show="showAnswer > i" :index="index">{{ question[index] }}</Answer>
        </ol>
    </div>
</template>
<style>
</style>