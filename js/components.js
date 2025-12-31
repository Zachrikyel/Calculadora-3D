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
      <!-- Header -->
      <header class="bg-zinc-900 border-b border-zinc-800 p-4">
        <div class="max-w-md mx-auto">
          <h1 class="text-2xl font-bold text-cyan-400 tracking-wider">SICMA PRO</h1>
          <p class="text-xs text-zinc-500 font-mono">Calculadora 3D v2.0</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-5">
        <div class="max-w-md mx-auto space-y-6 animate-fade-in">
          
          <!-- Bienvenida -->
          <div class="text-center py-8">
            <div class="text-6xl mb-4">🎯</div>
            <h2 class="text-2xl font-bold text-white mb-2">Bienvenido</h2>
            <p class="text-zinc-400">Selecciona una opción para comenzar</p>
          </div>

          <!-- Opciones principales -->
          <div class="grid grid-cols-1 gap-4">
            
            <!-- Nueva Cotización -->
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

            <!-- Calculadora de Paquetes -->
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

            <!-- Historial -->
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

          <!-- Stats rápidos -->
          <div class="grid grid-cols-3 gap-3 mt-8">
            <div class="bg-zinc-900 p-4 rounded-xl text-center border border-zinc-800">
              <div class="text-2xl font-bold text-cyan-400">--</div>
              <div class="text-xs text-zinc-500 mt-1">Cotizaciones</div>
            </div>
            <div class="bg-zinc-900 p-4 rounded-xl text-center border border-zinc-800">
              <div class="text-2xl font-bold text-purple-400">--</div>
              <div class="text-xs text-zinc-500 mt-1">Paquetes</div>
            </div>
            <div class="bg-zinc-900 p-4 rounded-xl text-center border border-zinc-800">
              <div class="text-2xl font-bold text-green-400">--</div>
              <div class="text-xs text-zinc-500 mt-1">Este mes</div>
            </div>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="p-4 text-center text-xs text-zinc-600">
        <p>SICMA Pro © 2024 - Calculadora Profesional 3D</p>
      </footer>
    </div>
  `;
}

// ============================================
// CALCULATOR - VERSIÓN COMPLETA 6 PASOS
// ============================================

function Calculator() {
  const Icons = getIcons();
  
  // Estado inicial de la calculadora
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
        complexity: 'simple',  // DEFAULT: Simple (ajuste crítico)
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
        gateway: 'wompi',
        profitMargin: 30,
        additionalCharge: 0
      },
      results: null
    };
  }

  const state = window.calculatorState;
  const { PRINTERS, NOZZLES, MATERIALS, SHIPPING_OPTIONS, PACKAGING, COMPLEXITY_LEVELS, GATEWAYS } = window.SICMA_CONSTANTS;
  const { formatCurrency, formatHours, parseDecimalHours } = window.Formatters;

  // Helpers para actualizar estado
  window.updateConfig = (key, value) => {
    state.config[key] = value;
    if (key === 'material') {
      const material = MATERIALS.find(m => m.id === value);
      state.print.coolMinutes = material.coolMinutes;
    }
    renderCalculator();
  };

  window.updatePrint = (key, value) => {
    state.print[key] = value;
    renderCalculator();
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

  window.renderCalculatorWithScroll = () => {
    // Guardar posición del scroll
    const scrollContainer = document.querySelector('main');
    const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
    
    // Re-renderizar
    renderCalculator();
    
    // Restaurar posición del scroll después de que el DOM se actualice
    requestAnimationFrame(() => {
      const newScrollContainer = document.querySelector('main');
      if (newScrollContainer) {
        newScrollContainer.scrollTop = scrollPosition;
      }
    });
  };

  window.renderCalculatorWithScroll = () => {
    // Guardar posición del scroll
    const scrollContainer = document.querySelector('main');
    const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
    
    // Re-renderizar
    renderCalculator();
    
    // Restaurar posición del scroll después de que el DOM se actualice
    requestAnimationFrame(() => {
      const newScrollContainer = document.querySelector('main');
      if (newScrollContainer) {
        newScrollContainer.scrollTop = scrollPosition;
      }
    });
  };

  window.nextStep = () => {
    if (state.step === 5) {
      // Calcular antes de ir a resultados
      state.results = window.Calculations.calculateQuote({
        config: state.config,
        print: state.print,
        labor: state.labor,
        logistics: state.logistics,
        pricing: state.pricing
      });
      state.step = 6;
    } else if (state.step < 6) {
      state.step++;
    }
    renderCalculator(); // Aquí SÍ resetear scroll porque cambiamos de paso
  };

  window.prevStep = () => {
    if (state.step > 1) {
      state.step--;
      renderCalculator(); // Aquí SÍ resetear scroll porque cambiamos de paso
    }
  };

  window.resetCalculator = () => {
    delete window.calculatorState;
    navigateTo('home');
  };

  window.showSaveModal = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in';
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6 animate-slide-up">
        <h2 class="text-2xl font-bold text-white mb-4">💾 Guardar Cotización</h2>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm text-zinc-400 mb-2">Nombre de la cotización *</label>
            <input
              type="text"
              id="quoteName"
              placeholder="ej: Figura Dragon Rojo"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label class="block text-sm text-zinc-400 mb-2">Cliente (opcional)</label>
            <input
              type="text"
              id="clientName"
              placeholder="ej: Juan Pérez"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-sm text-zinc-400 mb-2">ID Producto (opcional)</label>
            <input
              type="text"
              id="productId"
              placeholder="ej: DRAG-001"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-sm text-zinc-400 mb-2">Notas (opcional)</label>
            <textarea
              id="notes"
              rows="2"
              placeholder="Notas adicionales..."
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg">
            <input type="checkbox" id="generateVariants" checked class="w-4 h-4 accent-cyan-500" />
            <label for="generateVariants" class="text-sm text-zinc-300">
              Generar 7 variantes automáticas (Envío + Empaque)
            </label>
          </div>
        </div>

        <div id="saveError" class="hidden mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"></div>
        <div id="saveLoading" class="hidden mb-4 text-center">
          <div class="inline-block loading"></div>
          <p class="text-sm text-zinc-400 mt-2">Guardando cotización...</p>
        </div>

        <div class="flex gap-3">
          <button
            onclick="closeSaveModal()"
            class="flex-1 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition"
          >
            Cancelar
          </button>
          <button
            onclick="saveQuoteToDatabase()"
            class="flex-1 py-3 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('quoteName').focus();
  };

  window.closeSaveModal = () => {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
  };

  window.saveQuoteToDatabase = async () => {
    const quoteName = document.getElementById('quoteName').value.trim();
    const clientName = document.getElementById('clientName').value.trim();
    const productId = document.getElementById('productId').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const generateVariants = document.getElementById('generateVariants').checked;

    const errorDiv = document.getElementById('saveError');
    const loadingDiv = document.getElementById('saveLoading');

    // Validación
    if (!quoteName) {
      errorDiv.textContent = '⚠️ El nombre de la cotización es obligatorio';
      errorDiv.classList.remove('hidden');
      return;
    }

    // Mostrar loading
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
      const quoteData = {
        quoteName,
        clientName: clientName || null,
        productId: productId || null,
        notes: notes || null,
        generateVariants,
        config: state.config,
        print: state.print,
        labor: state.labor,
        logistics: state.logistics,
        pricing: state.pricing,
        results: state.results
      };

      const savedQuote = await window.Storage.saveQuote(quoteData);

      // Éxito
      loadingDiv.classList.add('hidden');
      closeSaveModal();
      
      // Mostrar notificación de éxito
      showSuccessNotification('✅ Cotización guardada correctamente');
      
      // Resetear calculadora y volver al home
      setTimeout(() => {
        resetCalculator();
      }, 1500);

    } catch (error) {
      console.error('Error guardando:', error);
      loadingDiv.classList.add('hidden');
      errorDiv.textContent = `❌ Error: ${error.message}`;
      errorDiv.classList.remove('hidden');
    }
  };

  window.showSuccessNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const getProgress = () => (state.step / 6) * 100;

  // Render según step actual
  let content = '';

  if (state.step === 1) {
    const selectedPrinter = PRINTERS.find(p => p.id === state.config.printer);
    const selectedNozzle = NOZZLES.find(n => n.size === state.config.nozzle);
    const selectedMaterial = MATERIALS.find(m => m.id === state.config.material);

    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">⚙️ Configuración</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
            ${Icons.Zap(16)}
            Costo Luz (COP/kWh)
          </label>
          <input
            type="number"
            value="${state.config.kwhPrice}"
            onblur="updateConfig('kwhPrice', parseFloat(this.value) || 0)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-xl font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
          />
          <p class="text-xs text-zinc-500 mt-2">💡 Recomendado: ~920 COP</p>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <div class="flex items-center justify-between mb-3">
            ${Icons.Printer(24)}
            <span class="text-xs font-mono text-cyan-400 bg-zinc-800 px-2 py-1 rounded">HARDWARE</span>
          </div>
          
          <label class="block text-sm text-zinc-400 mb-2">Impresora</label>
          <select
            value="${state.config.printer}"
            onchange="updateConfig('printer', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold focus:outline-none focus:border-cyan-500 mb-4"
          >
            ${PRINTERS.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>

          <div class="flex justify-between text-xs font-mono mb-4">
            <span class="text-zinc-500">Consumo: <span class="text-white font-bold">${selectedPrinter.watts}W</span></span>
            <span class="text-zinc-500">Desgaste: <span class="text-white font-bold">${formatCurrency(selectedPrinter.wear)}/h</span></span>
          </div>

          <div class="pt-4 border-t border-zinc-800">
            <label class="block text-sm text-zinc-400 mb-2">Boquilla (Nozzle)</label>
            <div class="grid grid-cols-4 gap-2">
              ${NOZZLES.map(nozzle => `
                <button
                  onclick="updateConfig('nozzle', ${nozzle.size})"
                  class="py-2 rounded-lg border-2 transition text-sm ${
                    state.config.nozzle === nozzle.size 
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                      : 'border-zinc-700 text-zinc-400'
                  }"
                >
                  ${nozzle.size}
                </button>
              `).join('')}
            </div>
            <p class="text-xs text-zinc-600 mt-2">
              ⚠️ Riesgo: +${((selectedNozzle.riskFactor - 1) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2">Material</label>
          <select
            value="${state.config.material}"
            onchange="updateConfig('material', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold focus:outline-none focus:border-cyan-500 mb-4"
          >
            ${MATERIALS.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
          </select>

          <label class="block text-sm text-zinc-400 mb-2">Costo Filamento (COP/Kg)</label>
          <input
            type="number"
            value="${state.config.materialCostPerKg}"
            onblur="updateConfig('materialCostPerKg', parseFloat(this.value) || 0)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-cyan-500 mb-2"
          />
          <p class="text-xs text-zinc-500 mb-4">Precio por kilogramo</p>

          <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
            <div class="flex items-center gap-2">
              ${Icons.Sparkles(18)}
              <span class="text-sm">Modo AMS</span>
            </div>
            <button
              onclick="updateConfig('amsMode', ${!state.config.amsMode})"
              class="w-12 h-6 rounded-full transition relative ${state.config.amsMode ? 'bg-cyan-500' : 'bg-zinc-700'}"
            >
              <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.config.amsMode ? 'translate-x-6' : ''}"></div>
            </button>
          </div>
          
          ${state.config.amsMode ? `
            <div class="flex items-start gap-2 mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              ${Icons.AlertCircle(14)}
              <span class="text-xs text-orange-400">
                Riesgo +${((selectedMaterial.amsRisk - 1) * 100).toFixed(0)}% por purga
              </span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Step 2: Datos de Impresión
  else if (state.step === 2) {
    const selectedMaterial = MATERIALS.find(m => m.id === state.config.material);
    
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">⏱️ Datos de Impresión</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-4 flex items-center gap-2">
            ${Icons.Clock()}
            Tiempo (desde Bambu Studio)
          </label>
          
          <div class="bg-zinc-800 rounded-xl p-6 text-center mb-4">
            <input
              type="number"
              step="0.01"
              value="${state.print.printHours || ''}"
              onblur="updatePrint('printHours', parseFloat(this.value) || 0)"
              class="w-full bg-transparent text-center text-5xl font-bold text-white focus:outline-none"
              placeholder="0.0"
            />
            <div class="text-sm text-zinc-500 mt-2">horas (ej: 4.42 = 4h 25min)</div>
          </div>

          ${state.print.printHours > 0 ? `
            <div class="text-center text-xs text-cyan-400 font-mono bg-cyan-500/10 p-2 rounded-lg mb-4">
              ≈ ${parseDecimalHours(state.print.printHours).hours}h ${parseDecimalHours(state.print.printHours).minutes}min
            </div>
          ` : ''}
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3">Tipo de Impresión</label>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button
              onclick="updatePrint('isPiece', 'single')"
              class="py-3 rounded-lg border-2 transition ${
                state.print.isPiece === 'single'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-zinc-700 text-zinc-400'
              }"
            >
              Pieza Única
            </button>
            <button
              onclick="updatePrint('isPiece', 'multi')"
              class="py-3 rounded-lg border-2 transition ${
                state.print.isPiece === 'multi'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-zinc-700 text-zinc-400'
              }"
            >
              Multipieza
            </button>
          </div>

          ${state.print.isPiece === 'multi' ? `
            <div class="mb-4">
              <label class="block text-sm text-zinc-400 mb-2">Cantidad de Placas</label>
              <input
                type="number"
                min="1"
                value="${state.print.plateCount}"
                onblur="updatePrint('plateCount', parseInt(this.value) || 1)"
                class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          ` : ''}

          <div class="pt-4 border-t border-zinc-800">
            <label class="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
              ${Icons.Snowflake()}
              Enfriamiento Base (min)
            </label>
            <input
              type="number"
              value="${state.print.coolMinutes || selectedMaterial.coolMinutes}"
              onblur="updatePrint('coolMinutes', parseInt(this.value) || 0)"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
            />
            <p class="text-xs text-zinc-500 mt-2">
              ${state.print.isPiece === 'multi' 
                ? `Se multiplicará por ${state.print.plateCount || 1} placas = ${(state.print.coolMinutes || selectedMaterial.coolMinutes) * (Number(state.print.plateCount) || 1)} min total`
                : `Recomendado ${selectedMaterial.name}: ${selectedMaterial.coolMinutes} min`
              }
            </p>
          </div>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-4 flex items-center gap-2">
            ${Icons.Package()}
            Cantidad Material
          </label>
          
          <div class="bg-zinc-800 rounded-xl p-4 mb-3">
            <div class="text-xs text-zinc-500 mb-2">Valor desde Bambu Studio (COP)</div>
            <input
              type="number"
              value="${state.print.materialCost || ''}"
              onblur="updatePrint('materialCost', parseFloat(this.value) || 0)"
              class="w-full bg-transparent text-right text-3xl font-bold text-cyan-400 focus:outline-none"
              placeholder="0"
            />
          </div>

          <div class="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-500">
            💡 Usa la cantidad total que muestra Bambu Studio
          </div>
        </div>
      </div>
    `;
  }

  // Step 3: Complejidad (CON AJUSTE CRÍTICO)
  else if (state.step === 3) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">🎯 Complejidad</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-4">Nivel de Complejidad</label>
          
          <div class="space-y-3">
            ${Object.entries(COMPLEXITY_LEVELS).map(([key, level]) => {
              const isSelected = state.labor.complexity === key;
              const estimatedCost = (level.suppliesCost + ((level.postProcessMinutes + level.operatorMinutes) / 60 * 20000) * (1 + level.failureRisk)).toFixed(0);
              
              return `
                <button
                  onclick="updateLabor('complexity', '${key}')"
                  class="w-full p-4 rounded-xl border-2 transition text-left ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-zinc-700 bg-zinc-800'
                  }"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-bold text-white">${level.name}</span>
                    <span class="text-sm text-cyan-400 font-mono">
                      ${formatCurrency(estimatedCost)}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs text-zinc-400">
                    <div>• Post-proceso: ${level.postProcessMinutes} min</div>
                    <div>• Operador: ${level.operatorMinutes} min</div>
                    <div>• Riesgo fallo: ${(level.failureRisk * 100).toFixed(0)}%</div>
                    <div>• Insumos: ${formatCurrency(level.suppliesCost)}</div>
                  </div>
                  ${level.description ? `
                    <div class="text-xs text-zinc-500 mt-2 italic">
                      ${level.description}
                    </div>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          ${state.config.amsMode ? `
            <div class="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-400">
              ✓ Modo AMS activo: +2% adicional aplicado automáticamente
            </div>
          ` : ''}
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <h3 class="text-sm font-bold text-white mb-3">Acabados Opcionales</h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div class="flex items-center gap-2">
                ${Icons.Sparkles(18)}
                <div>
                  <div class="text-sm font-semibold">Primer</div>
                  <div class="text-xs text-zinc-500">+$1.500</div>
                </div>
              </div>
              <button
                onclick="updateLabor('primerToggle', ${!state.labor.primerToggle})"
                class="w-12 h-6 rounded-full transition relative ${state.labor.primerToggle ? 'bg-cyan-500' : 'bg-zinc-700'}"
              >
                <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.labor.primerToggle ? 'translate-x-6' : ''}"></div>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div class="flex items-center gap-2">
                ${Icons.Sparkles(18)}
                <div>
                  <div class="text-sm font-semibold">Laca</div>
                  <div class="text-xs text-zinc-500">+$1.500</div>
                </div>
              </div>
              <button
                onclick="updateLabor('lacquerToggle', ${!state.labor.lacquerToggle})"
                class="w-12 h-6 rounded-full transition relative ${state.labor.lacquerToggle ? 'bg-cyan-500' : 'bg-zinc-700'}"
              >
                <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.labor.lacquerToggle ? 'translate-x-6' : ''}"></div>
              </button>
            </div>
          </div>

          <p class="text-xs text-zinc-500 mt-3">
            💡 Activa solo si la pieza requiere estos acabados
          </p>
        </div>
      </div>
    `;
  }

  // Step 4: Logística
  else if (state.step === 4) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">📦 Logística</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3 flex items-center gap-2">
            ${Icons.Truck()}
            Envío
          </label>
          
          <div class="space-y-2">
            ${SHIPPING_OPTIONS.map(option => `
              <button
                onclick="updateLogistics('shipping', '${option.id}')"
                class="w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${
                  state.logistics.shipping === option.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-zinc-700 bg-zinc-800'
                }"
              >
                <div class="flex items-center gap-3">
                  <div class="text-2xl">${option.icon}</div>
                  <div class="text-sm font-semibold">${option.name}</div>
                </div>
                <div class="text-sm font-bold">
                  ${option.cost === 0 ? 'Gratis' : `${formatCurrency(option.cost)}`}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3">Embalaje</label>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button
              onclick="updateLogistics('packagingType', 'box')"
              class="py-3 rounded-lg border-2 transition ${
                state.logistics.packagingType === 'box'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-zinc-700 text-zinc-400'
              }"
            >
              📦 Caja
            </button>
            <button
              onclick="updateLogistics('packagingType', 'bag')"
              class="py-3 rounded-lg border-2 transition ${
                state.logistics.packagingType === 'bag'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-zinc-700 text-zinc-400'
              }"
            >
              🎒 Bolsa
            </button>
          </div>

          <label class="block text-sm text-zinc-400 mb-2">Tamaño</label>
          <select
            value="${state.logistics.packagingSize}"
            onchange="updateLogistics('packagingSize', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold focus:outline-none focus:border-cyan-500 mb-3"
          >
            ${PACKAGING.map(p => `
              <option value="${p.id}">
                ${p.name}${p.cost > 0 ? ` - ${formatCurrency(p.cost)}` : ''}
              </option>
            `).join('')}
          </select>

          ${state.logistics.packagingSize === 'deluxe' ? `
            <div>
              <label class="block text-sm text-zinc-400 mb-2">Costo Personalizado</label>
              <input
                type="number"
                value="${state.logistics.packagingCustom}"
                onblur="updateLogistics('packagingCustom', parseFloat(this.value) || 0)"
                class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                placeholder="Ingrese costo"
              />
            </div>
          ` : ''}
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
            <div class="flex items-center gap-2">
              ${Icons.Sparkles(18)}
              <span class="text-sm">Cargo Adicional (+2%)</span>
            </div>
            <button
              onclick="updateLogistics('additionalsToggle', ${!state.logistics.additionalsToggle})"
              class="w-12 h-6 rounded-full transition relative ${state.logistics.additionalsToggle ? 'bg-cyan-500' : 'bg-zinc-700'}"
            >
              <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.logistics.additionalsToggle ? 'translate-x-6' : ''}"></div>
            </button>
          </div>
          <p class="text-xs text-zinc-500 mt-2">Activa para agregar 2% al costo de embalaje</p>
        </div>
      </div>
    `;
  }

  // Step 5: Pricing
  else if (state.step === 5) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">💰 Finanzas</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3 flex items-center gap-2">
            ${Icons.DollarSign()}
            Pasarela de Pago
          </label>
          <select
            value="${state.pricing.gateway}"
            onchange="updatePricing('gateway', this.value)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-semibold focus:outline-none focus:border-cyan-500"
          >
            ${GATEWAYS.map(g => `
              <option value="${g.id}">
                ${g.name}${g.rate > 0 ? ` (${g.rate}%)` : ' (0%)'}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-3 flex items-center gap-2">
            ${Icons.TrendingUp()}
            Margen de Ganancia
          </label>
          <div class="flex items-center gap-3 mb-4">
            <input
              type="number"
              value="${state.pricing.profitMargin}"
              onblur="updatePricing('profitMargin', parseFloat(this.value) || 0)"
              class="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
            <span class="text-2xl text-white">%</span>
            <div class="text-xs text-zinc-500 flex-1">
              ≈ Multiplicar por <span class="text-white font-bold">${(1 / (1 - state.pricing.profitMargin / 100)).toFixed(1)}x</span>
            </div>
          </div>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
            ${Icons.Sparkles()}
            Cargo Adicional
          </label>
          <p class="text-xs text-zinc-500 mb-3">
            Para piezas muy personalizadas. Este valor se cobra APARTE (no entra en Wompi).
          </p>
          <input
            type="number"
            value="${state.pricing.additionalCharge}"
            onblur="updatePricing('additionalCharge', parseFloat(this.value) || 0)"
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-xl font-bold text-purple-400 focus:outline-none focus:border-purple-500"
            placeholder="0"
          />
        </div>
      </div>
    `;
  }

  // Step 6: Resultados
  else if (state.step === 6 && state.results) {
    const r = state.results;
    
    content = `
      <div class="space-y-5 animate-fade-in">
        <div class="text-center mb-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-2xl">
          <p class="text-zinc-500 text-xs uppercase tracking-widest mb-2">Precio a Cobrar</p>
          <h1 class="text-6xl font-black text-white mb-3 tracking-tight">
            ${formatCurrency(r.finalPrice)}
          </h1>
          <div class="flex justify-center gap-4 text-xs font-mono text-zinc-500">
            <span>USD ${(r.finalPrice / 4100).toFixed(2)}</span>
            <span>|</span>
            <span>EUR €${(r.finalPrice / 4400).toFixed(2)}</span>
          </div>
        </div>

        <!-- Resumen de Producción -->
        <div class="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden mb-5">
          <div class="bg-zinc-800 p-3 text-center">
            <span class="text-xs font-bold text-zinc-400 uppercase">Resumen de Producción</span>
          </div>
          
          <div class="p-5 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-zinc-400">⏱️ Tiempo Total</span>
              <span class="font-mono text-white font-bold">${r.totalProductionTime.toFixed(1)}h</span>
            </div>
            <div class="text-xs text-zinc-600 pl-4 space-y-1">
              <div class="flex justify-between">
                <span>• Impresión</span>
                <span>${r.totalPrintHours.toFixed(1)}h</span>
              </div>
              <div class="flex justify-between">
                <span>• Enfriamiento</span>
                <span>${r.totalCoolHours.toFixed(1)}h</span>
              </div>
            </div>

            <div class="flex justify-between">
              <span class="text-zinc-400">⚡ Costo Energía</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.breakdown.energy)}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-zinc-400">🔧 Desgaste Máquina</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.breakdown.wear)}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-zinc-400">📦 Material Total</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.breakdown.material)}</span>
            </div>
          </div>
        </div>

        <!-- Estructura de Costos -->
        <div class="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div class="bg-zinc-800 p-3 text-center">
            <span class="text-xs font-bold text-zinc-400 uppercase">Estructura de Costos</span>
          </div>
          
          <div class="p-5 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-zinc-400">💎 Costos Duros</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.hardCosts)}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-zinc-400">👤 Mano de Obra</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.softCosts)}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-zinc-400">📦 Logística</span>
              <span class="font-mono text-white font-bold">${formatCurrency(r.logisticsCosts)}</span>
            </div>

            <div class="h-px bg-zinc-800"></div>

            <div class="flex justify-between text-lg pt-2">
              <span class="text-cyan-400 font-bold">💰 Ganancia Neta</span>
              <span class="font-mono text-cyan-400 font-black">${formatCurrency(r.netProfit)}</span>
            </div>

            <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-xs text-cyan-400">
              ✅ Ganancia 100% limpia (todo descontado)
            </div>

            ${r.feeEstimate > 0 ? `
              <div class="flex justify-between text-xs text-orange-400 pt-2 border-t border-zinc-800">
                <span>Comisión (incluida)</span>
                <span>-${formatCurrency(r.feeEstimate)}</span>
              </div>
            ` : ''}

            ${r.additionalCharge > 0 ? `
              <div class="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div class="flex justify-between items-center text-purple-400">
                  <span class="text-sm font-bold">💎 Cargo Adicional</span>
                  <span class="text-lg font-bold">${formatCurrency(r.additionalCharge)}</span>
                </div>
                <p class="text-xs text-purple-400 mt-1">Se cobra aparte</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Acciones -->
        <div class="space-y-3 pt-4">
          <button
            onclick="showSaveModal()"
            class="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3"
          >
            ${Icons.Check(20)}
            Guardar Cotización
          </button>

          <button
            onclick="resetCalculator()"
            class="w-full bg-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3"
          >
            ${Icons.ArrowLeft(20)}
            Nueva Cotización
          </button>
        </div>
      </div>
    `;
  }
  else if (state.step === 3) {
    content = `
      <div class="space-y-5 animate-fade-in">
        <h2 class="text-2xl font-bold text-white mb-6">🎯 Complejidad</h2>
        
        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-4">Nivel de Complejidad</label>
          
          <div class="space-y-3">
            ${Object.entries(COMPLEXITY_LEVELS).map(([key, level]) => {
              const isSelected = state.labor.complexity === key;
              const estimatedCost = (level.suppliesCost + ((level.postProcessMinutes + level.operatorMinutes) / 60 * 20000) * (1 + level.failureRisk)).toFixed(0);
              
              return `
                <button
                  onclick="updateLabor('complexity', '${key}')"
                  class="w-full p-4 rounded-xl border-2 transition text-left ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-zinc-700 bg-zinc-800'
                  }"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-bold text-white">${level.name}</span>
                    <span class="text-sm text-cyan-400 font-mono">
                      ${formatCurrency(estimatedCost)}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs text-zinc-400">
                    <div>• Post-proceso: ${level.postProcessMinutes} min</div>
                    <div>• Operador: ${level.operatorMinutes} min</div>
                    <div>• Riesgo fallo: ${(level.failureRisk * 100).toFixed(0)}%</div>
                    <div>• Insumos: ${formatCurrency(level.suppliesCost)}</div>
                  </div>
                  ${level.description ? `
                    <div class="text-xs text-zinc-500 mt-2 italic">
                      ${level.description}
                    </div>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          ${state.config.amsMode ? `
            <div class="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-400">
              ✓ Modo AMS activo: +2% adicional aplicado automáticamente
            </div>
          ` : ''}
        </div>

        <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <h3 class="text-sm font-bold text-white mb-3">Acabados Opcionales</h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div class="flex items-center gap-2">
                ${Icons.Sparkles(18)}
                <div>
                  <div class="text-sm font-semibold">Primer</div>
                  <div class="text-xs text-zinc-500">+$1.500</div>
                </div>
              </div>
              <button
                onclick="updateLabor('primerToggle', ${!state.labor.primerToggle})"
                class="w-12 h-6 rounded-full transition relative ${state.labor.primerToggle ? 'bg-cyan-500' : 'bg-zinc-700'}"
              >
                <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.labor.primerToggle ? 'translate-x-6' : ''}"></div>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div class="flex items-center gap-2">
                ${Icons.Sparkles(18)}
                <div>
                  <div class="text-sm font-semibold">Laca</div>
                  <div class="text-xs text-zinc-500">+$1.500</div>
                </div>
              </div>
              <button
                onclick="updateLabor('lacquerToggle', ${!state.labor.lacquerToggle})"
                class="w-12 h-6 rounded-full transition relative ${state.labor.lacquerToggle ? 'bg-cyan-500' : 'bg-zinc-700'}"
              >
                <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${state.labor.lacquerToggle ? 'translate-x-6' : ''}"></div>
              </button>
            </div>
          </div>

          <p class="text-xs text-zinc-500 mt-3">
            💡 Activa solo si la pieza requiere estos acabados
          </p>
        </div>
      </div>
    `;
  }

  // Continúa en siguiente mensaje por límite de caracteres...
  
  const header = `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div class="flex items-center justify-between max-w-md mx-auto">
          <button 
            onclick="${state.step === 1 ? 'navigateTo(\'home\')' : 'prevStep()'}"
            class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"
          >
            ${Icons.ArrowLeft(20)}
          </button>
          <div class="text-center flex-1">
            <h1 class="text-lg font-bold text-cyan-400">Paso ${state.step}/6</h1>
            <p class="text-xs text-zinc-500">Calculadora Pro</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-white">${state.step}</div>
            <div class="text-xs text-zinc-500">/6</div>
          </div>
        </div>
        
        <div class="max-w-md mx-auto mt-3">
          <div class="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style="width: ${getProgress()}%"
            ></div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pb-32" style="-webkit-overflow-scrolling: touch;">
        <div class="max-w-md mx-auto p-5">
          ${content}
        </div>
      </main>

      ${state.step < 6 ? `
        <footer class="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
          <div class="max-w-md mx-auto">
            <button
              onclick="nextStep()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold shadow-lg"
            >
              ${state.step === 5 ? 'CALCULAR' : 'Siguiente'}
              ${Icons.ChevronRight()}
            </button>
          </div>
        </footer>
      ` : ''}
    </div>
  `;

  return header;
}

function renderCalculator() {
  const root = document.getElementById('root');
  root.innerHTML = Calculator();
}

window.renderCalculatorWithScroll = () => {
  // Guardar posición del scroll SOLO del main (no de toda la página)
  const scrollContainer = document.querySelector('main');
  const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
  
  // Re-renderizar
  renderCalculator();
  
  // Restaurar posición del scroll después de que el DOM se actualice
  requestAnimationFrame(() => {
    const newScrollContainer = document.querySelector('main');
    if (newScrollContainer) {
      newScrollContainer.scrollTop = scrollPosition;
    }
  });
};


// ============================================
// HISTORY - VERSIÓN COMPLETA
// ============================================

function History() {
  const Icons = getIcons();
  const { formatCurrency, formatDateShort } = getFormatters();
  
  // Inicializar estado del historial
  if (!window.historyState) {
    window.historyState = {
      quotes: [],
      packages: [],
      loading: true,
      searchTerm: '',
      filter: 'all' // 'all', 'quotes', 'packages'
    };
    
    // Cargar datos
    loadHistoryData();
  }

  const state = window.historyState;

  return `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <!-- Header -->
      <header class="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div class="max-w-md mx-auto">
          <div class="flex items-center gap-3 mb-4">
            <button 
              onclick="navigateTo('home')"
              class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"
            >
              ${Icons.ArrowLeft(20)}
            </button>
            <div class="flex-1">
              <h1 class="text-lg font-bold text-cyan-400">Historial</h1>
              <p class="text-xs text-zinc-500">
                ${state.loading ? 'Cargando...' : `${state.quotes.length + state.packages.length} registros`}
              </p>
            </div>
          </div>

          <!-- Búsqueda -->
          <div class="relative">
            <input
              type="text"
              value="${state.searchTerm}"
              oninput="updateHistorySearch(this.value)"
              placeholder="Buscar por nombre, cliente..."
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              ${Icons.Search(20)}
            </div>
          </div>

          <!-- Filtros -->
          <div class="flex gap-2 mt-3">
            <button
              onclick="updateHistoryFilter('all')"
              class="flex-1 py-2 rounded-lg text-sm transition ${
                state.filter === 'all'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }"
            >
              Todos
            </button>
            <button
              onclick="updateHistoryFilter('quotes')"
              class="flex-1 py-2 rounded-lg text-sm transition ${
                state.filter === 'quotes'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }"
            >
              Cotizaciones
            </button>
            <button
              onclick="updateHistoryFilter('packages')"
              class="flex-1 py-2 rounded-lg text-sm transition ${
                state.filter === 'packages'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }"
            >
              Paquetes
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-5">
        <div class="max-w-md mx-auto space-y-3">
          ${state.loading ? `
            <div class="text-center py-20">
              <div class="loading mb-4"></div>
              <p class="text-zinc-400">Cargando historial...</p>
            </div>
          ` : renderHistoryItems(state)}
        </div>
      </main>
    </div>
  `;
}

function renderHistoryItems(state) {
  const { formatCurrency, formatDateShort } = window.Formatters;
  const Icons = window.Icons;
  
  let items = [];
  
  // Filtrar según selección
  if (state.filter === 'all' || state.filter === 'quotes') {
    items = items.concat(state.quotes.map(q => ({ ...q, type: 'quote' })));
  }
  if (state.filter === 'all' || state.filter === 'packages') {
    items = items.concat(state.packages.map(p => ({ ...p, type: 'package' })));
  }

  // Filtrar por búsqueda
  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    items = items.filter(item => {
      const name = item.quote_name || item.package_name || '';
      const client = item.client_name || '';
      return name.toLowerCase().includes(term) || client.toLowerCase().includes(term);
    });
  }

  // Ordenar por fecha
  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (items.length === 0) {
    return `
      <div class="text-center py-20">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-bold text-white mb-2">
          ${state.searchTerm ? 'No se encontraron resultados' : 'Historial Vacío'}
        </h2>
        <p class="text-zinc-400 mb-6">
          ${state.searchTerm ? 'Intenta con otro término' : 'Crea tu primera cotización'}
        </p>
        <button 
          onclick="navigateTo('calculator')"
          class="bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-600 transition"
        >
          Nueva Cotización
        </button>
      </div>
    `;
  }

  return items.map(item => {
    const isQuote = item.type === 'quote';
    const name = isQuote ? item.quote_name : item.package_name;
    const price = isQuote ? item.results.finalPrice : item.final_price;
    const icon = isQuote ? '📄' : '📦';
    const color = isQuote ? 'cyan' : 'purple';

    return `
      <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-${color}-500/50 transition cursor-pointer"
           onclick="viewHistoryItem('${item.id}', '${item.type}')">
        <div class="flex items-start gap-3">
          <div class="text-3xl">${icon}</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white truncate">${name}</h3>
            ${item.client_name ? `
              <p class="text-xs text-zinc-500">Cliente: ${item.client_name}</p>
            ` : ''}
            <div class="flex items-center gap-2 mt-2">
              <span class="text-lg font-bold text-${color}-400">${formatCurrency(price)}</span>
              <span class="text-xs text-zinc-600">•</span>
              <span class="text-xs text-zinc-500">${formatDateShort(item.created_at)}</span>
            </div>
          </div>
          <button class="text-zinc-500 hover:text-white transition">
            ${Icons.ChevronRight(20)}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.loadHistoryData = async () => {
  try {
    const [quotes, packages] = await Promise.all([
      window.Storage.getQuotes(50, 0),
      window.Storage.getPackages(50, 0)
    ]);

    window.historyState.quotes = quotes;
    window.historyState.packages = packages;
    window.historyState.loading = false;
    
    renderHistory();
  } catch (error) {
    console.error('Error cargando historial:', error);
    window.historyState.loading = false;
    renderHistory();
  }
};

window.updateHistorySearch = (term) => {
  window.historyState.searchTerm = term;
  renderHistory();
};

window.updateHistoryFilter = (filter) => {
  window.historyState.filter = filter;
  renderHistory();
};

window.renderHistory = () => {
  const root = document.getElementById('root');
  root.innerHTML = History();
};

window.viewHistoryItem = (id, type) => {
  if (type === 'quote') {
    showQuoteDetail(id);
  } else {
    showPackageDetail(id);
  }
};

window.showQuoteDetail = async (quoteId) => {
  const Icons = window.Icons;
  const { formatCurrency, formatHours } = window.Formatters;
  
  // Mostrar modal de loading
  const modal = document.createElement('div');
  modal.id = 'detailModal';
  modal.className = 'fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto';
  modal.innerHTML = `
    <div class="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-2xl w-full my-8">
      <div class="p-6 text-center">
        <div class="loading mb-4"></div>
        <p class="text-zinc-400">Cargando detalles...</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  try {
    const quote = await window.Storage.getQuoteById(quoteId);
    const r = quote.results;

    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-2xl w-full my-8 animate-slide-up">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-800">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-white">${quote.quote_name}</h2>
            ${quote.client_name ? `<p class="text-sm text-zinc-400">Cliente: ${quote.client_name}</p>` : ''}
          </div>
          <button onclick="closeDetailModal()" class="text-zinc-400 hover:text-white transition">
            ${Icons.X(24)}
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <!-- Precio Principal -->
          <div class="text-center bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-xl p-6">
            <p class="text-zinc-400 text-sm mb-2">Precio Base</p>
            <p class="text-4xl font-black text-white">${formatCurrency(r.finalPrice)}</p>
          </div>

          <!-- Variantes -->
          ${quote.variants && quote.variants.length > 0 ? `
            <div>
              <h3 class="text-lg font-bold text-white mb-3">💰 Variantes de Precio</h3>
              <div class="space-y-2">
                ${quote.variants.map(v => `
                  <div class="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                    <span class="text-sm text-zinc-300">${v.variant_name}</span>
                    <span class="font-bold text-cyan-400">${formatCurrency(v.final_price)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Detalles -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-zinc-800 rounded-lg p-4">
              <p class="text-xs text-zinc-500 mb-1">Tiempo Total</p>
              <p class="text-lg font-bold text-white">${formatHours(r.totalProductionTime)}</p>
            </div>
            <div class="bg-zinc-800 rounded-lg p-4">
              <p class="text-xs text-zinc-500 mb-1">Ganancia Neta</p>
              <p class="text-lg font-bold text-green-400">${formatCurrency(r.netProfit)}</p>
            </div>
          </div>

          <!-- Breakdown -->
          <div>
            <h3 class="text-sm font-bold text-zinc-400 mb-3">BREAKDOWN DE COSTOS</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-zinc-400">Costos Duros</span>
                <span class="text-white font-mono">${formatCurrency(r.hardCosts)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-400">Mano de Obra</span>
                <span class="text-white font-mono">${formatCurrency(r.softCosts)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-400">Logística</span>
                <span class="text-white font-mono">${formatCurrency(r.logisticsCosts)}</span>
              </div>
            </div>
          </div>

          ${quote.notes ? `
            <div>
              <h3 class="text-sm font-bold text-zinc-400 mb-2">NOTAS</h3>
              <p class="text-sm text-zinc-300 bg-zinc-800 rounded-lg p-3">${quote.notes}</p>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-zinc-800 flex gap-3">
          <button
            onclick="deleteHistoryItem('${quote.id}', 'quote')"
            class="flex-1 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/20 transition"
          >
            ${Icons.Trash2(20)} Eliminar
          </button>
          <button
            onclick="closeDetailModal()"
            class="flex-1 py-3 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error cargando detalle:', error);
    modal.innerHTML = `
      <div class="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6">
        <p class="text-red-400 mb-4">Error cargando detalles</p>
        <button onclick="closeDetailModal()" class="w-full py-3 bg-zinc-800 rounded-lg">
          Cerrar
        </button>
      </div>
    `;
  }
};

window.showPackageDetail = async (packageId) => {
  // Similar a showQuoteDetail pero para paquetes
  alert('Detalle de paquete próximamente');
  // TODO: Implementar cuando hagamos la calculadora de paquetes
};

window.closeDetailModal = () => {
  const modal = document.getElementById('detailModal');
  if (modal) modal.remove();
};

window.deleteHistoryItem = async (id, type) => {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;

  try {
    if (type === 'quote') {
      await window.Storage.deleteQuote(id);
    } else {
      await window.Storage.deletePackage(id);
    }

    closeDetailModal();
    window.showSuccessNotification('✅ Eliminado correctamente');
    
    // Recargar historial
    delete window.historyState;
    navigateTo('history');

  } catch (error) {
    alert('Error al eliminar: ' + error.message);
  }
};

// ============================================
// PACKAGE CALCULATOR - VERSIÓN COMPLETA
// ============================================

function PackageCalculator() {
  const Icons = getIcons();
  const { formatCurrency } = getFormatters();
  
  // Inicializar estado
  if (!window.packageState) {
    window.packageState = {
      step: 1, // 1: Seleccionar, 2: Configurar
      quotes: [],
      selectedQuotes: [],
      logistics: {
        shipping: 'local',
        packagingSize: 'large'
      },
      profitMargin: 15,
      manualPrice: null,
      results: null,
      loading: true
    };
    
    loadQuotesForPackage();
  }

  const state = window.packageState;

  if (state.loading) {
    return `
      <div class="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div class="text-center">
          <div class="loading mb-4"></div>
          <p class="text-zinc-400">Cargando cotizaciones...</p>
        </div>
      </div>
    `;
  }

  // STEP 1: Seleccionar cotizaciones
  if (state.step === 1) {
    return renderPackageStep1(state);
  }
  
  // STEP 2: Configurar paquete
  else if (state.step === 2) {
    return renderPackageStep2(state);
  }
}

function renderPackageStep1(state) {
  const Icons = window.Icons;
  const { formatCurrency } = window.Formatters;
  
  return `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div class="max-w-md mx-auto">
          <div class="flex items-center gap-3 mb-3">
            <button 
              onclick="navigateTo('home')"
              class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"
            >
              ${Icons.ArrowLeft(20)}
            </button>
            <div class="flex-1">
              <h1 class="text-lg font-bold text-purple-400">Paquete Múltiple</h1>
              <p class="text-xs text-zinc-500">Paso 1: Seleccionar productos</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pb-32 p-5">
        <div class="max-w-md mx-auto">
          ${state.quotes.length === 0 ? `
            <div class="text-center py-20">
              <div class="text-6xl mb-4">📭</div>
              <h2 class="text-2xl font-bold text-white mb-2">No hay cotizaciones</h2>
              <p class="text-zinc-400 mb-6">Crea algunas cotizaciones primero</p>
              <button 
                onclick="navigateTo('calculator')"
                class="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold"
              >
                Crear Cotización
              </button>
            </div>
          ` : `
            <p class="text-sm text-zinc-400 mb-4">
              Selecciona las cotizaciones que quieres incluir en el paquete:
            </p>
            
            <div class="space-y-3">
              ${state.quotes.map(quote => {
                const isSelected = state.selectedQuotes.includes(quote.id);
                return `
                  <div 
                    onclick="toggleQuoteSelection('${quote.id}')"
                    class="bg-zinc-900 rounded-xl border-2 p-4 cursor-pointer transition ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-500/5'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex items-center justify-center w-6 h-6 rounded-md border-2 transition ${
                        isSelected
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-zinc-600'
                      }">
                        ${isSelected ? `<div class="text-white text-sm">${Icons.Check(16)}</div>` : ''}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-white truncate">${quote.quote_name}</h3>
                        ${quote.client_name ? `
                          <p class="text-xs text-zinc-500">Cliente: ${quote.client_name}</p>
                        ` : ''}
                        <p class="text-lg font-bold text-purple-400 mt-1">
                          ${formatCurrency(quote.results.finalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </main>

      ${state.selectedQuotes.length > 0 ? `
        <footer class="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
          <div class="max-w-md mx-auto">
            <button
              onclick="goToPackageStep2()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg"
            >
              Continuar (${state.selectedQuotes.length} seleccionados)
              ${Icons.ChevronRight()}
            </button>
          </div>
        </footer>
      ` : ''}
    </div>
  `;
}

function renderPackageStep2(state) {
  const Icons = window.Icons;
  const { formatCurrency } = window.Formatters;
  const { SHIPPING_OPTIONS, PACKAGING } = window.SICMA_CONSTANTS;
  
  // Calcular resultados si no existen
  if (!state.results) {
    calculatePackageResults();
  }

  const r = state.results;
  const savings = r.individualTotal - r.finalPrice;
  const savingsPercent = (savings / r.individualTotal * 100).toFixed(1);

  return `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div class="max-w-md mx-auto flex items-center gap-3">
          <button 
            onclick="backToPackageStep1()"
            class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"
          >
            ${Icons.ArrowLeft(20)}
          </button>
          <div class="flex-1">
            <h1 class="text-lg font-bold text-purple-400">Paquete Múltiple</h1>
            <p class="text-xs text-zinc-500">Paso 2: Configurar precio</p>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pb-32 p-5">
        <div class="max-w-md mx-auto space-y-5">
          
          <!-- Precio Final -->
          <div class="text-center bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700">
            <p class="text-zinc-500 text-xs uppercase mb-2">Precio del Paquete</p>
            <h1 class="text-6xl font-black text-white mb-3">
              ${formatCurrency(state.manualPrice || r.finalPrice)}
            </h1>
            <div class="flex justify-center gap-2 text-xs text-zinc-500">
              <span>Individual: ${formatCurrency(r.individualTotal)}</span>
              <span>•</span>
              <span class="text-green-400">Ahorro: ${formatCurrency(savings)} (${savingsPercent}%)</span>
            </div>
          </div>

          <!-- Logística -->
          <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 class="text-sm font-bold text-white mb-3">📦 Logística del Paquete</h3>
            
            <label class="block text-sm text-zinc-400 mb-2">Envío</label>
            <select
              value="${state.logistics.shipping}"
              onchange="updatePackageLogistics('shipping', this.value)"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-4"
            >
              ${SHIPPING_OPTIONS.map(s => `
                <option value="${s.id}">${s.name} - ${s.cost === 0 ? 'Gratis' : formatCurrency(s.cost)}</option>
              `).join('')}
            </select>

            <label class="block text-sm text-zinc-400 mb-2">Empaque</label>
            <select
              value="${state.logistics.packagingSize}"
              onchange="updatePackageLogistics('packagingSize', this.value)"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            >
              ${PACKAGING.map(p => `
                <option value="${p.id}">${p.name}${p.cost > 0 ? ' - ' + formatCurrency(p.cost) : ''}</option>
              `).join('')}
            </select>

            <p class="text-xs text-zinc-500 mt-3">
              💡 Se cobrará un solo envío y empaque para todos los productos
            </p>
          </div>

          <!-- Opciones de Precio -->
          <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 class="text-sm font-bold text-white mb-3">💰 Opciones Sugeridas</h3>
            
            <div class="space-y-2">
              ${[
                { margin: 10, color: 'green', icon: '🟢' },
                { margin: 15, color: 'yellow', icon: '🟡' },
                { margin: 20, color: 'red', icon: '🔴' }
              ].map(opt => {
                const option = r.pricingSuggestions[`option_${opt.margin}`];
                return `
                  <button
                    onclick="selectPackageMargin(${opt.margin})"
                    class="w-full p-3 rounded-lg border-2 transition text-left ${
                      state.profitMargin === opt.margin && !state.manualPrice
                        ? `border-${opt.color}-500 bg-${opt.color}-500/10`
                        : 'border-zinc-700 bg-zinc-800'
                    }"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-semibold">${opt.icon} ${opt.margin}% Ganancia</span>
                      <span class="text-lg font-bold text-${opt.color}-400">${formatCurrency(option.price)}</span>
                    </div>
                    <div class="text-xs text-zinc-500 mt-1">
                      Ganancia: ${formatCurrency(option.profit)}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Precio Manual -->
          <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 class="text-sm font-bold text-white mb-3">✏️ Precio Personalizado</h3>
            <input
              type="number"
              value="${state.manualPrice || ''}"
              oninput="updateManualPackagePrice(this.value)"
              placeholder="Ingresa precio manual"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-xl font-bold text-purple-400 focus:outline-none focus:border-purple-500"
            />
            ${state.manualPrice ? `
              <p class="text-xs text-zinc-500 mt-2">
                Ganancia real: ${formatCurrency(state.manualPrice - r.baseCost)} 
                (${((state.manualPrice - r.baseCost) / state.manualPrice * 100).toFixed(1)}%)
              </p>
            ` : ''}
          </div>

          <!-- Resumen -->
          <div class="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 class="text-sm font-bold text-white mb-3">📊 Resumen</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-zinc-400">Productos incluidos</span>
                <span class="text-white font-bold">${state.selectedQuotes.length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-400">Costos producción</span>
                <span class="text-white font-mono">${formatCurrency(r.totalProductionCosts)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-400">Logística</span>
                <span class="text-white font-mono">${formatCurrency(r.logisticsCosts)}</span>
              </div>
              <div class="h-px bg-zinc-800 my-2"></div>
              <div class="flex justify-between text-lg">
                <span class="text-purple-400 font-bold">Ganancia Neta</span>
                <span class="text-purple-400 font-black">
                  ${formatCurrency((state.manualPrice || r.finalPrice) - r.baseCost)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer class="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
        <div class="max-w-md mx-auto">
          <button
            onclick="savePackageToDatabase()"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg"
          >
            💾 Guardar Paquete
          </button>
        </div>
      </footer>
    </div>
  `;
}

window.loadQuotesForPackage = async () => {
  try {
    const quotes = await window.Storage.getQuotes(100, 0);
    window.packageState.quotes = quotes;
    window.packageState.loading = false;
    renderPackage();
  } catch (error) {
    console.error('Error cargando cotizaciones:', error);
    window.packageState.loading = false;
    renderPackage();
  }
};

window.toggleQuoteSelection = (quoteId) => {
  const state = window.packageState;
  const index = state.selectedQuotes.indexOf(quoteId);
  
  if (index > -1) {
    state.selectedQuotes.splice(index, 1);
  } else {
    state.selectedQuotes.push(quoteId);
  }
  
  renderPackage();
};

window.goToPackageStep2 = () => {
  window.packageState.step = 2;
  window.packageState.results = null;
  renderPackage();
};

window.backToPackageStep1 = () => {
  window.packageState.step = 1;
  renderPackage();
};

window.calculatePackageResults = () => {
  const state = window.packageState;
  const selectedQuoteObjects = state.quotes.filter(q => state.selectedQuotes.includes(q.id));
  
  const results = window.Calculations.calculatePackage(
    selectedQuoteObjects.map(q => ({ quote: q })),
    state.logistics,
    state.profitMargin
  );
  
  state.results = results;
};

window.updatePackageLogistics = (key, value) => {
  window.packageState.logistics[key] = value;
  window.packageState.results = null;
  renderPackage();
};

window.selectPackageMargin = (margin) => {
  window.packageState.profitMargin = margin;
  window.packageState.manualPrice = null;
  window.packageState.results = null;
  renderPackage();
};

window.updateManualPackagePrice = (value) => {
  window.packageState.manualPrice = value ? parseFloat(value) : null;
  renderPackage();
};

window.renderPackage = () => {
  const root = document.getElementById('root');
  root.innerHTML = PackageCalculator();
};

window.savePackageToDatabase = async () => {
  const state = window.packageState;
  const r = state.results;
  
  const packageName = prompt('Nombre del paquete:', 'Pack ' + new Date().toLocaleDateString());
  if (!packageName) return;

  try {
    const packageData = {
      packageName,
      clientName: null,
      quoteIds: state.selectedQuotes,
      packageLogistics: state.logistics,
      individualTotal: r.individualTotal,
      totalProductionCosts: r.totalProductionCosts,
      logisticsCosts: r.logisticsCosts,
      baseCost: r.baseCost,
      finalPrice: state.manualPrice || r.finalPrice,
      profitMargin: state.profitMargin,
      netProfit: (state.manualPrice || r.finalPrice) - r.baseCost,
      pricingSuggestions: r.pricingSuggestions
    };

    await window.Storage.savePackage(packageData);
    
    window.showSuccessNotification('✅ Paquete guardado correctamente');
    
    setTimeout(() => {
      delete window.packageState;
      navigateTo('home');
    }, 1500);

  } catch (error) {
    alert('Error guardando paquete: ' + error.message);
  }
};

// ============================================
// EXPORT
// ============================================

window.Components = {
  HomeScreen,
  Calculator,
  History,
  PackageCalculator
};

console.log('✅ Components loaded');