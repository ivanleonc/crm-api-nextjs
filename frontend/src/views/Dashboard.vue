<template>
  <div class="flex h-screen bg-gray-100">

    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-700">
        <span class="font-bold text-xl tracking-wider">CRM PRO</span>
      </div>
<nav class="mt-5 px-2">
  <router-link to="/dashboard" class="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition ease-in-out duration-150">
    👥 Clientes
  </router-link>
  
  <router-link to="/users" class="group flex items-center px-2 py-2 mt-1 text-base leading-6 font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition ease-in-out duration-150">
    ⚙️ Usuarios y Roles
  </router-link>
</nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">

      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-800">Directorio de Clientes</h1>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-600">Hola, {{ user?.first_name || 'Usuario' }}</span>
          <button @click="handleLogout"
            class="text-sm px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="w-1/3">
              <input v-model="searchQuery" @input="handleSearch" type="text"
                placeholder="Buscar por nombre, empresa o email..."
                class="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <button @click="openModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
              + Nuevo Cliente
            </button>
          </div>

          <div v-if="isLoading" class="p-8 text-center text-gray-500">
            Cargando clientes...
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="customers.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron clientes.
                  </td>
                </tr>
                <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ customer.first_name }} {{ customer.last_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ customer.company || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ customer.email }}</div>
                    <div class="text-sm text-gray-500">{{ customer.phone || 'Sin teléfono' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                    ]">
                      {{ customer.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="openEditModal(customer)"
                      class="text-blue-600 hover:text-blue-900 mr-4 transition-colors">
                      Editar
                    </button>
                    <button @click="confirmDelete(customer.id)"
                      class="text-red-600 hover:text-red-900 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando página <span class="font-medium">{{ pagination.current_page }}</span> de <span
                    class="font-medium">{{ pagination.total_pages }}</span>
                  (Total: {{ pagination.total_records }} registros)
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                  </button>
                  <button @click="changePage(pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.total_pages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>

        </div>
        <div v-if="isModalOpen" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
          aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"
              aria-hidden="true"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form @submit.prevent="saveCustomer">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                    {{ isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente' }}
                  </h3>

                  <div v-if="formError"
                    class="mb-4 bg-red-50 p-3 rounded-md border-l-4 border-red-500 text-sm text-red-700">
                    {{ formError }}
                  </div>

                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                        <input v-model="customerForm.first_name" type="text" required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Apellido *</label>
                        <input v-model="customerForm.last_name" type="text" required
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                      <input v-model="customerForm.email" type="email"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                      <input v-model="customerForm.phone" type="text"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Empresa</label>
                      <input v-model="customerForm.company" type="text"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" :disabled="isSaving"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    {{ isSaving ? 'Guardando...' : 'Guardar Cliente' }}
                  </button>
                  <button type="button" @click="closeModal" :disabled="isSaving"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { customerService } from '../services/customerService';

const router = useRouter();
const user = ref(null);

// Variables reactivas para la tabla
const customers = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_records: 0
});

// Timer para el buscador (Debounce)
let searchTimer = null;

// Cargar clientes desde el backend
const fetchCustomers = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await customerService.getCustomers(page, 10, searchQuery.value);
    customers.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    // Si da error 401 o 403, el interceptor de Axios (que creamos antes) ya se encargará de mandarnos al login
  } finally {
    isLoading.value = false;
  }
};

// Se ejecuta cada vez que el usuario teclea algo en el buscador
const handleSearch = () => {
  clearTimeout(searchTimer);
  // Esperamos 500ms después de que dejó de escribir para hacer la petición
  searchTimer = setTimeout(() => {
    fetchCustomers(1); // Siempre que buscamos, volvemos a la página 1
  }, 500);
};

// Cambiar de página
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.total_pages) {
    fetchCustomers(newPage);
  }
};

// --- NUEVAS VARIABLES PARA EL MODAL ---
const isModalOpen = ref(false);
const isSaving = ref(false);
const formError = ref('');
const isEditMode = ref(false);
const currentCustomerId = ref(null);

// Objeto que almacena los datos del formulario
const customerForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: ''
});

// --- NUEVAS FUNCIONES PARA EL MODAL ---
const openModal = () => {
  isEditMode.value = false;
  currentCustomerId.value = null;
  customerForm.value = { first_name: '', last_name: '', email: '', phone: '', company: '' };
  isModalOpen.value = true;
};

const openEditModal = (customer) => {
  isEditMode.value = true;
  currentCustomerId.value = customer.id;
  // Llenamos el formulario con los datos actuales del cliente
  customerForm.value = {
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email || '',
    phone: customer.phone || '',
    company: customer.company || '',
    status: customer.status // Podemos añadir el estado también si queremos
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  formError.value = '';
  // Limpiamos el formulario para la próxima vez
  customerForm.value = { first_name: '', last_name: '', email: '', phone: '', company: '' };
};

const saveCustomer = async () => {
  try {
    isSaving.value = true;
    formError.value = '';
    
    if (isEditMode.value) {
      // Si estamos editando, usamos el método PUT
      await customerService.updateCustomer(currentCustomerId.value, customerForm.value);
    } else {
      // Si estamos creando, usamos el método POST
      await customerService.createCustomer(customerForm.value);
    }
    
    closeModal();
    fetchCustomers(pagination.value.current_page); // Recargamos en la misma página
    
  } catch (error) {
    if (error.response?.data?.error) {
      formError.value = error.response.data.error;
    } else {
      formError.value = 'Ocurrió un error al guardar el cliente.';
    }
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (id) => {
  // Mostramos una alerta nativa del navegador para confirmar
  if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
    try {
      await customerService.deleteCustomer(id);
      fetchCustomers(pagination.value.current_page); // Recargar la tabla
    } catch (error) {
      alert('Error al eliminar el cliente');
      console.error(error);
    }
  }
};

// Lógica de autenticación inicial
onMounted(() => {
  user.value = authService.getCurrentUser();
  fetchCustomers(); // Cargamos la tabla apenas entra
});

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>