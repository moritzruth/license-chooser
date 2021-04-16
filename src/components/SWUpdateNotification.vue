<template>
  <div
    ref="element"
    class="fixed top-4 right-4 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl transform transition duration-200"
    :class="!active && 'opacity-0 pointer-events-none translate-x-100'"
  >
    <div class="font-bold text-lg">
      An update is available.
    </div>
    <button class="py-2 px-4 mt-2 bg-gray-200 dark:bg-gray-700 rounded-md w-full" :disabled="!active" @click="update()">
      Update
    </button>
  </div>
</template>

<style scoped>

</style>

<script>
  import { useRegisterSW } from "virtual:pwa-register/vue"
  import { useTimeout, useMouseInElement } from "@vueuse/core"
  import { watchEffect, computed, ref } from "vue"
  import { useElementFocus } from "../assets/useElementFocus.js"

  export default {
    name: "SWUpdateNotification",
    setup() {
      const element = ref(null)

      const {
        needRefresh,
        updateServiceWorker
      } = useRegisterSW()

      // Uncomment to force-show
      // needRefresh.value = true

      const { isOutside } = useMouseInElement(element)
      const focused = useElementFocus(element)

      const { ready: timedOut, start } = useTimeout(10000)

      watchEffect(() => {
        if (needRefresh.value) start()
      })

      return {
        element,
        active: computed(() => (needRefresh.value && !timedOut.value) || focused.value || (element.value !== null && !isOutside.value)),
        update: updateServiceWorker
      }
    }
  }
</script>
