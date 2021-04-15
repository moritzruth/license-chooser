<template>
  <div class="space-x-2 md:space-x-5 flex flex-shrink-0 focus-within:ring-3 ring-offset-5 ring-offset-gray-50 dark:ring-offset-gray-900 dark:ring-blue-400 rounded-md">
    <label
      v-for="item in items"
      :key="item.value"
      class="flex flex-col items-center rounded-md"
    >
      <span class="flex w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-400 inline-flex items-center justify-center">
        <span class="w-4 h-4 transition duration-100 rounded-full" :class="modelValue === item.value ? 'bg-gray-600 dark:bg-gray-400' : ''"/>
      </span>
      <span class="mt-2">
        {{ item.label }}
      </span>
      <input
        class="absolute opacity-0"
        type="radio"
        :disabled="disabled"
        :name="groupName"
        :checked="item.value === modelValue"
        @change="$emit('update:modelValue', item.value)"
      >
    </label>
  </div>
</template>

<script>
  import { nanoid } from "nanoid/non-secure"

  export default {
    name: "RadioGroup",
    props: {
      modelValue: {
        type: null,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      disabled: Boolean
    },
    emits: ["update:modelValue"],
    setup() {
      return {
        groupName: nanoid()
      }
    }
  }
</script>
