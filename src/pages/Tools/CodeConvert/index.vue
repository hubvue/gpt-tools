<template>
  <div class="">
    <header class="code-convert-header h-12">
      代码转换器
    </header>
    <main class="code-convert-main flex overflow-hidden">
      <section class="w-2/4 flex-auto">
        <Editor v-model="code1"></Editor>
      </section>
      <section class="w-2/4 flex-auto">
        <Editor v-model="code1"></Editor>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Editor from '../../../components/Editor/index.vue'

const code1 = ref(`

const props = defineProps<{
  modelValue: string
  mode?: string
  readOnly?: boolean
  matched?: Set<string> | string[]
  getHint?: CompletionSource
}>()

const emit = defineEmits<{ (e: 'update:modelValue', payload: string): void }>()

const el = ref<HTMLElement>()
const input = useVModel(props, 'modelValue', emit, { passive: true })

onMounted(async () => {
  const cm = useCodeMirror(el, input, reactive({
    autocomplete: props.getHint,
    ...toRefs(props),
  }))

  useEventListener(cm.contentDOM.parentElement, 'scroll', useThrottleFn(() => {
    cm.requestMeasure()
  }, 50, true))

  function mark(start: number, end: number) {
    const strikeMark = Decoration.mark({
      class: 'highlighted',
    })
    cm.dispatch({
      effects: addMarks.of([strikeMark.range(start, end)]),
    })
  }

  function highlight() {
    cm.dispatch({
      effects: filterMarks.of((from: number, to: number) => to <= 0 || from >= cm.state.doc.toString().length),
    })
    getMatchedPositions(props.modelValue, Array.from(props.matched || []), true)
      .forEach(i => mark(i[0], i[1]))
  }

  let timer: any = 0
  watch(() => [props.modelValue, props.matched], async () => {
    clearTimeout(timer)
    if (props.matched)
      timer = setTimeout(highlight, 200)
  }, { immediate: true })
})
`)
</script>
<style lang="stylus" scoped>
.code-convert-header
  height 5vh

.code-convert-main
  height 95vh
</style>
