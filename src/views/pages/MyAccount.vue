<template>
  <div class="p-2 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
    <!-- FORM USER -->
    <form v-if="!showPwForm" @submit.prevent="updateProfile" class="text-slate-100 mb-2 space-y-4">
      <CustomInput
        label="Nama"
        id="Nama"
        v-model="form.name"
        placeholder="Masukkan nama"
      />
      <div class="flex mb-2 justify-between items-center gap-4 w-full">
        <CustomInput
          label="Email"
          id="email"
          type="email"
          v-model="form.email"
          placeholder="Masukkan email"
        />
        <CustomInput
          label="No Telp"
          id="phone"
          v-model="form.phone"
          placeholder="Masukkan no telp"
        />
      </div>
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        Update
      </button>
    </form>
    <button
        @click="togglePwForm"
        class="mb-2 hover:cursor-pointer duration-75 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
      >
        {{ showPwForm ? "Tutup Password Form" : "Tampilkan Password Form" }}
      </button>
    <!-- FORM GANTI PASSWORD -->
    <form v-if="showPwForm" @submit.prevent="updatePassword" class="text-slate-100 space-y-4 mb-2">

      <CustomInput
        label="Password Lama"
        id="current_password"
        type="password"
        v-model="passwordForm.current_password"
        placeholder="Masukkan password lama"
        showToggle
      />

      <CustomInput
        label="Password Baru"
        id="new_password"
        type="password"
        v-model="passwordForm.new_password"
        placeholder="Masukkan password baru"
        showToggle
      />

      <CustomInput
        label="Konfirmasi Password Baru"
        id="confirm_password"
        type="password"
        v-model="passwordForm.confirm_password"
        placeholder="Ulangi password baru"
        showToggle
      />

      <button
        type="submit"
        class="bg-emerald-600 w-full py-2 rounded text-white hover:cursor-pointer duration-75"
      >
        Ganti Password
      </button>
    </form>

    <button
      @click="$router.back()"
      class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white px-3 py-1 rounded w-full"
    >
      Kembali
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import CustomInput from "@/components/CustomInput.vue";

const loading = ref(false);
const user = ref(null);
const showPwForm = ref(false);
const form = ref({ name: "", email: "", phone: ""});
const passwordForm = ref({ current_password: "", new_password: "", confirm_password: ""});
const editingId = ref(null);

const togglePwForm = () => {
  showPwForm.value = !showPwForm.value;
  if (!showPwForm.value) {
    passwordForm.value = { current_password: "", new_password: "", confirm_password: ""};
  }
}

const fetchUser = async () => {
  loading.value = true;
  const idTemp = 21;
  let endpoint = `/users/${idTemp}`;

  try {
    const res = await api.get(endpoint);
    // await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
    user.value = res.data;
    form.value = {
      name: user.value.name || "",
      email: user.value.email || "",
      phone: user.value.phone || ""
    }
    // console.log("Data user:", JSON.stringify(user.value, null, 2));
    editingId.value = user.value.id;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// CRUD
const updateProfile = async () => {
  const cleanForm = {
    ...form.value,
    email:
      form.value.email && form.value.email.trim() !== ""
        ? form.value.email.trim()
        : null,
    phone:
      form.value.phone && form.value.phone.trim() !== ""
        ? form.value.phone.trim()
        : null,
  };
  console.log("Data dikirim:", JSON.stringify(cleanForm, null, 2));
  try {
    if (editingId.value) {
      const res = await api.put(`/users/${editingId.value}`, cleanForm);
      toast.success("Berhasil mengedit pengguna!")
      console.log(res.data);
    } else {
      const res = await api.post("/users", cleanForm);
      toast.success("Berhasil membuat pengguna!")
      console.log(res.data);
    }
    form.value = { name: "", email: "", phone: ""};
    editingId.value = null;
    // showForm.value = false;
    fetchUser();
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";

    toast.error(message);
  }
};

const updatePassword = async () => {
  try {
    if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    console.log("Data dikirim:", passwordForm.value);

    await api.put("/users/password", {
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
      confirm_password: passwordForm.value.confirm_password,
      id: editingId.value
    });

    toast.success("Berhasil merubah password!")

    passwordForm.current_password = "";
    passwordForm.new_password = "";
    passwordForm.confirm_password = "";
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";

    toast.error(message);
  }
};


// const editUser = (user) => {
//   form.value = { name: user.name, email: user.email, phone: user.phone, role: user.role };
//   editingId.value = user.id;
//   showForm.value = true;
// };

// const deleteUser = async (id) => {
//   if (!confirm("Yakin ingin hapus user ini?")) return;
//   try {
//     await api.delete(`/users/${id}`);
//     fetchUsers();
//     toast.success("Berhasil menghapus pengguna!")
//   } catch (err) {
//     console.error(err);
//       const message =
//       err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
//       err.message || // pesan dari axios sendiri (misal timeout)
//       "Terjadi kesalahan saat menghapus data."; // fallback pesan default

//     toast.error(message);
//   }
// };

onMounted(fetchUser);
</script>