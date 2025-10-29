<template>
  <div class="mb-3">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {{ label }}
    </label>

    <input
      v-if="type !== 'textarea' && type !== 'select'"
      :id="id"
      :type="type"
      v-model="modelValueLocal"
      :disabled="disabled"
      :placeholder="placeholder"
      class="[`mt-0.5 w-full px-2 py-2 lg:py-3 rounded border shadow-sm sm:text-sm transition-all duration-200
        text-slate-950 dark:text-white border-gray-300 dark:border-gray-600
        focus:ring-2 focus:ring-blue-400 focus:outline-none
        bg-gray-300 dark:bg-gray-900
        disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 disabled:cursor-not-allowed`,
        inputClass
      ]"
    />

    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      v-model="modelValueLocal"
      :disabled="disabled"
      :placeholder="placeholder"
      class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border shadow-sm sm:text-sm transition-all duration-200
        text-slate-950 dark:text-white border-gray-300 dark:border-gray-600
        focus:ring-2 focus:ring-blue-400 focus:outline-none
        bg-gray-300 dark:bg-gray-900
        disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
    ></textarea>

    <select
      v-else-if="type === 'select'"
      :id="id"
      v-model="modelValueLocal"
      :disabled="disabled"
      class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border shadow-sm sm:text-sm transition-all duration-200
        text-slate-950 dark:text-white border-gray-300 dark:border-gray-600
        focus:ring-2 focus:ring-blue-400 focus:outline-none
        bg-gray-300 dark:bg-gray-900
        disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      <option disabled value="">-- Pilih {{label}} --</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  id: String,
  placeholder: String,
  disabled: Boolean,
  options: { type: Array, default: () => [] },
  inputClass: { type: String, default: ''},
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>


<!-- <template>
  <div class="mb-3" :class="wrapperClass">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {{ label }}
    </label>

    <component
      :is="inputTag"
      :id="id"
      v-model="modelValueLocal"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        // default base style
        'mt-0.5 w-full px-2 py-2 lg:py-3 rounded border shadow-sm sm:text-sm transition-all duration-200',
        'text-slate-950 dark:text-white border-gray-300 dark:border-gray-600',
        'focus:ring-2 focus:ring-blue-400 focus:outline-none',
        'bg-gray-300 dark:bg-gray-900',
        'disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
        inputClass, // ✅ custom class dari parent
      ]"
      v-bind="isSelect ? { options } : {}"
    >
      <template v-if="isSelect">
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </template>
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  id: String,
  placeholder: String,
  disabled: Boolean,
  options: { type: Array, default: () => [] },
  inputClass: { type: String, default: '' }, // ✅ custom class untuk input
  wrapperClass: { type: String, default: '' }, // ✅ custom class untuk container
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isSelect = computed(() => props.type === 'select')
const inputTag = computed(() => {
  if (props.type === 'textarea') return 'textarea'
  if (props.type === 'select') return 'select'
  return 'input'
});
</script> -->
