<template>
  <SWUpdateNotification/>
  <main class="max-w-5xl px-6 mx-auto py-10 sm:py-15">
    <h1 class="font-bold text-4xl sm:text-5xl mb-5 md:mb-8">Open-Source License Chooser</h1>
    <p class="italic mb-10">
      As I am not a lawyer, this is not legal advice. Consult with a professional if you are doing something serious.
    </p>
    <div class="flex flex-col space-y-10">
      <div class="flex-grow">
        <div class="flex -md:flex-col md:justify-between">
          <h2 class="font-bold text-2xl mb-2">
            Questions
          </h2>
          <div class="-sm:space-y-4 -md:mb-8 sm:space-x-5">
            <button
              class="py-2 px-4 mt-2 bg-blue-300 dark:bg-blue-600 rounded-md text-base font-bold shadow-lg -sm:w-full"
              @click="showAllLicenses()"
            >
              Just show me all licenses
            </button>
            <button
              class="py-2 px-4 mt-2 bg-red-300 dark:bg-red-500 rounded-md font-bold shadow-lg transition duration-200 -sm:w-full
                     disabled:shadow-sm disabled:opacity-70 disabled:cursor-default"
              :disabled="!answersNotDefault"
              @click="resetAnswers()"
            >
              Reset answers
            </button>
          </div>
        </div>
        <QuestionsForm/>
      </div>
      <div class="flex-grow">
        <div v-if="displayedLicenses === null" class="font-bold text-2xl">
          Licenses are loading ...
        </div>
        <transition-group
          v-else
          name="licenses-list"
          tag="div"
          class="flex flex-col"
        >
          <template
            v-for="license in displayedLicenses"
          >
            <!-- eslint-disable-next-line vue/require-v-for-key -->
            <div v-if="license === 'MATCHING'" key="MATCHING">
              <h2 ref="matchingHeadingElement" class="font-bold text-2xl transition-all duration-500 w-full">
                Matching licenses ({{ matchingLicenses.length }})
              </h2>
              <p class="text-lg font-bold dark:text-yellow-400 mt-3">
                Tip: Use <kbd>Ctrl</kbd>+<kbd>F</kbd> to search.
              </p>
            </div>
            <!-- eslint-disable-next-line vue/require-v-for-key -->
            <h2 v-else-if="license === 'REMAINING'" key="REMAINING" class="font-bold text-2xl transition-all duration-500 mt-14 w-full opacity-60">
              Remaining licenses ({{ remainingLicenses.length }})
            </h2>
            <LicenseCard
              v-else
              :key="license.id"
              class="transition-all duration-500 not-first:mt-6"
              :class="remainingLicenses.includes(license) ? 'opacity-60' : ''"
              :license="license"
            />
          </template>
        </transition-group>
      </div>
    </div>
  </main>
  <button
    class="fixed bottom-4 -md:opacity-90 right-4 md:bottom-20 md:right-20 rounded-xl px-4 py-2 shadow-lg font-bold font-mono transition-all duration-200 transform
           focus:outline-none focus-visible:ring-2 ring-offset-2"
    :class="counterClasses"
    :disabled="matchingLicenses?.length === 0"
    @click="scrollToMatching()"
  >
    {{ matchingLicenses?.length }} match{{ matchingLicenses?.length === 1 ? "" : "es" }}
  </button>
  <LicenseModal :license="modalLicense" @close="modalLicense = null"/>
  <footer class="max-w-5xl mx-auto flex items-center justify-center space-y-2 flex-col py-10 px-5 text-center">
    <div>
      A project by <a href="https://moritzruth.de">Moritz Ruth</a> (<a href="https://github.com/">Source Code</a>)
    </div>
    <div>
      The content of this site is licensed under the
      <a class="whitespace-nowrap" rel="license" href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a> license.<br>
      It is based on <a href="https://github.com/github/choosealicense.com">choosealicense.com by GitHub</a>
      and <a href="https://github.com/spdx/license-list-data">license-list-data by SPDX</a>
      which are licensed under the <a class="whitespace-nowrap" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> license.
    </div>
    <a href="https://moritzruth.de/impressum" target="_blank" rel="noreferrer noopener">Impressum</a>
  </footer>
</template>

<style>
  a {
    @apply text-blue-500 dark:text-blue-400 no-underline font-bold;
  }

  button:disabled {
    @apply cursor-default;
  }

  .licenses-list-leave-active {
    position: absolute;
  }
</style>

