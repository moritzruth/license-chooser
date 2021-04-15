<template>
  <div class="bg-white rounded-md shadow-md p-5 pb-4 group relative">
    <div class="absolute top-4 right-4 text-xl text-green-400 flex">
      <HasTooltip v-if="license.isOsiApproved" content="The license is OSI approved.">
        <CheckCircleOutlineIcon/>
      </HasTooltip>
      <HasTooltip v-if="license.isFsfLibre" content="The license complies with the definition of free software by the Free Software Foundation.">
        <CheckCircleIcon/>
      </HasTooltip>
    </div>
    <div class="font-bold mb-2 pr-12">
      <span class="font-mono mr-1 text-gray-500">{{ license.id }}</span>
      {{ license.title }}
    </div>
    <p class="line-clamp-2 mb-3">
      {{ license.description }}
    </p>
    <BadgesBag badge-class="bg-blue-200 text-blue-600" :items="license.permissions.map(item => permissionBadges[item])"/>
    <BadgesBag badge-class="bg-yellow-200 text-yellow-600" :items="license.conditions.map(item => conditionBadges[item])"/>
    <BadgesBag badge-class="bg-red-100 text-red-600" :items="license.limitations.map(item => limitationBadges[item])"/>
    <div class="overflow-y-hidden transition-all duration-200 flex justify-end sm:absolute right-5 bottom-4">
      <button class="py-2 px-4 mt-2 bg-gray-200 rounded-md -md:w-full" @click="openModal()">
        More information
      </button>
    </div>
  </div>
</template>

<script>
  import CheckCircleOutlineIcon from "virtual:vite-icons/mdi/check-circle-outline"
  import CheckCircleIcon from "virtual:vite-icons/mdi/check-circle"
  import { inject } from "vue"
  import { permissionBadges, conditionBadges, limitationBadges } from "../assets/attributeBadgeMapping.js"
  import BadgesBag from "./BadgesBag.vue"
  import HasTooltip from "./HasTooltip.vue"

  export default {
    name: "LicenseCard",
    components: { HasTooltip, BadgesBag, CheckCircleIcon, CheckCircleOutlineIcon },
    props: {
      license: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const modalLicense = inject("modalLicense")

      return {
        permissionBadges,
        conditionBadges,
        limitationBadges,
        openModal() {
          modalLicense.value = props.license
        }
      }
    }
  }
</script>
