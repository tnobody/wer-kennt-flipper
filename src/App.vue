<script setup lang="ts">
import Question from './components/Question.vue';
import { computed, ref } from 'vue';
import questions from './data.json'
import {set, get} from './util'

const showAnswer = ref(0);
const question = computed(() => questions[current.value])
const userAnswer = ref<'PENDING' | 'CORRECT' | 'INCORRECT'>('PENDING')

const solutionAnswered = ref('');

const solution = computed(() => get(solutionAnswered).padEnd(questions.length, '*'))
const current = computed(() => get(solutionAnswered).length);
const codeWrong = 'x'

const stats = computed(() => ({
  correct: [...get(solutionAnswered)].filter(a => a !== codeWrong).length,
  incorrect: [...get(solutionAnswered)].filter(a => a === codeWrong).length,
  count: get(solutionAnswered).length
}))

const currentAnswer = ref<string | null>(null);
const handleAnswer = (answer: string) => {
  set(currentAnswer, answer)  
}

const solve = () => {
  const wasCorrect = question.value.answer === currentAnswer.value;
  set(userAnswer,   wasCorrect ? 'CORRECT': 'INCORRECT')  
}

const next = () => {  
  const wasCorrect = get(question).answer === get(currentAnswer);
  set(solutionAnswered, get(solutionAnswered) + (wasCorrect ? question.value.solutionKey : codeWrong))  
  set(userAnswer, 'PENDING')
  set(currentAnswer, null)
      set(showAnswer, 0)

}

const pickRandom = <T>(arr:T[]) => arr[Math.floor(Math.random() * arr.length)];

const emojis= {
  'PENDING': [],
  'INCORRECT': ['🥶', '😱' ,'😨' ,'😰' ,'😥', '😓'],
  'CORRECT': ['🧐','🤓','😎','🤩','🥳','🤑', '😄','😁']
}

</script>
<template>
  <div @click="showAnswer++"
    class="flex h-screen w-screen flex-col gap-8 items-center justify-center bg-gradient-to-bl from-slate-100 to-blue-100">
    <nav class="shadow-lg bg-white p-4 rounded-full">
      <ul class="flex gap-4 items-center">
        <li v-for="(q, i) of questions" :key="q.question" class="transform block transition-transform relative"
          :class="{ 'scale-150': current === i }">
          <div class="relative rounded-full text-white h-12 w-12 overflow-hidden flex items-center">
            <img v-if="q.author.avatar" :src="q.author.avatar" :class="{'grayscale': current > i}" />
            <div v-else class="bg-blue-500 w-full h-full text-xl flex items-center justify-center">{{ q.author.name[0] }}
            </div>
          </div>
          <svg v-if="current > i && solutionAnswered[i] !==codeWrong" class="absolute bottom-0 right-0 text-lime-500 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <svg v-if="current > i && solutionAnswered[i] ===codeWrong" class="absolute bottom-0 right-0 text-red-500 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
        </li>
      </ul>
    </nav>
    <Question v-if="question" @answered="handleAnswer($event)" :locked-answer="currentAnswer" :question="question"
      :show-answer="showAnswer"></Question>
      <div v-else class="text-4xl text-center max-w-prose">
        Herzlichen Glückwunsch <br />du konntest {{stats.correct}} von {{stats.count}} Ziffern des Tresor-Codes herausfinden.
      </div>
    <Transition name="slide-fade">
      <dialog v-if="!!currentAnswer" class="w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div v-if="userAnswer === 'PENDING'" class="max-w-sm shadow-lg bg-white border rounded p-8 text-2xl flex flex-col gap-4">
          <span>
            Antwort <strong class="uppercase">{{ currentAnswer }}</strong> nehmen.
          </span>          
          <menu class="flex flex-col gap-4">
            <button @click.prevent.stop="solve()" class="rounded bg-lime-400 p-4">Ja</button>
            <button @click.prevent.stop="currentAnswer = null; userAnswer = 'PENDING'"
              class="rounded text-red-800 hover:underline">Nein</button>
          </menu>
        </div>
        <div v-else class="max-w-prose flex flex-col text-center shadow-lg bg-white border rounded p-8 text-2xl flex flex-col gap-8">
            <span>Das war</span>
            <span class="animate__animated animate__tada text-4xl font-bold" :class="{'text-red-500': userAnswer === 'INCORRECT', 'text-lime-500': userAnswer === 'CORRECT'}">{{userAnswer === 'CORRECT' ? 'Richtig': 'Falsch'}}</span>
            <span class="text-8xl animate__animated animate__wobble">
              {{pickRandom(emojis[userAnswer])}}
            </span>
            <span v-if="userAnswer === 'INCORRECT'">
              Richtig ist <strong class="uppercase">{{question.answer}}</strong>:<br />
              {{(question[question.answer as any])}}
            </span>
            <button @click.prevent.stop="next()" class="rounded bg-lime-400 p-4">Weiter</button>
        </div>
      </dialog>
    </Transition>
    <nav class="shadow-lg bg-white p-4 rounded-full  text-3xl font-thin text-slate-900 font-bold">
      <ul class="flex gap-4 font-mono">
        <li class="flex items-center justify-center h-12 w-12 text-slate-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z">
            </path>
          </svg>
        </li>
        <li v-for="(s, i) of solution" :key="i" class="flex items-center justify-center h-12 w-12" :class="{'text-red-500': s === codeWrong}">
          {{ s }}
        </li>
      </ul>
    </nav>  
  </div>
</template>

<style>
</style>
