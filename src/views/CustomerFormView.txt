<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Daftar Customer</h1>
      <button
        @click="openModal('add')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Tambah Customer
      </button>
    </div>

    <!-- Tabel -->
    <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Nama</th>
          <th class="p-2 border">Telepon</th>
          <th class="p-2 border">Tanggal Dibuat</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in customers" :key="c.id" class="text-center">
          <td class="border p-2">{{ c.id }}</td>
          <td class="border p-2">{{ c.name }}</td>
          <td class="border p-2">{{ c.phone }}</td>
          <td class="border p-2">{{ formatDate(c.createdAt) }}</td>
          <td class="border p-2">
            <button
              @click="openModal('edit', c)"
              class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mr-2"
            >
              Edit
            </button>
            <button
              @click="hapusCustomer(c.id)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 class="text-xl font-semibold mb-4">
          {{ modalType === 'add' ? 'Tambah Customer' : 'Edit Customer' }}
        </h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="block text-sm font-medium">Nama</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border rounded p-2 mt-1"
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium">Telepon</label>
            <input
              v-model="form.phone"
              type="text"
              required
              class="w-full border rounded p-2 mt-1"
            />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ modalType === 'add' ? 'Simpan' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCustomerStore } from "../stores/customerStore";

const store = useCustomerStore();
const { customers } = store;

const showModal = ref(false);
const modalType = ref("add");
const form = ref({ name: "", phone: "" });
const editId = ref(null);

const openModal = (type, customer = null) => {
  modalType.value = type;
  showModal.value = true;

  if (type === "edit" && customer) {
    editId.value = customer.id;
    form.value = { name: customer.name, phone: customer.phone };
  } else {
    form.value = { name: "", phone: "" };
  }
};

const closeModal = () => {
  showModal.value = false;
  editId.value = null;
};

const handleSubmit = async () => {
  if (modalType.value === "add") {
    await store.addCustomer(form.value);
  } else {
    await store.editCustomer(editId.value, form.value);
  }
  closeModal();
};

const hapusCustomer = async (id) => {
  if (confirm("Yakin ingin menghapus data ini?")) {
    await store.removeCustomer(id);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  store.fetchCustomers();
});
</script>
