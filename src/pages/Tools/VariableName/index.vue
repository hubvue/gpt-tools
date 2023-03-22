<template>
  <main class="main mx-auto mt-64">
    <div class="relative inline-block w-full box-border align-middle">
      <div class="input_wrapper w-full inline-flex flex-grow items-center justify-center">
        <input 
          v-model="variableDesc" 
          type="text" 
          autocomplete="off" 
          tabindex="0"
          class="input h-10 w-full flex-grow p-0 outline-0 bg-transparent box-border"
          @keyup.enter="sendVariableName"
        >
        <el-icon class="cursor-pointer" size="22" @click="sendVariableName"><position /></el-icon>
      </div>
    </div>
    <div class="flex flex-wrap mt-8 px-3">
      <p 
        class="py-1 px-3 mx-2 rounded-2xl cursor-pointer" 
        :style="{backgroundColor: variableName.bgColor, color: variableName.fgColor}"
        :key="index" 
        @click="copyVariableName(variableName.value)"
        v-for="(variableName, index) in variableNames"
      >
        {{ variableName.value }}
      </p>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElIcon, ElLoading, ElMessage } from 'element-plus'
import { Position } from '@element-plus/icons-vue'
import { variableName, type Response } from '../../../api'

const variableDesc = ref('')
interface VariableName {
  value: string
  bgColor: string
  fgColor: string
}
const variableNames = ref<VariableName[]>([])

const sendVariableName = async () => {
  if (!variableDesc.value) {
    ElMessage.info("请输入命名描述")
    return
  }
  const loading = ElLoading.service({ fullscreen: true, text: '生成中...'})
  try {
    const res = await variableName({
      input: variableDesc.value
    }) as unknown as Response<string>
    
    if (res.err) {
      ElMessage.error(res.message)
      return
    }
    variableNames.value = namesProcessor(res.data.trim())
    loading.close()
  } catch(err: any) {
    loading.close()
    ElMessage.error(err.message)
  }
}

const namesProcessor = (ns: string): VariableName[] => {
  return ns.split(',').map<VariableName>(n => {
    let bgColor = getRndomColor()
    return {
      value: n.trim(),
      fgColor: getFontColor(bgColor),
      bgColor
    }
    
    
    
  })
}

const getRndomColor = () => {
  const r = (Math.random() * 255) >> 0
  const g = (Math.random() * 255) >> 0
  const b = (Math.random() * 255) >> 0
  return `rgb(${r}, ${g}, ${b})`
}

const getFontColor = (bg: string) => {
  const [r, g, b, a] = (bg.match(/\d+/g) as string[]).map(Number)
  // 计算背景色亮度
  const brightness = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)
  return brightness > 128 ? '#555' : '#bbb'
}

const copyVariableName = async (name: string) => {
  try {
    await navigator.clipboard.writeText(name)
    ElMessage.success('复制成功')
  } catch(err) {
    ElMessage.error('复制成功')
  }
}

</script>
<style lang="stylus">
.input_wrapper
  width 100%
  padding 1px 16px
  border 1px solid var(--fg)
  border-radius 20px
  background-color: var(--c-bg)
  transform translate3d(0, 0, 0)
  box-shadow 0 0 0 1px var(-el-input-border-color)
  

  .input
    --webkit-appearance: none

</style>
