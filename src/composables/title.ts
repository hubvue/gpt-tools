import { onMounted } from 'vue'

export const useTitle = (title: string) => {
  onMounted(() => {
    document.title = title
  })
}