<script>
  import { ref, reactive, computed, provide } from "vue"
  import { difference } from "lodash-es"
  import striptags from "striptags"
  import { useEventListener } from "@vueuse/core"
  import snarkdown from "snarkdown"
  import LicenseCard from "./components/LicenseCard.vue"
  import LicenseModal from "./components/LicenseModal.vue"
  import QuestionsForm from "./components/QuestionsForm.vue"
  import SWUpdateNotification from "./components/SWUpdateNotification.vue"

  function useLicenses() {
    const licenses = ref(null)
    const licensesJson = localStorage.getItem("licenses")

    if (licensesJson === null) {
      fetch("https://license-data.moritzruth.de/licenses.full.json").then(response => response.json())
        .then(data => {
          licenses.value = data.map(license => ({
            ...license,
            description: striptags(license.description),
            note: license.note === undefined ? undefined : snarkdown(license.note)
          }))

          localStorage.setItem("licenses", JSON.stringify(licenses.value))
        })
    } else {
      licenses.value = JSON.parse(licensesJson)
    }

    return {
      licenses
    }
  }

  function useAnswers() {
    const answers = reactive({})
    provide("answers", answers)

    const resetAnswers = () => {
      answers.general = {}
      answers.conditions = {}
      answers.limitations = {}
    }

    resetAnswers()

    const answersNotDefault = computed(() => Object.keys(answers.general).length + Object.keys(answers.conditions).length + Object.keys(answers.limitations).length > 0)

    return {
      answers,
      answersNotDefault,
      resetAnswers
    }
  }

  function useFilteredLicenses(licenses, answers) {
    const matchingLicenses = computed(() => licenses.value?.filter(license => (
      (answers.general.osiApproved === undefined || (answers.general.osiApproved === license.isOsiApproved)) &&
      (answers.general.fsfLibre === undefined || (answers.general.fsfLibre === license.isFsfLibre)) &&
      (answers.general.patentUseAllowed === undefined || (answers.general.patentUseAllowed === license.permissions.includes("patent-use"))) &&
      (answers.general.patentUseDisallowed === undefined || (answers.general.patentUseDisallowed === license.limitations.includes("patent-use"))) &&
      (answers.conditions.includeLicenseAlways === undefined || (answers.conditions.includeLicenseAlways === license.conditions.includes("include-copyright"))) &&
      (answers.conditions.includeLicenseSource === undefined || (answers.conditions.includeLicenseSource === license.conditions.includes("include-copyright--source"))) &&
      (answers.conditions.documentChanges === undefined || (answers.conditions.documentChanges === license.conditions.includes("document-changes"))) &&
      (answers.conditions.discloseSource === undefined || (answers.conditions.discloseSource === license.conditions.includes("disclose-source"))) &&
      (answers.conditions.discloseSourceNetwork === undefined || (answers.conditions.discloseSourceNetwork === license.conditions.includes("network-use-disclose"))) &&
      (answers.conditions.sameLicense === undefined || (answers.conditions.sameLicense === license.conditions.includes("same-license"))) &&
      (answers.conditions.sameLicenseFile === undefined || (answers.conditions.sameLicenseFile === license.conditions.includes("same-license--file"))) &&
      (answers.conditions.sameLicenseLibrary === undefined || (answers.conditions.sameLicenseLibrary === license.conditions.includes("same-license--library"))) &&
      (answers.limitations.trademarkUse === undefined || (answers.limitations.trademarkUse === license.limitations.includes("trademark-use"))) &&
      (answers.limitations.liability === undefined || (answers.limitations.liability === license.limitations.includes("liability"))) &&
      (answers.limitations.warranty === undefined || (answers.limitations.warranty === license.limitations.includes("warranty")))
    )))

    const remainingLicenses = computed(() => licenses.value === null ? null : difference(licenses.value, matchingLicenses.value))

    return {
      matchingLicenses,
      remainingLicenses
    }
  }

  export default {
    name: "App",
    components: { SWUpdateNotification, QuestionsForm, LicenseModal, LicenseCard },
    setup() {
      const matchingHeadingElement = ref(null)

      const { licenses } = useLicenses()
      const { answers, resetAnswers, answersNotDefault } = useAnswers()
      const { remainingLicenses, matchingLicenses } = useFilteredLicenses(licenses, answers)

      useEventListener("beforeunload", event => {
        if (answersNotDefault.value) {
          event.preventDefault()
          event.returnValue = ""
        }
      })

      const modalLicense = ref(null)
      provide("modalLicense", modalLicense)

      return {
        matchingHeadingElement,
        answersNotDefault,
        resetAnswers,
        matchingLicenses,
        remainingLicenses,
        modalLicense,
        displayedLicenses: computed(() => matchingLicenses.value === undefined ? null : ["MATCHING", ...matchingLicenses.value, "REMAINING", ...remainingLicenses.value]),
        counterClasses: computed(() => {
          if (answersNotDefault.value) {
            if (matchingLicenses.value !== undefined && matchingLicenses.value.length === 0) return "bg-red-200 dark:bg-red-500 animate-bounce text-2xl"
            return "bg-green-300 text-green-900 text-lg"
          }

          return "opacity-0 scale-0"
        }),
        showAllLicenses() {
          resetAnswers()
          matchingHeadingElement.value.scrollIntoView({ behavior: "smooth" })
        },
        scrollToMatching() {
          matchingHeadingElement.value.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }
</script>
