/**
 * ============================================
 * SICMA CALCULATOR - COMPONENTS
 * ============================================
 */

// No redeclarar - usar directamente desde window
const getIcons = () => window.Icons;
const getFormatters = () => window.Formatters;

// ============================================
// HOME SCREEN
// ============================================

function HomeScreen() {
  const Icons = getIcons();

  return `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="bg-zinc-900 border-b border-zinc-800 p-4">
        <div class="max-w-md mx-auto">
          <h1 class="text-2xl font-bold text-cyan-400 tracking-wider">SICMA PRO</h1>
          <p class="text-xs text-zinc-500 font-mono">Calculadora 3D v2.0</p>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-5">
        <div class="max-w-md mx-auto space-y-6 animate-fade-in">
          
          <div class="text-center py-8">
            <div class="text-6xl mb-4">🎯</div>
            <h2 class="text-2xl font-bold text-white mb-2">Bienvenido</h2>
            <p class="text-zinc-400">Selecciona una opción para comenzar</p>
          </div>

          <div class="grid grid-cols-1 gap-4">
            
            <button 
              onclick="navigateTo('calculator')"
              class="bg-gradient-to-br from-cyan-600 to-cyan-500 p-6 rounded-2xl text-left shadow-lg hover:shadow-cyan-500/20 transition transform hover:scale-105 active:scale-95"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  ${Icons.Calculator(28)}
                </div>
                <span class="text-xs bg-white/20 px-2 py-1 rounded-full">PRINCIPAL</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-1">Nueva Cotización</h3>
              <p class="text-sm text-cyan-100 opacity-90">Calcula el precio de una impresión 3D</p>
            </button>

            <button 
              onclick="navigateTo('packages')"
              class="bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-2xl text-left shadow-lg hover:shadow-purple-500/20 transition transform hover:scale-105 active:scale-95"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  ${Icons.Layers(28)}
                </div>
                <span class="text-xs bg-white/20 px-2 py-1 rounded-full">NUEVO</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-1">Paquetes Múltiples</h3>
              <p class="text-sm text-purple-100 opacity-90">Combina varios productos en un paquete</p>
            </button>

            <button 
              onclick="navigateTo('history')"
              class="bg-gradient-to-br from-zinc-800 to-zinc-700 p-6 rounded-2xl text-left border border-zinc-600 shadow-lg hover:shadow-zinc-600/20 transition transform hover:scale-105 active:scale-95"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  ${Icons.Search(28)}
                </div>
              </div>
              <h3 class="text-xl font-bold text-white mb-1">Historial</h3>
              <p class="text-sm text-zinc-300 opacity-90">Ver cotizaciones y paquetes guardados</p>
            </button>

          </div>
        </div>
      </main>

      <footer class="p-4 text-center text-xs text-zinc-600">
        <p>SICMA Pro © 2024 - Calculadora Profesional 3D</p>
      </footer>
    </div>
  `;
}

// ============================================
// CALCULATOR - VERSIÓN CORREGIDA
// ============================================

