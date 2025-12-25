/**
 * ============================================
 * SICMA CALCULATOR - APP ENTRY POINT
 * ============================================
 */

// Estado global de la app
window.appState = {
  screen: 'home', // 'home', 'calculator', 'history', 'packages'
  currentQuote: null
};

// Función global para navegar entre pantallas
window.navigateTo = (screen) => {
  console.log(`📱 Navegando a: ${screen}`);
  window.appState.screen = screen;
  renderApp();
};

// Función para renderizar la app
function renderApp() {
  const root = document.getElementById('root');
  const screen = window.appState.screen;
  
  // Renderizar según la pantalla actual
  if (screen === 'home') {
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

// Esperar a que todo esté cargado
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando SICMA...');
  
  // Verificar autenticación
  const { authenticated, user } = await window.supabaseClient.checkAuth();
  
  if (!authenticated) {
    console.log('⚠️ Usuario no autenticado - continuando de todas formas');
  } else {
    console.log('✅ Usuario autenticado:', user.email);
  }
  
  // Renderizar la aplicación por primera vez
  renderApp();
});

console.log('✅ App initialized');