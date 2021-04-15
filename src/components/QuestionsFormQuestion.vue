<template>
  <div class="flex md:items-center -md:flex-col -md:space-y-3 transition duration-200 pb-5" :class="disabled ? 'pointer-events-none opacity-40' : ''">
    <div class="-md:mb-4">
      <div class="text-lg md:text-xl" v-html="question.label"/>
      <div v-if="question.description" class="text-base md:text-lg mt-2 text-gray-500 dark:text-gray-400">
        {{ question.description }}
      </div>
    </div>
    <div class="h-1px bg-gray-200 dark:bg-gray-700 flex-grow mx-8 -md:hidden"/>
    <div class="space-x-2 md:space-x-5 flex flex-shrink-0 mx-auto relative top-3" :class="question.requiredValue === undefined ? '' : 'opacity-60'">
      <RadioGroup
        :disabled="disabled"
        :items="radioItems"
        :model-value="value"
        @update:model-value="newValue => handleUpdate(newValue)"
      />
    </div>
  </div>
</template>

<script>
  import { inject, computed } from "vue"
  import RadioGroup from "./RadioGroup.vue"

  export default {
    name: "QuestionsFormQuestion",
    components: { RadioGroup },
    props: {
      question: {
        type: Object,
        required: true
      },
      questionId: {
        type: String,
        required: true
      },
      sectionId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const answers = inject("answers")

      return {
        disabled: computed(() => props.question.disableIfSet === undefined ? false : props.question.disableIfSet.some(key => (answers[props.sectionId][key] !== undefined))),
        radioItems: [
          {
            value: "yes",
            label: "Yes"
          },
          {
            value: "",
            label: "I don’t care"
          },
          {
            value: "no",
            label: "No"
          }
        ],
        value: computed(() => {
          const value = answers[props.sectionId][props.questionId]

          if (value === true) return "yes"
          else if (value === false) return "no"

          return ""
        }),
        handleUpdate(value) {
          if (value === "yes") answers[props.sectionId][props.questionId] = true
          else if (value === "no") answers[props.sectionId][props.questionId] = false
          else delete answers[props.sectionId][props.questionId]
        }
      }
    }
  }
</script>
