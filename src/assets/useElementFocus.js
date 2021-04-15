import { watchEffect, ref } from "vue"
import { useEventListener } from "@vueuse/core"

export function useElementFocus(element) {
  const focused = ref(false)
  useEventListener(element, "focusin", () => {
    focused.value = true
  })

  useEventListener(element, "focusout", () => {
    focused.value = element.value.contains(document.activeElement)
  })

  watchEffect(() => {
    if (element.value !== null) {
      focused.value = element.value.contains(document.activeElement)
    }
  })

  return focused
}
