<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
</script>
