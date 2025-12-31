/**
 * ============================================
 * SICMA CALCULATOR - APP ENTRY POINT
 * Con autenticación y whitelist de usuarios
 * ============================================
 */

// Estado global de la app
window.appState = {
  screen: 'loading', // 'loading', 'login', 'unauthorized', 'home', 'calculator', 'history', 'packages'
  currentQuote: null,
  user: null,
  isAuthorized: false
};

// Función global para navegar entre pantallas
window.navigateTo = (screen) => {
  console.log(`📱 Navegando a: ${screen}`);
  window.appState.screen = screen;
  renderApp();
};

// Función para cerrar sesión
window.logout = async () => {
  try {
    await window.supabaseClient.client.auth.signOut();
    window.appState.user = null;
    window.appState.isAuthorized = false;
    window.appState.screen = 'login';
    renderApp();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

// Función para iniciar sesión con Google
window.loginWithGoogle = async () => {
  try {
    const { error } = await window.supabaseClient.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error login Google:', error);
    alert('Error al iniciar sesión: ' + error.message);
  }
};

// Pantalla de Login
function LoginScreen() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="text-7xl mb-4">⚙️</div>
          <h1 class="text-3xl font-black text-white mb-2">SICMA Pro</h1>
          <p class="text-zinc-400">Calculadora Profesional 3D</p>
        </div>
        
        <div class="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
          <h2 class="text-lg font-bold text-white mb-4 text-center">🔐 Acceso Restringido</h2>
          <p class="text-sm text-zinc-400 mb-6 text-center">Solo usuarios autorizados pueden acceder</p>
          
          <button 
            onclick="loginWithGoogle()"
            class="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-bold py-3 px-4 rounded-xl hover:bg-zinc-100 transition shadow-lg"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>
        
        <p class="text-xs text-zinc-600 text-center mt-6">
          © 2024 SICMA Pro - Geek Worldland
        </p>
      </div>
    </div>
  `;
}

// Pantalla de Acceso Denegado
function UnauthorizedScreen(email) {
  return `
    <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 flex items-center justify-center p-6">
      <div class="w-full max-w-sm text-center">
        <div class="text-7xl mb-4">🚫</div>
        <h1 class="text-2xl font-black text-white mb-2">Acceso Denegado</h1>
        <p class="text-zinc-400 mb-4">Tu cuenta no está autorizada</p>
        
        <div class="bg-zinc-900 rounded-xl border border-red-500/30 p-4 mb-6">
          <p class="text-sm text-zinc-500 mb-1">Sesión iniciada como:</p>
          <p class="text-white font-mono text-sm truncate">${email || 'Usuario desconocido'}</p>
        </div>
        
        <p class="text-xs text-zinc-500 mb-6">
          Contacta al administrador si crees que deberías tener acceso.
        </p>
        
        <button 
          onclick="logout()"
          class="w-full py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-700 transition"
        >
          ← Cerrar Sesión
        </button>
      </div>
    </div>
  `;
}

// Función para renderizar la app
function renderApp() {
  const root = document.getElementById('root');
  const screen = window.appState.screen;

  if (screen === 'loading') {
    root.innerHTML = `
      <div class="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-4">⚙️</div>
          <div class="text-xl text-cyan-400 font-bold mb-2">Verificando acceso...</div>
          <div class="loading"></div>
        </div>
      </div>
    `;
  } else if (screen === 'login') {
    root.innerHTML = LoginScreen();
  } else if (screen === 'unauthorized') {
    root.innerHTML = UnauthorizedScreen(window.appState.user?.email);
  } else if (screen === 'home') {
    root.innerHTML = window.Components.HomeScreen();
  } else if (screen === 'calculator') {
    root.innerHTML = window.Components.Calculator();
  } else if (screen === 'history') {
    root.innerHTML = window.Components.History();
  } else if (screen === 'packages') {
    root.innerHTML = window.Components.PackageCalculator();
  }

  console.log(`📱 Pantalla renderizada: ${screen}`);
}

// Verificar si el usuario está autorizado
function isUserAuthorized(userId) {
  const { AUTHORIZED_USERS } = window.SICMA_CONSTANTS;
  return AUTHORIZED_USERS.includes(userId);
}

// Inicializar autenticación
async function initAuth() {
  console.log('🔐 Verificando autenticación...');

  try {
    const { data: { user }, error } = await window.supabaseClient.client.auth.getUser();

    if (error || !user) {
      console.log('⚠️ No hay sesión activa');
      window.appState.screen = 'login';
      renderApp();
      return;
    }

    console.log('👤 Usuario encontrado:', user.email);
    window.appState.user = user;

    // Verificar si está en la whitelist
    if (isUserAuthorized(user.id)) {
      console.log('✅ Usuario AUTORIZADO');
      window.appState.isAuthorized = true;
      window.appState.screen = 'home';
    } else {
      console.log('🚫 Usuario NO AUTORIZADO');
      window.appState.isAuthorized = false;
      window.appState.screen = 'unauthorized';
    }

    renderApp();

  } catch (error) {
    console.error('Error verificando auth:', error);
    window.appState.screen = 'login';
    renderApp();
  }
}

// Escuchar cambios de autenticación
window.supabaseClient.client.auth.onAuthStateChange((event, session) => {
  console.log('🔔 Auth event:', event);

  if (event === 'SIGNED_IN' && session?.user) {
    const user = session.user;
    window.appState.user = user;

    if (isUserAuthorized(user.id)) {
      console.log('✅ Login exitoso - Usuario autorizado');
      window.appState.isAuthorized = true;
      window.appState.screen = 'home';
    } else {
      console.log('🚫 Login exitoso - Usuario NO autorizado');
      window.appState.isAuthorized = false;
      window.appState.screen = 'unauthorized';
    }
    renderApp();
  } else if (event === 'SIGNED_OUT') {
    window.appState.user = null;
    window.appState.isAuthorized = false;
    window.appState.screen = 'login';
    renderApp();
  }
});

// Esperar a que todo esté cargado
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando SICMA...');
  renderApp(); // Mostrar loading
  initAuth();  // Verificar autenticación
});

console.log('✅ App initialized with auth');