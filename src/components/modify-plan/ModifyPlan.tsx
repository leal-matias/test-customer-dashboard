import { useState } from "react";

type Step = "step-1" | "step-2" | "step-3" | "step-confirm";

interface Plan {
  id: string;
  name: string;
  description: string;
}

interface Quantity {
  value: string;
  label: string;
  description: string;
}

interface Grind {
  value: string;
  description?: string;
}

interface ModifyPlanProps {
  onClose: () => void;
  /** Si es true, saltea el paso 1 (selección de plan) y muestra solo 2 pasos */
  skipPlanSelection?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "brasil",
    name: "Plan Brasil",
    description: "Solo cafés de Brasil, ideal para métodos filtrados.",
  },
  {
    id: "mundial",
    name: "Plan Mundial",
    description: "Orígenes rotativos de Latinoamérica y África.",
  },
  {
    id: "mix",
    name: "Plan Mix",
    description: "Combinación de cafés clásicos y experimentales.",
  },
  {
    id: "oficina",
    name: "Plan Oficina",
    description: "Pensado para equipos: más cantidad a mejor precio.",
  },
  {
    id: "decaf",
    name: "Plan Decaf",
    description: "Café sin cafeína, sin sacrificar sabor ni calidad.",
  },
];

const QUANTITIES: Quantity[] = [
  {
    value: "2",
    label: "2 bolsas de 250 g",
    description: "Ideal para 2–3 personas que toman a diario.",
  },
  {
    value: "4",
    label: "4 bolsas de 250 g",
    description: "Para equipos pequeños o cafecito intenso todo el mes.",
  },
  {
    value: "6",
    label: "6 bolsas de 250 g",
    description: "Pensado para grandes coffee lovers o Plan Oficina.",
  },
];

const GRINDS: Grind[] = [
  {
    value: "En grano",
    description: "La opción más fresca. Molés justo antes de preparar.",
  },
  { value: "Aeropress" },
  { value: "Cold Brew" },
  { value: "Espresso" },
  { value: "Filtrado" },
];

// Plan por defecto cuando se usa "Modificar plan"
const DEFAULT_PLAN = PLANS[0]; // Plan Brasil

