<template>
  <div>
    <form class="mb-5 space-y-4">
      <label
        v-for="name in activeFields"
        :key="name"
        class="text-lg block"
      >
        <span class="block">
          {{ replacementLabels[name] }}
        </span>
        <input v-model="replacements[name]" class="font-mono border-gray-300 border-2 px-3 py-2 rounded-lg outline-none focus:border-blue-400 transition duration-200 w-full">
      </label>
      <p v-if="text.includes('[year]')">
        The year is automatically replaced.
      </p>
    </form>
    <div class="p-4 bg-gray-100 font-mono w-full max-h-50vh overflow-auto relative">
      <pre v-text="resultingText"/>
    </div>
  </div>
</template>

<script>
  import { computed } from "vue"
  import { useLocalStorage } from "@vueuse/core"

  const REPLACEMENT_LABELS = {
    fullname: "Your name",
    email: "Your email address",
    login: "The repository owner's username",
    project: "The organization's name (or your own name)",
    description: "A description of the project",
    projecturl: "The URL of the repository or the website of the project"
  }

  export default {
    name: "LicenseTextEditor",
    props: {
      text: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const activeFields = computed(() => Object.keys(REPLACEMENT_LABELS).filter(name => props.text.includes(`[${name}]`)))
      const replacements = useLocalStorage("replacements", Object.fromEntries(Object.keys(REPLACEMENT_LABELS).map(name => [name, ""])), { listenToStorageChanges: false })

      const resultingText = computed(() => {
        let { text } = props

        Object.entries(replacements.value).forEach(([name, value]) => {
          if (value !== "") text = text.replaceAll(`[${name}]`, value)
        })

        return text.replaceAll("[year]", new Date().getFullYear().toString())
      })

      return {
        replacements,
        activeFields,
        resultingText,
        replacementLabels: REPLACEMENT_LABELS,
        copyToClipboard() {
          navigator.clipboard.writeText(resultingText.value)
        }
      }
    }
  }
</script>
