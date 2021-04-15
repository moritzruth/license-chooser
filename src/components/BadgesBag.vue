<template>
  <div class="flex flex-wrap items-start justify-start">
    <HasTooltip
      v-for="item in items"
      :key="item"
      class="px-2 py-1 rounded-md mr-2 mb-2 text-sm outline-none focus-visible:outline-black dark:focus-visible:outline-white font-mono"
      :class="badgeClass"
      allow-html
      :content="item[1]"
      tabindex="0"
    >
      {{ item[0] }}
    </HasTooltip>
  </div>
</template>

<script>
  import HasTooltip from "./HasTooltip.vue"

  export default {
    name: "BadgesBag",
    components: { HasTooltip },
    props: {
      badgeClass: {
        type: String,
        default: ""
      },
      items: {
        type: Array,
        required: true
      }
    }
  }
</script>