function ModifyPlan({ onClose, skipPlanSelection = false }: ModifyPlanProps) {
  // Si skipPlanSelection, empezamos en step-2 con el plan por defecto
  const [currentStep, setCurrentStep] = useState<Step>(
    skipPlanSelection ? "step-2" : "step-1"
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    skipPlanSelection ? DEFAULT_PLAN : null
  );
  const [selectedQty, setSelectedQty] = useState<Quantity>(QUANTITIES[0]);
  const [selectedGrind, setSelectedGrind] = useState<Grind>(GRINDS[0]);

  // Título del header según el modo
  const headerTitle = skipPlanSelection ? "MODIFICAR PLAN" : "NUEVO PLAN";

  // Total de pasos según el modo
  const totalSteps = skipPlanSelection ? 2 : 3;

  // Obtener el número de paso a mostrar
  const getStepLabel = (step: Step): string => {
    if (skipPlanSelection) {
      // En modo "Modificar plan": step-2 = Paso 1, step-3 = Paso 2
      if (step === "step-2") return `Paso 1 de ${totalSteps}`;
      if (step === "step-3") return `Paso 2 de ${totalSteps}`;
    } else {
      // En modo "Cambiar de plan": step-1 = Paso 1, step-2 = Paso 2, step-3 = Paso 3
      if (step === "step-1") return `Paso 1 de ${totalSteps}`;
      if (step === "step-2") return `Paso 2 de ${totalSteps}`;
      if (step === "step-3") return `Paso 3 de ${totalSteps}`;
    }
    return "";
  };

  const goBack = () => {
    if (currentStep === "step-2") {
      // Si saltamos el paso 1, volver cierra el flujo
      if (skipPlanSelection) {
        onClose();
      } else {
        setCurrentStep("step-1");
      }
    } else if (currentStep === "step-3") {
      setCurrentStep("step-2");
    } else if (currentStep === "step-confirm") {
      setCurrentStep("step-3");
    } else {
      onClose();
    }
  };

  // Step 1: Elegir plan
  if (currentStep === "step-1") {
    return (
      <div className="m-0 font-sans bg-[#f7f5f3] text-[#111] antialiased min-h-screen py-3 px-4 pb-8">
        <div className="max-w-[480px] mx-auto">
          <header className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center min-w-[40px]">
              <button
                onClick={goBack}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Volver"
              >
                ←
              </button>
            </div>
            <div className="flex-1 text-center text-[0.95rem] font-semibold tracking-[0.08em] uppercase">
              {headerTitle}
            </div>
            <div className="flex items-center min-w-[40px] justify-end">
              <button
                onClick={onClose}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
          </header>

          <main>
            <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
              {getStepLabel("step-1")}
            </p>
            <h1 className="text-base font-semibold m-0 mb-1.5">
              Elegí tu nuevo plan
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Podés cambiar de plan y luego ajustar cantidad, molienda y forma
              de entrega antes de confirmar.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative transition-all duration-150 ${
                      isSelected
                        ? "border-[#111] shadow-[0_0_0_1px_#111]"
                        : "border-[#E0DED9]"
                    }`}
                  >
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                        isSelected
                          ? "border-[6px] border-[#3B82F6]"
                          : "border-2 border-[#D4D0C7]"
                      }`}
                    />
                    <p className="text-[0.9rem] font-semibold m-0 mb-0.5">
                      {plan.name}
                    </p>
                    <p className="text-[0.78rem] text-[#807A70] m-0">
                      {plan.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setCurrentStep("step-2")}
                disabled={!selectedPlan}
                className={`w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer ${
                  selectedPlan
                    ? "bg-[#111] text-white"
                    : "bg-[#C4C0B9] text-white cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                En el próximo paso vas a elegir cantidad y molienda. No se va a
                cobrar nada todavía.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Step 2: Cantidad y molienda
  if (currentStep === "step-2") {
    return (
      <div className="m-0 font-sans bg-[#f7f5f3] text-[#111] antialiased min-h-screen py-3 px-4 pb-8">
        <div className="max-w-[480px] mx-auto">
          <header className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center min-w-[40px]">
              <button
                onClick={goBack}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Volver"
              >
                ←
              </button>
            </div>
            <div className="flex-1 text-center text-[0.95rem] font-semibold tracking-[0.08em] uppercase">
              {headerTitle}
            </div>
            <div className="flex items-center min-w-[40px] justify-end">
              <button
                onClick={onClose}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
          </header>

          <main>
            <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
              {getStepLabel("step-2")}
            </p>
            <h1 className="text-base font-semibold m-0 mb-1.5">
              {skipPlanSelection ? "Ajustá tu plan actual" : "Ajustá tu plan"}
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Elegí cuántas bolsas querés recibir y cómo querés el café.
            </p>

            {/* Plan elegido - solo mostrar si NO se saltea el paso 1 */}
            {!skipPlanSelection && (
              <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
                <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                  Plan elegido
                </div>
                <p className="text-[0.95rem] font-semibold m-0 mb-1 text-[#111]">
                  {selectedPlan?.name}
                </p>
                <p className="text-[0.8rem] text-[#5C574F] m-0">
                  Más adelante vas a poder cambiarlo otra vez si querés.
                </p>
              </div>
            )}

            {/* Cantidad */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Cantidad
              </div>
              <p className="text-[0.8rem] text-[#5C574F] m-0 mb-2">
                Elegí cuántas bolsas de 250 g querés en cada ciclo.
              </p>

              <div className="flex flex-col gap-2">
                {QUANTITIES.map((qty) => {
                  const isSelected = selectedQty.value === qty.value;
                  return (
                    <button
                      key={qty.value}
                      onClick={() => setSelectedQty(qty)}
                      className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative transition-all duration-150 ${
                        isSelected
                          ? "border-[#111] shadow-[0_0_0_1px_#111]"
                          : "border-[#E0DED9]"
                      }`}
                    >
                      <span
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                          isSelected
                            ? "border-[6px] border-[#3B82F6]"
                            : "border-2 border-[#D4D0C7]"
                        }`}
                      />
                      <p className="text-[0.9rem] font-semibold m-0 mb-0.5">
                        {qty.label}
                      </p>
                      <p className="text-[0.78rem] text-[#807A70] m-0">
                        {qty.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Molienda */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Molienda
              </div>
              <p className="text-[0.8rem] text-[#5C574F] m-0 mb-2">
                Podés cambiarla cuando quieras según el método que estés usando.
              </p>

              <div className="flex flex-col gap-2">
                {GRINDS.map((grind) => {
                  const isSelected = selectedGrind.value === grind.value;
                  return (
                    <button
                      key={grind.value}
                      onClick={() => setSelectedGrind(grind)}
                      className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative transition-all duration-150 ${
                        isSelected
                          ? "border-[#111] shadow-[0_0_0_1px_#111]"
                          : "border-[#E0DED9]"
                      }`}
                    >
                      <span
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                          isSelected
                            ? "border-[6px] border-[#3B82F6]"
                            : "border-2 border-[#D4D0C7]"
                        }`}
                      />
                      <p className="text-[0.9rem] font-semibold m-0 mb-0.5">
                        {grind.value}
                      </p>
                      {grind.description && (
                        <p className="text-[0.78rem] text-[#807A70] m-0">
                          {grind.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setCurrentStep("step-3")}
                className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
              >
                Continuar
              </button>
              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                En el próximo paso vas a revisar el resumen antes de confirmar.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Step 3: Resumen
  if (currentStep === "step-3") {
    return (
      <div className="m-0 font-sans bg-[#f7f5f3] text-[#111] antialiased min-h-screen py-3 px-4 pb-8">
        <div className="max-w-[480px] mx-auto">
          <header className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center min-w-[40px]">
              <button
                onClick={goBack}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Volver"
              >
                ←
              </button>
            </div>
            <div className="flex-1 text-center text-[0.95rem] font-semibold tracking-[0.08em] uppercase">
              {headerTitle}
            </div>
            <div className="flex items-center min-w-[40px] justify-end">
              <button
                onClick={onClose}
                className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
          </header>

          <main>
            <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
              {getStepLabel("step-3")}
            </p>
            <h1 className="text-base font-semibold m-0 mb-1.5">
              {skipPlanSelection ? "Revisá los cambios" : "Revisá tu nuevo plan"}
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Este es el resumen final. Confirmá para actualizar tu suscripción.
            </p>

            {/* Plan */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Plan
              </div>
              <p className="text-[0.95rem] font-semibold m-0 mb-1 text-[#111]">
                {selectedPlan?.name}
              </p>
              <p className="text-[0.8rem] text-[#5C574F] m-0">
                Este será tu nuevo origen y perfil de café.
              </p>
            </div>

            {/* Configuración */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Configuración
              </div>

              <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] m-0 mb-1">
                Cantidad
              </p>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                {selectedQty.label}
              </p>

              <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] m-0 mb-1 mt-3">
                Molienda
              </p>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                {selectedGrind.value}
              </p>

              <p className="text-[0.75rem] text-[#8B8478] mt-3 m-0">
                Siempre vas a poder modificar estos valores desde tu dashboard.
              </p>
            </div>

            {/* Forma de entrega */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Forma de entrega
              </div>

              <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] m-0 mb-1">
                Método
              </p>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                Envío a domicilio
              </p>

              <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] m-0 mb-1 mt-3">
                Dirección
              </p>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                Rivera 1234, Montevideo
              </p>

              <p className="text-[0.75rem] text-[#8B8478] mt-3 m-0">
                Podés cambiarlo siempre desde tu dashboard.
              </p>
            </div>

            {/* Próxima entrega */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Próxima entrega estimada
              </div>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                12 de diciembre
              </p>
              <p className="text-[0.8rem] text-[#5C574F] m-0">
                Se genera automáticamente según la fecha de cobro.
              </p>
            </div>

            {/* Precio */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Precio mensual
              </div>
              <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
                $ 1.290
              </p>
              <p className="text-[0.8rem] text-[#5C574F] m-0">
                No se te va a cobrar nada hasta confirmar el cambio.
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setCurrentStep("step-confirm")}
                className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
              >
                Confirmar cambio
              </button>
              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                No se te va a cobrar nada hasta que confirmes.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Step Confirm: Confirmación final
  return (
    <div className="m-0 font-sans bg-[#f7f5f3] text-[#111] antialiased min-h-screen py-3 px-4 pb-8">
      <div className="max-w-[480px] mx-auto">
        <header className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center min-w-[40px]"></div>
          <div className="flex-1 text-center text-[0.95rem] font-semibold tracking-[0.08em] uppercase">
            {headerTitle}
          </div>
          <div className="flex items-center min-w-[40px] justify-end">
            <button
              onClick={onClose}
              className="bg-transparent border-none p-1 cursor-pointer text-lg leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </header>

        <main>
          <div className="text-center py-5 pb-4">
            <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              ✓
            </div>
            <h1 className="text-base font-semibold m-0 mb-1.5 text-center">
              {skipPlanSelection ? "¡Plan actualizado!" : "¡Cambio confirmado!"}
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 text-center">
              Tu plan se actualizó correctamente. Los cambios se aplicarán
              automáticamente en tus próximas entregas.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
              Resumen de tu nuevo plan
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">Plan</span>
              <span className="text-[0.85rem] font-semibold">
                {selectedPlan?.name}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">Cantidad</span>
              <span className="text-[0.85rem] font-semibold">
                {selectedQty.label}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">Molienda</span>
              <span className="text-[0.85rem] font-semibold">
                {selectedGrind.value}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-[0.8rem] text-[#5C574F]">
                Precio mensual
              </span>
              <span className="text-[0.85rem] font-semibold">$ 1.290</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
            >
              Volver a mi cuenta
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ModifyPlan;
