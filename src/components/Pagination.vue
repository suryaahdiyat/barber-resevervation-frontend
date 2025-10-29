<template>
  <div
    v-if="totalPages > 1"
    class="flex my-2 justify-between items-center space-x-2 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto text-slate-950"
  >
    <button
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer duration-75"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      Prev
    </button>

    <span class="dark:text-slate-100 text-slate-950">
      Halaman {{ currentPage }} dari {{ totalPages }}
    </span>

    <button
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer duration-75"
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

defineEmits(["change-page"]);
</script>
