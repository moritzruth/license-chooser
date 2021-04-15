<template>
  <div
    class="fixed top-0 left-0 w-100vw h-100vh p-4 md:p-10 flex items-center justify-center bg-gray-200 dark:bg-black transition duration-200 overflow-y-hidden"
    :class="open ? 'bg-opacity-50 dark:bg-opacity-60' : 'bg-opacity-0 dark:bg-opacity-0 pointer-events-none'"
  >
    <div
      ref="dialogElement"
      role="dialog"
      :aria-modal="Boolean(open)"
      class="bg-white dark:bg-gray-900 shadow-lg rounded-lg transition duration-200 transform max-w-900px max-h-full flex-grow overflow-y-auto"
      :class="open || 'scale-70 opacity-0'"
    >
      <article v-if="lazyLicense">
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-5 md:px-10 md:py-5 shadow-md">
          <div class="font-mono text-gray-500 dark:text-gray-400 text-lg">
            {{ lazyLicense.id }}
          </div>
          <h1 class="font-bold text-2xl md:text-3xl">
            {{ lazyLicense.title }}
          </h1>
        </div>
        <div class="p-5 pt-8 md:p-10 md:pt-8">
          <p class="text-lg">
            {{ lazyLicense.description }}
          </p>
          <h2 class="font-bold text-2xl mt-5">Attributes</h2>
          <h3 class="font-bold text-lg mb-1">Permissions</h3>
          <BadgesBag badge-class="bg-blue-200 text-blue-800" :items="lazyLicense.permissions.map(item => permissionBadges[item])"/>
          <h3 class="font-bold text-lg mb-1 mt-2">Conditions</h3>
          <span v-if="lazyLicense.conditions.length === 0" class="text-gray-500 dark:text-gray-400 text-lg -mt-1 block">None</span>
          <BadgesBag v-else badge-class="bg-yellow-200 text-yellow-900" :items="lazyLicense.conditions.map(item => conditionBadges[item])"/>
          <h3 class="font-bold text-lg mb-1 mt-2">Limitations</h3>
          <span v-if="lazyLicense.limitations.length === 0" class="text-gray-500 dark:text-gray-400 text-lg -mt-1 block">None</span>
          <BadgesBag v-else badge-class="bg-red-100 text-red-600" :items="lazyLicense.limitations.map(item => limitationBadges[item])"/>
          <h2 class="font-bold text-2xl mb-1 mt-3">
            How to use
          </h2>
          <p class="mb-4" v-html="lazyLicense.howToUse"/>
          <p v-if="lazyLicense.note" class="mb-4 -mt-1" v-html="lazyLicense.note"/>
          <LicenseTextEditor ref="editor" :text="lazyLicense.text"/>
        </div>
      </article>
      <div class="flex space-x-2 justify-end mt-5 sticky bottom-0 bg-white dark:bg-gray-800 px-4 md:px-10 py-4 shadow-umd space-x-4">
        <button
          class="px-5 py-2 bg-blue-400 dark:bg-blue-600 rounded-md font-bold text-white focus:outline-none focus-visible:ring-4 ring-blue-400 ring-offset-2 w-45"
          @click="copy()"
        >
          {{ notShowCopied ? "Copy to clipboard" : "Copied!" }}
        </button>
        <button class="close-button px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus-visible:ring-4 ring-gray-300 ring-offset-4" @click="close()">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, watchEffect, computed, nextTick } from "vue"
  import { useFocusTrap } from "@vueuse/integrations"
  import { useTimeout } from "@vueuse/core"
  import { permissionBadges, conditionBadges, limitationBadges } from "../assets/attributeBadgeMapping.js"
  import { useBodyScrollLock } from "../assets/useBodyScrollLock.js"
  import BadgesBag from "./BadgesBag.vue"
  import LicenseTextEditor from "./LicenseTextEditor.vue"

  export default {
    name: "LicenseModal",
    components: { LicenseTextEditor, BadgesBag },
    props: {
      license: {
        type: null,
        required: true,
        validate: value => value === null || typeof value === "object"
      }
    },
    emits: ["close"],
    setup(props, context) {
      const lazyLicense = ref(null)
      const dialogElement = ref(null)
      const editor = ref(null)

      const focusTrap = useFocusTrap(dialogElement, {
        onDeactivate() {
          context.emit("close")
        },
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        returnFocusOnDeactivate: true,
        initialFocus: ".close-button"
      })

      const open = computed(() => props.license !== null)

      watchEffect(() => {
        if (open.value) {
          nextTick(() => {
            focusTrap.activate()
          })

          lazyLicense.value = props.license
        } else {
          focusTrap.deactivate()
        }
      })

      useBodyScrollLock(open)

      const { ready: notShowCopied, start } = useTimeout(1000)

      return {
        notShowCopied,
        editor,
        permissionBadges,
        conditionBadges,
        limitationBadges,
        dialogElement,
        lazyLicense,
        copy() {
          editor.value.copyToClipboard()
          start()
        },
        close() {
          focusTrap.deactivate()
        },
        open
      }
    }
  }
</script>
