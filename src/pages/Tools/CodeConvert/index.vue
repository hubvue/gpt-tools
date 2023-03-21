<template>
  <div class="">
    <header class="code-convert-header h-12 flex items-center justify-center font-bold font-mono text-2xl ">
      {{ title }}
    </header>
    <div class="code-convert-tabbar flex justify-between items-center">
      <el-select v-model="originLang">
        <el-option v-for="item in allLangOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="flex items-center">
        <el-icon class="mr-3 cursor-pointer" @click="copyCode('origin')"><copy-document/></el-icon>
        <el-icon class="cursor-pointer" size="28px" color="red" @click="convertHandler"><caret-right/></el-icon>
        <el-icon class="ml-3 cursor-pointer" @click="copyCode('target')"><copy-document/></el-icon>
      </div>
      <el-select v-model="targetLang">
        <el-option v-for="item in targetLangOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <main class="code-convert-main flex overflow-hidden">
      <section class="w-2/4 flex-auto">
        <Editor v-model="originCode" :mode="originLang"></Editor>
      </section>
      <section class="w-2/4 flex-auto">
        <Editor v-model="targetCode" :mode="targetLang"></Editor>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Editor from '../../../components/Editor/index.vue'
import { ElSelect, ElOption, ElIcon, ElMessage, ElLoading } from 'element-plus'
import { CopyDocument, CaretRight } from '@element-plus/icons-vue'
import { langExtersions } from '../../../composables/codemirror'
import { useTitle } from '../../../composables/title'
import { convert, type Response } from '../../../api'

interface Props {
  mode?: 'code' | 'type'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'code'
})

console.log('props', props)

const title = computed(() => props.mode === 'code' ? '代码转换器' : '类型转换器')

useTitle(title.value)

const typeLangs = ['JSON', 'Rust', 'Typescript']

const allLangOptions = (props.mode == 'type' ? typeLangs : Object.keys(langExtersions)).map(i => ({
  value: i,
  label: i,
}))
const originLang = ref(allLangOptions[0].value)

const targetLangOptions = computed(() => allLangOptions.filter(option => option.value !== originLang.value))

const targetLang = ref(targetLangOptions.value[0].value)

watch(originLang, (origin) => {
  if (origin === targetLang.value) {
    targetLang.value = targetLangOptions.value[0].value
  }
})

const originCode = ref<string>('')
const targetCode = ref<string>('')

const copyCode = async (type: string) => {
  try {
    let text: string
    if (type === 'origin') {
      text = originCode.value
    } else {
      text = targetCode.value
    }
    if (!text) {
      ElMessage.info('复制内容为空')
      return
    }
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch(err) {
    ElMessage.error('复制失败')
  }
}

const trimLineFeed = (str: string): string => {
  return str.replace(/^\/n+|\/n+$/g, '')
}



const convertHandler = async () => {
  if (originCode.value.trim() === '') {
    ElMessage.info('请输入代码')
    return
  }
  const loading = ElLoading.service({ fullscreen: true, text: '转换中...' })
  try {
    const res = await convert({
      input: originCode.value,
      origin: originLang.value,
      target: targetLang.value,
      mode: props.mode
    }) as unknown as Response<string>
    if (res.err) {
      ElMessage.error(res.message)
      return
    }
    targetCode.value = trimLineFeed(res.data).trim()
    loading.close()
  } catch(err: any) {
    loading.close()    
    ElMessage.error(err.message)
  }

}

</script>
<style lang="stylus" scoped>
.code-convert-header
  height 10vh

.code-convert-tabbar
  height 32px
.code-convert-main
  height calc(90vh - 32px)
</style>