function Calculator() {
  const Icons = getIcons();

  if (!window.calculatorState) {
    window.calculatorState = {
      step: 1,
      config: {
        kwhPrice: 920,
        printer: 'p1s',
        nozzle: 0.4,
        material: 'pla',
        materialCostPerKg: 85000,
        amsMode: false
      },
      print: {
        printHours: 0,
        materialCost: 0,
        coolMinutes: 18,
        isPiece: 'single',
        plateCount: 1
      },
      labor: {
        complexity: 'simple',
        primerToggle: false,
        lacquerToggle: false
      },
      logistics: {
        shipping: 'pickup',
        packagingType: 'box',
        packagingSize: 'small',
        packagingCustom: 0,
        additionalsToggle: false
      },
      pricing: {
        gateway: 'wompi', // Corregido: Wompi por defecto
        profitMargin: 30,
        additionalCharge: 0
      },
      results: null
    };
  }

  const state = window.calculatorState;
  const { PRINTERS, NOZZLES, MATERIALS, SHIPPING_OPTIONS, PACKAGING, COMPLEXITY_LEVELS, GATEWAYS } = window.SICMA_CONSTANTS;
  const { formatCurrency, formatHours, parseDecimalHours } = window.Formatters;

  // Helpers de actualización con persistencia de scroll
  window.updateConfig = (key, value) => {
    state.config[key] = value;
    if (key === 'material') {
      const material = MATERIALS.find(m => m.id === value);
      state.print.coolMinutes = material.coolMinutes;
    }
    renderCalculatorWithScroll();
  };

  window.updatePrint = (key, value) => {
    state.print[key] = value;
    renderCalculatorWithScroll();
  };

  window.updateLabor = (key, value) => {
    state.labor[key] = value;
    renderCalculatorWithScroll();
  };

  window.updateLogistics = (key, value) => {
    state.logistics[key] = value;
    renderCalculatorWithScroll();
  };

  window.updatePricing = (key, value) => {
    state.pricing[key] = value;
    renderCalculatorWithScroll();
  };

  window.nextStep = () => {
    if (state.step === 5) {
      state.results = window.Calculations.calculateQuote(state);
      state.step = 6;
    } else if (state.step < 6) {
      state.step++;
    }
    renderCalculator(); // Cambio de paso resetea scroll por diseño
  };

  window.prevStep = () => {
    if (state.step > 1) {
      state.step--;
      renderCalculator();
    }
  };

  const getProgress = () => (state.step / 6) * 100;

  let content = '';

  if (state.step === 1) {
    const selectedPrinter = PRINTERS.find(p => p.id === state.config.printer);
    const selectedNozzle = NOZZLES.find(n => n.size === state.config.nozzle);

    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">⚙️ Configuración</h2>
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2">Impresora</label>
          <select
            onchange="updateConfig('printer', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold"
          >
            ${PRINTERS.map(p => `<option value="${p.id}" ${state.config.printer === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2">Material</label>
          <select
            onchange="updateConfig('material', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold"
          >
            ${MATERIALS.map(m => `<option value="${m.id}" ${state.config.material === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }

  else if (state.step === 2) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">⏱️ Datos de Impresión</h2>
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-4 flex items-center gap-2">${Icons.Clock()} Tiempo (Bambu Studio)</label>
          <div class="bg-zinc-800 rounded-xl p-6 text-center">
            <input
              type="number"
              step="0.01"
              value="${state.print.printHours || ''}"
              oninput="updatePrint('printHours', parseFloat(this.value) || 0)" 
              class="w-full bg-transparent text-center text-5xl font-bold text-white focus:outline-none"
              placeholder="0.0"
            />
          </div>
          ${state.print.printHours > 0 ? `
            <div class="text-center text-xs text-cyan-400 font-mono mt-4">
              ≈ ${parseDecimalHours(state.print.printHours).hours}h ${parseDecimalHours(state.print.printHours).minutes}min
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  else if (state.step === 4) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">📦 Logística</h2>
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2">Tamaño de Empaque</label>
          <select
            onchange="updateLogistics('packagingSize', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold"
          >
            ${PACKAGING.map(p => `<option value="${p.id}" ${state.logistics.packagingSize === p.id ? 'selected' : ''}>${p.name}${p.cost > 0 ? ` - ${formatCurrency(p.cost)}` : ''}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }

  else if (state.step === 5) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">💰 Finanzas</h2>
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3 flex items-center gap-2">${Icons.DollarSign()} Pasarela de Pago</label>
          <select
            onchange="updatePricing('gateway', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold"
          >
            ${GATEWAYS.map(g => `<option value="${g.id}" ${state.pricing.gateway === g.id ? 'selected' : ''}>${g.name}${g.rate > 0 ? ` (${g.rate}%)` : ' (0%)'}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }

  else if (state.step === 6 && state.results) {
    const r = state.results;
    content = `
      <div class="space-y-5 animate-fade-in">
        <div class="text-center mb-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-2xl">
          <p class="text-zinc-500 text-xs uppercase mb-2">Precio a Cobrar</p>
          <h1 class="text-6xl font-black text-white mb-3 tracking-tight">${formatCurrency(r.finalPrice)}</h1>
        </div>
        <button onclick="resetCalculator()" class="w-full bg-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3">
          ${Icons.ArrowLeft(20)} Nueva Cotización
        </button>
      </div>
    `;
  }

  // Estructura Base
  return `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div class="flex items-center justify-between max-w-md mx-auto">
          <button onclick="${state.step === 1 ? 'navigateTo(\'home\')' : 'prevStep()'}" class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">${Icons.ArrowLeft(20)}</button>
          <h1 class="text-lg font-bold text-cyan-400">Paso ${state.step}/6</h1>
        </div>
        <div class="max-w-md mx-auto mt-3">
          <div class="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500" style="width: ${getProgress()}%"></div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pb-32">
        <div class="max-w-md mx-auto p-5">
          ${content}
        </div>
      </main>

      ${state.step < 6 ? `
        <footer class="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
          <div class="max-w-md mx-auto">
            <button onclick="nextStep()" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold">
              ${state.step === 5 ? 'CALCULAR' : 'Siguiente'} ${Icons.ChevronRight()}
            </button>
          </div>
        </footer>
      ` : ''}
    </div>
  `;
}

// ============================================
// CORE RENDERING FUNCTIONS
// ============================================

function renderCalculator() {
  const root = document.getElementById('root');
  root.innerHTML = Calculator();
}

window.renderCalculatorWithScroll = () => {
  const scrollContainer = document.querySelector('main');
  const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;

  renderCalculator();

  requestAnimationFrame(() => {
    const newScrollContainer = document.querySelector('main');
    if (newScrollContainer) {
      newScrollContainer.scrollTop = scrollPosition;
    }
  });
};

window.resetCalculator = () => {
  delete window.calculatorState;
  navigateTo('home');
};

// Exportar componentes
window.Components = {
  HomeScreen,
  Calculator,
  History: window.History || (() => ''),
  PackageCalculator: window.PackageCalculator || (() => '')
};