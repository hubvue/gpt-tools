<template>
  <main class="px-7 py-36 main mx-auto">
    <section>
      <h1>Tools</h1>
      <h6>基于 ChatGPT 做一些定向能力的工具。</h6>
    </section>
    <div class="mt-12">
      <RouterLink class="item rounded-md" :to="tool.path" v-for="(tool, index) in tools" :key="index">
        <div class="text-normal">{{ tool.title }}</div>
        <div class="text-sm opacity-50 font-normal">{{ tool.desc }}</div>
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
interface Tool {
  title: string,
  desc: string,
  path: string,
}
const tools: Tool[] = [
  {
    title: '代码转换器',
    desc: '将源语言代码转换成目标语言代码。',
    path: '/code-convert'
  },
  {
    title: '类型转换器',
    desc: '将源语言类型转换成目标语言类型，支持JSON向各语言转换。',
    path: '/type-convert'
  },
  {
    title: '自然语言翻译',
    desc: '自然语言翻译工具',
    path: '/translation'
  },
  {
    title: '变量命名',
    desc: '提供描述信息，让ChatGPT帮你变量命名',
    path: 'variable-name'
  }
]

</script>
<style lang="stylus">
.main
  max-width: 65ch

  a.item
    display block
    padding: 0.8em 1em
    font-size: 1.1rem
    background: transparent

    &:hover
      background: #88888812
</style>


