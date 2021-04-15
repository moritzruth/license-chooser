import { ref, watchEffect, onBeforeUnmount } from "vue"

const stack = ref(0)

watchEffect(() => {
  if (stack.value === 0) document.body.style.overflowY = null
  else document.body.style.overflowY = "hidden"
})

export function useBodyScrollLock(active) {
  let wasActive = false

  watchEffect(() => {
    if (active.value) stack.value += 1
    else if (wasActive) stack.value -= 1

    wasActive = active.value
  })

  onBeforeUnmount(() => {
    if (wasActive) stack.value -= 1
  })
}
