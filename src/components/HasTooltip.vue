<template>
  <div>
    <slot/>
  </div>
</template>

<script>
  import tippy from "tippy.js"
  import "tippy.js/dist/tippy.css"

  export default {
    name: "HasTooltip",
    props: {
      content: {
        type: String,
        required: true
      },
      allowHtml: Boolean
    },
    data: () => ({
      tippyInstance: null
    }),
    mounted() {
      tippy(this.$el, {
        content: this.content,
        allowHTML: this.allowHtml,
        hideOnClick: false
      })
    },
    beforeUnmount() {
      this.tippyInstance?.destroy()
    }
  }
</script>
