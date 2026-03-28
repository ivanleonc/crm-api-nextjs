<template>
  <div class="min-h-screen bg-gray-100 flex">
    <div class="flex-1 p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button 
          @click="openModal" 
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          + Nuevo Usuario
        </button>
      </div>

      <div class="mb-4">
        <input 
          v-model="search" 
          @input="handleSearch"
          type="text" 
          placeholder="Buscar por nombre o correo..." 
          class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol(es)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ user.roles || 'Sin rol' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ user.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No se encontraron usuarios.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-if="isModalOpen" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveUser">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                  Registrar Nuevo Usuario
                </h3>
                
                <div v-if="formError" class="mb-4 bg-red-50 p-3 rounded-md border-l-4 border-red-500 text-sm text-red-700">
                  {{ formError }}
                </div>

                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                      <input v-model="userForm.first_name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Apellido *</label>
                      <input v-model="userForm.last_name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
                    <input v-model="userForm.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contraseña *</label>
                    <input v-model="userForm.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Rol Asignado *</label>
                    <select v-model="userForm.role_id" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="" disabled>Seleccione un rol...</option>
                      <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.name }} - {{ role.description }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" :disabled="isSaving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  {{ isSaving ? 'Guardando...' : 'Crear Usuario' }}
                </button>
                <button type="button" @click="closeModal" :disabled="isSaving" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userService } from '../services/userService';

const users = ref([]);
const roles = ref([]); // Guardaremos los roles aquí
const search = ref('');
let searchTimeout = null;

// Variables del Modal
const isModalOpen = ref(false);
const isSaving = ref(false);
const formError = ref('');

const userForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role_id: ''
});

// Cargar Usuarios
const fetchUsers = async () => {
  try {
    const response = await userService.getUsers(search.value);
    users.value = response.data;
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
};

// Cargar Roles para el select
const fetchRoles = async () => {
  try {
    const response = await userService.getRoles();
    roles.value = response.data;
  } catch (error) {
    console.error("Error al cargar los roles:", error);
  }
};

// Búsqueda
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchUsers(), 500);
};

// Control del Modal
const openModal = () => {
  formError.value = '';
  userForm.value = { first_name: '', last_name: '', email: '', password: '', role_id: '' };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Guardar Usuario
const saveUser = async () => {
  try {
    isSaving.value = true;
    formError.value = '';
    
    await userService.createUser(userForm.value);
    
    closeModal();
    fetchUsers(); // Recargamos la tabla
    
  } catch (error) {
    if (error.response?.data?.error) {
      formError.value = error.response.data.error;
    } else {
      formError.value = 'Ocurrió un error al crear el usuario.';
    }
  } finally {
    isSaving.value = false;
  }
};

// Al montar el componente, cargamos tanto usuarios como roles
onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>