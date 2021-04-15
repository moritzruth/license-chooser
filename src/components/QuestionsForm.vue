<template>
  <div class="flex flex-col space-y-10">
    <section
      v-for="(section, sectionId) in sections"
      :key="sectionId"
    >
      <div class="font-mono text-xl underline rounded-md px-2 py-1 inline-block" :class="section.colorClass">
        {{ section.title }}
      </div>
      <p class="text-lg text-blue-500 mt-4 mb-5">
        {{ section.text }}
      </p>
      <div class="flex flex-col space-y-10">
        <QuestionsFormQuestion
          v-for="(question, id) in section.questions"
          :id="id"
          :key="id"
          :question="question"
          :question-id="id"
          :section-id="sectionId"
        />
      </div>
    </section>
  </div>
</template>

<script>
  import { inject, computed } from "vue"
  import { QUESTIONS_FORM_SECTIONS } from "../assets/questions.js"
  import QuestionsFormQuestion from "./QuestionsFormQuestion.vue"

  export default {
    name: "QuestionsForm",
    components: { QuestionsFormQuestion },
    setup() {
      const answers = inject("answers")

      return {
        sections: QUESTIONS_FORM_SECTIONS,
        handleRadioUpdate(sectionId, questionKey, value) {
          if (value === "yes") answers[sectionId][questionKey] = true
          else if (value === "no") answers[sectionId][questionKey] = false
          else delete answers[sectionId][questionKey]
        },
        getRadioValue(sectionId, questionKey) {
          return computed(() => {
            const value = answers[sectionId][questionKey]

            if (value === true) return "yes"
            else if (value === false) return "no"

            return ""
          })
        }
      }
    }
  }
</script>
