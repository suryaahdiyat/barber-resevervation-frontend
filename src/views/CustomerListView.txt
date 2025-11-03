<template>
  <div class="max-w-4xl mx-auto py-10">
    <div v-if="!loading && customers.length" class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-200">Daftar Pelanggan 💇‍♂️</h1>
      <button
        @click="openModal('add')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Tambah Customer
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500">Memuat data...</div>

    <!-- Error -->
    <div v-if="error" class="text-red-600 text-center">{{ error }}</div>

    <!-- Table -->
    <table v-if="!loading && customers.length" class="w-full border border-gray-200 rounded-lg">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="p-3 text-left">#</th>
          <th class="p-3 text-left">Nama</th>
          <th class="p-3 text-left">Email</th>
          <th class="p-3 text-left">Nomor Telepon</th>
          <th class="p-3 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(cust, index) in customers"
          :key="cust.id"
          class="border-t hover:bg-gray-700 transition"
        >
          <td class="p-3">{{ index + 1 }}</td>
          <td class="p-3">{{ cust.name }}</td>
          <td class="p-3">{{ cust.email }}</td>
          <td class="p-3">{{ cust.phone }}</td>
          <td class="p-3 text-center space-x-2">
            <button
              @click="openModal('edit', cust)"
              class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mr-2"
            >
              Edit
            </button>
            <button
              @click="hapusCustomer(cust.id)"
              class="text-red-600 hover:underline"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading" class="text-center text-gray-500">
      Tidak ada data pelanggan.
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/80 text-gray-500 bg-opacity-50 flex items-center justify-center"
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
            <label class="block text-sm font-medium">Email</label>
            <input
              v-model="form.email"
              type="email"
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '../stores/customerStore'

const store = useCustomerStore()
const { customers, loading, error } = storeToRefs(store)
// console.log(error)


const showModal = ref(false);
const modalType = ref("add");
const form = ref({ name: "", phone: "", email: "", password: "1234", role : "customer" });
const editId = ref(null);

const openModal = (type, customer = null) => {
  modalType.value = type;
  showModal.value = true;

  if (type === "edit" && customer) {
    editId.value = customer.id;
    form.value = { name: customer.name, phone: customer.phone, email: customer.email };
  } else {
    form.value = { name: "", phone: "", email: "", password: "1234", role : "customer"  };
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

onMounted(() => {
  store.fetchCustomers()
})


const hapusCustomer = async (id) => {
  if (confirm('Yakin ingin menghapus data ini?')) {
    await store.removeCustomer(id)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
};
</script>
