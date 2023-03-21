import type { Ref, WritableComputedRef } from 'vue'
import { computed, unref, watch } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import { Decoration, type DecorationSet, type EditorViewConfig } from '@codemirror/view'
import { EditorSelection, EditorState, StateEffect, StateField, type Extension } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript, esLint } from '@codemirror/lang-javascript'
import { htmlLanguage } from '@codemirror/lang-html'
import { jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { pythonLanguage } from '@codemirror/lang-python'
import { rustLanguage } from '@codemirror/lang-rust'
import { vueLanguage } from '@codemirror/lang-vue'
import type { CompletionSource } from '@codemirror/autocomplete'
import { oneDark } from '@codemirror/theme-one-dark'
import { vitesse } from '../theme/vitesse'
// import { linter } from '@codemirror/lint'
// linter(esLint())

export const addMarks = StateEffect.define<any>()
export const filterMarks = StateEffect.define<any>()

const markField = StateField.define({
  // Start with an empty set of decorations
  create() { return Decoration.none },
  // This is called whenever the editor updates—it computes the new set
  update(value, tr) {
    // Move the decorations to account for document changes
    value = value.map(tr.changes)
    // If this transaction adds or removes decorations, apply those changes
    for (const effect of tr.effects) {
      if (effect.is(addMarks))
        value = value.update({ add: effect.value, sort: true })
      // @ts-expect-error any
      else if (effect.is(filterMarks))
        // @ts-expect-error any
        value = value.update({ filter: effect.value })
    }
    return value
  },
  // Indicate that this field provides a set of decorations
  provide: f => EditorView.decorations.from(f),
})

export const langExtersions: Record<string, () => {}> = {
  Javascript: javascript,
  Typescript: () => javascript({ typescript: true }),
  HTML: () => htmlLanguage.extension,
  Vue: () => vueLanguage.extension,
  Svelte: () => htmlLanguage.extension,
  React: () => javascript({ typescript: true, jsx: true }),
  JSON: () => jsonLanguage.extension,
  Python: () => pythonLanguage.extension,
  Rust: () => rustLanguage.extension
}


export const useCodeMirror = (
  parent: Ref<HTMLElement | null | undefined>,
  input: Ref<string> | WritableComputedRef<string>,
  options: MaybeRef<EditorViewConfig & {readOnly?: boolean; mode?: string; autocomplete?: CompletionSource}> = {}
) => {

  const extensions = computed(() => {
    const { mode = 'Javascript', readOnly, autocomplete} = unref(options)
    return [
      basicSetup,
      vitesse,
      // markField,
      langExtersions[mode](),
      readOnly && EditorState.readOnly.of(true)
    ].filter(Boolean) as Extension[]
  })

  let skip = false
  const codemirror = new EditorView({
    parent: parent.value as Element,
    doc: input.value,
    extensions: extensions.value,
    dispatch(tr) {
      codemirror.update([tr])

      const selection = codemirror.state.selection.main
        if (selection.from !== selection.to) {
          codemirror.contentDOM.style.setProperty('--cm-line-highlight-background', 'transparent')
          codemirror.contentDOM.style.setProperty('--cm-line-highlight-border', 'transparent')
        }
        else {
          codemirror.contentDOM.style.removeProperty('--cm-line-highlight-background')
          codemirror.contentDOM.style.removeProperty('--cm-line-highlight-border')
        }

      if (tr.docChanged) {
        if (skip) {
          skip = false
          return
        }
        input.value = codemirror.state.doc.toString()
      }
    },
    ...unref(options)
  })

  watch(options, () => {
    codemirror.dispatch({
      effects: StateEffect.reconfigure.of(extensions.value)
    })
  })

  watch(
    input,
    (v) => {
      if (v !== codemirror.state.doc.toString()) {
        skip = true
        const selections = codemirror.state.selection.ranges
        codemirror.dispatch({
          changes: { from: 0, to: codemirror.state.doc.length, insert: v},
          selection: EditorSelection.create(selections)
        })
      }
    },
    { immediate: true } 
  )
  
  return codemirror
}
