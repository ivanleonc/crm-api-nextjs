<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Inicia sesión en tu CRM
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Correo electrónico </label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Asumiendo que guardaste el código del paso anterior en src/services/authService.js
import { authService } from '../services/authService'; 

const router = useRouter();

// Estados reactivos
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Función que se ejecuta al enviar el formulario
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = ''; // Limpiamos errores previos
    
    // Llamamos al servicio que se comunica con nuestro backend en Next.js
    await authService.login(email.value, password.value);
    
    // Si es exitoso, el servicio ya guardó el token. Solo nos queda redirigir.
    router.push('/');
    
  } catch (error) {
    // Si el backend responde con un 401 (Credenciales inválidas)
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error || 'Error al iniciar sesión';
    } else {
      errorMessage.value = 'No se pudo conectar con el servidor';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>