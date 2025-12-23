import { useState } from "react";
import PageWrapper from "../common/PageWrapper";

type Step = "reactivar" | "delivery" | "payment" | "confirm" | "payment-confirm";
type ReactivationOption = "charge-now" | "keep-date";
type DeliveryOption = "envio" | "retiro";

interface ReactivatePlanProps {
  onClose: () => void;
  onChangePlan?: () => void;
}

interface Store {
  id: string;
  nombre: string;
  direccion: string;
}

interface Address {
  departamento: string;
  direccion: string;
  apartamento: string;
  barrio: string;
  codigoPostal: string;
}

const STORES: Store[] = [
  { id: "ciudad-vieja", nombre: "Ciudad Vieja", direccion: "Sarandí 473" },
  { id: "epa", nombre: "Epa", direccion: "Constituyente 2045" },
  { id: "tostaduria", nombre: "Tostaduría", direccion: "Rivera 3220" },
  { id: "punta-carretas", nombre: "Punta Carretas", direccion: "José Ellauri 350" },
];

const DEPARTAMENTOS = ["Montevideo", "Canelones", "Maldonado"];
const BARRIOS = ["Pocitos", "Centro", "Ciudad Vieja"];
const CODIGOS_POSTALES = ["11300", "11000"];

function ReactivatePlan({ onClose, onChangePlan }: ReactivatePlanProps) {
  const [currentStep, setCurrentStep] = useState<Step>("reactivar");
  const [selectedOption, setSelectedOption] =
    useState<ReactivationOption>("charge-now");

  // Delivery form state
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("envio");
  const [selectedStore, setSelectedStore] = useState("ciudad-vieja");
  const [address, setAddress] = useState<Address>({
    departamento: "Montevideo",
    direccion: "Rivera 1234",
    apartamento: "Apto 101",
    barrio: "Pocitos",
    codigoPostal: "11300",
  });

  // Payment form state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const getDeliveryDetails = () => {
    if (deliveryOption === "envio") {
      return {
        forma: "Envío a domicilio",
        detalle: `${address.direccion}, ${address.barrio}, ${address.departamento}`,
      };
    } else {
      const store = STORES.find((s) => s.id === selectedStore);
      return {
        forma: "Retiro en local",
        detalle: store ? `${store.nombre} - ${store.direccion}` : "",
      };
    }
  };

  const goBack = () => {
    if (currentStep === "delivery") {
      setCurrentStep("reactivar");
    } else if (currentStep === "payment") {
      setCurrentStep("delivery");
    } else if (currentStep === "payment-confirm") {
      // No back from success
    } else if (currentStep === "confirm") {
      // No back from success
    } else {
      onClose();
    }
  };

  const handleConfirmReactivation = () => {
    setCurrentStep("delivery");
  };

  const handleConfirmDelivery = () => {
    if (selectedOption === "keep-date") {
      setCurrentStep("confirm");
    } else {
      setCurrentStep("payment");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    setCurrentStep("payment-confirm");
  };

  // Step 1: Confirmar reactivación
  if (currentStep === "reactivar") {
    return (
      <PageWrapper title="REACTIVAR PLAN" onBack={goBack} onClose={onClose}>
        <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
          Paso 1 de {selectedOption === "charge-now" ? "3" : "2"}
        </p>
        <h1 className="text-base font-semibold m-0 mb-1.5">Reactivar mi plan</h1>
        <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
          Elegí cómo querés retomar tu suscripción.
        </p>

        {/* Plan y configuración actual */}
        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Plan y configuración actual
          </div>
          <p className="text-[0.95rem] font-semibold m-0 mb-1 text-[#111]">
            Plan Brasil
          </p>
          <p className="text-[0.8rem] text-[#5C574F] m-0">
            2 bolsas de 250 g · En grano
          </p>
        </div>

        {/* Cobro y entrega */}
        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Cobro y entrega
          </div>

          <p className="text-xs tracking-wide uppercase text-[#9A9388] m-0 mb-1">
            Próxima fecha de cobro
          </p>
          <p className="text-[0.95rem] font-semibold m-0 mb-3 text-[#111]">
            10 de cada mes
          </p>

          <p className="text-xs tracking-wide uppercase text-[#9A9388] m-0 mb-1">
            Próxima entrega estimada
          </p>
          <p className="text-[0.95rem] font-semibold m-0 mb-3 text-[#111]">
            Jueves 12 de diciembre
          </p>

          <p className="text-xs tracking-wide uppercase text-[#9A9388] m-0 mb-1">
            Forma de entrega
          </p>
          <p className="text-[0.95rem] font-semibold m-0 text-[#111]">
            Retiro en Ciudad Vieja
          </p>
        </div>

        {/* Opciones de reactivación */}
        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Opciones de reactivación
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => setSelectedOption("charge-now")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative transition-all duration-150 ${
                selectedOption === "charge-now"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  selectedOption === "charge-now"
                    ? "border-[6px] border-[#3B82F6]"
                    : "border-2 border-[#D4D0C7]"
                }`}
              />
              <p className="text-[0.9rem] font-semibold m-0 mb-0.5">
                Recibir mi café antes
              </p>
              <p className="text-[0.78rem] text-[#807A70] m-0">
                Pagás hoy y tu próxima entrega se adelanta. Vas a ingresar tu
                método de pago para confirmar el cobro.
              </p>
            </button>

            <button
              onClick={() => setSelectedOption("keep-date")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative transition-all duration-150 ${
                selectedOption === "keep-date"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  selectedOption === "keep-date"
                    ? "border-[6px] border-[#3B82F6]"
                    : "border-2 border-[#D4D0C7]"
                }`}
              />
              <p className="text-[0.9rem] font-semibold m-0 mb-0.5">
                Mantener mi fecha original
              </p>
              <p className="text-[0.78rem] text-[#807A70] m-0">
                Tu plan se reactiva y se cobrará en tu próxima fecha de
                facturación. No se realiza ningún cobro ahora.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleConfirmReactivation}
            className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
          >
            Confirmar reactivación
          </button>
          <p className="text-xs text-[#8B8478] text-center mt-2">
            Podés modificar tu plan, entrega o método de pago cuando quieras.
          </p>
          <button
            onClick={onChangePlan}
            className="text-[0.8rem] text-[#5C574F] text-center mt-3 underline cursor-pointer border-none bg-transparent block w-full"
          >
            Prefiero cambiar de plan
          </button>
          <button
            onClick={onClose}
            className="text-[0.8rem] text-[#5C574F] text-center mt-3 underline cursor-pointer border-none bg-transparent block w-full"
          >
            Cancelar
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Step 2: Elegir forma de entrega
  if (currentStep === "delivery") {
    const footnoteText =
      deliveryOption === "envio"
        ? "Este cambio impacta en tu próxima entrega programada a domicilio."
        : "Este cambio impacta en tu próxima entrega para retiro en el local seleccionado.";

    return (
      <PageWrapper title="REACTIVAR PLAN" onBack={goBack} onClose={onClose}>
        <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
          Paso 2 de {selectedOption === "charge-now" ? "3" : "2"}
        </p>
        <h1 className="text-base font-semibold m-0 mb-1.5">
          Elegí tu forma de entrega
        </h1>
        <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
          Elegí si querés recibir tu café por envío a domicilio o retirarlo en
          uno de nuestros locales.
        </p>

        {/* Opciones de entrega */}
        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Opciones de entrega
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {/* Envío a domicilio */}
            <button
              onClick={() => setDeliveryOption("envio")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-9 cursor-pointer relative transition-all duration-150 ${
                deliveryOption === "envio"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  deliveryOption === "envio"
                    ? "border-[6px] border-[#3B82F6]"
                    : "border-2 border-[#D4D0C7]"
                }`}
              />
              <p className="text-[0.9rem] font-semibold m-0 mb-0.5 text-[#111]">
                Envío a domicilio
              </p>
              <p className="text-[0.78rem] text-[#807A70] m-0">
                Recibís tu café en la dirección que elijas.
              </p>
            </button>

            {/* Retiro en local */}
            <button
              onClick={() => setDeliveryOption("retiro")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-9 cursor-pointer relative transition-all duration-150 ${
                deliveryOption === "retiro"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  deliveryOption === "retiro"
                    ? "border-[6px] border-[#3B82F6]"
                    : "border-2 border-[#D4D0C7]"
                }`}
              />
              <p className="text-[0.9rem] font-semibold m-0 mb-0.5 text-[#111]">
                Retiro en local
              </p>
              <p className="text-[0.78rem] text-[#807A70] m-0">
                Pasás a buscar tu café por el local que te quede mejor.
              </p>
            </button>
          </div>
        </div>

        {/* Dirección para envío */}
        {deliveryOption === "envio" && (
          <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
              Dirección de entrega
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div>
                <div className="text-xs text-[#877D70] mt-1.5 mb-0.5">
                  Departamento *
                </div>
                <select
                  value={address.departamento}
                  onChange={(e) =>
                    setAddress({ ...address, departamento: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D7D2CA] py-2 px-2.5 text-[0.85rem] bg-[#FBFAF8] outline-none font-[inherit]"
                >
                  <option value="">Seleccioná un departamento</option>
                  {DEPARTAMENTOS.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs text-[#877D70] mt-1.5 mb-0.5">
                  Dirección *
                </div>
                <input
                  type="text"
                  value={address.direccion}
                  onChange={(e) =>
                    setAddress({ ...address, direccion: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D7D2CA] py-2 px-2.5 text-[0.85rem] bg-[#FBFAF8] outline-none font-[inherit]"
                />
              </div>

              <div>
                <div className="text-xs text-[#877D70] mt-1.5 mb-0.5">
                  Apartamento (opcional)
                </div>
                <input
                  type="text"
                  value={address.apartamento}
                  onChange={(e) =>
                    setAddress({ ...address, apartamento: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D7D2CA] py-2 px-2.5 text-[0.85rem] bg-[#FBFAF8] outline-none font-[inherit]"
                />
              </div>

              <div>
                <div className="text-xs text-[#877D70] mt-1.5 mb-0.5">
                  Barrio *
                </div>
                <select
                  value={address.barrio}
                  onChange={(e) =>
                    setAddress({ ...address, barrio: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D7D2CA] py-2 px-2.5 text-[0.85rem] bg-[#FBFAF8] outline-none font-[inherit]"
                >
                  <option value="">Seleccioná un barrio</option>
                  {BARRIOS.map((barrio) => (
                    <option key={barrio} value={barrio}>
                      {barrio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs text-[#877D70] mt-1.5 mb-0.5">
                  Código postal *
                </div>
                <select
                  value={address.codigoPostal}
                  onChange={(e) =>
                    setAddress({ ...address, codigoPostal: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D7D2CA] py-2 px-2.5 text-[0.85rem] bg-[#FBFAF8] outline-none font-[inherit]"
                >
                  <option value="">Seleccioná un código postal</option>
                  {CODIGOS_POSTALES.map((cp) => (
                    <option key={cp} value={cp}>
                      {cp}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-[#8B8478] mt-1 mb-0">
                Esta será la dirección para tu próxima entrega.
              </p>
            </div>
          </div>
        )}

        {/* Selección de local para retiro */}
        {deliveryOption === "retiro" && (
          <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
              Local para retirar
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  className={`w-full text-left rounded-[10px] border bg-white py-2 px-2.5 pl-8 cursor-pointer relative transition-all duration-150 ${
                    selectedStore === store.id
                      ? "border-[#111] shadow-[0_0_0_1px_#111]"
                      : "border-[#E0DED9]"
                  }`}
                >
                  <div
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white transition-all duration-150 ${
                      selectedStore === store.id
                        ? "border-[6px] border-[#3B82F6]"
                        : "border-2 border-[#D4D0C7]"
                    }`}
                  />
                  <p className="text-[0.85rem] font-semibold m-0 mb-0.5 text-[#111]">
                    {store.nombre}
                  </p>
                  <p className="text-[0.78rem] text-[#807A70] m-0">
                    {store.direccion}
                  </p>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#8B8478] mt-2 mb-0">
              Este será el local donde vas a retirar tu próxima entrega.
            </p>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleConfirmDelivery}
            className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
          >
            Continuar
          </button>
          <p className="text-xs text-[#8B8478] text-center mt-2">
            {footnoteText}
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Step 3: Ingresar método de pago (solo si eligió "charge-now")
  if (currentStep === "payment") {
    return (
      <PageWrapper title="REACTIVAR PLAN" onBack={goBack} onClose={onClose}>
        <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#9A9388] mt-1.5 mb-0.5">
          Paso 3 de 3
        </p>
        <h1 className="text-base font-semibold m-0 mb-1.5">
          Ingresar método de pago
        </h1>
        <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
          Vamos a cobrar hoy tu suscripción para adelantar tu próxima entrega.
          Después, tu plan sigue con la misma fecha de cobro de siempre.
        </p>

        {/* Resumen de pago */}
        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Resumen de tu pago de hoy
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[0.8rem] text-[#5C574F]">Plan</span>
            <span className="text-[0.8rem] text-[#111]">Plan Brasil</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[0.8rem] text-[#5C574F]">Monto a cobrar</span>
            <span className="text-[0.8rem] text-[#111]">$ 1.290</span>
          </div>
        </div>

        {/* Formulario de pago */}
        <form onSubmit={handlePaymentSubmit}>
          <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
              Método de pago
            </div>

            <div className="mb-2.5">
              <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                Titular de la tarjeta
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Como figura en la tarjeta"
                className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2.5 px-2.5 text-[0.9rem] outline-none focus:border-[#111]"
              />
            </div>

            <div className="mb-2.5">
              <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="•••• •••• •••• ••••"
                className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2.5 px-2.5 text-[0.9rem] outline-none focus:border-[#111]"
              />
            </div>

            <div className="mb-2.5">
              <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                Vencimiento
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM / AA"
                className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2.5 px-2.5 text-[0.9rem] outline-none focus:border-[#111]"
              />
            </div>

            <div className="mb-2.5">
              <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                Código de seguridad
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="CVV"
                className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2.5 px-2.5 text-[0.9rem] outline-none focus:border-[#111]"
              />
            </div>

            <p className="text-xs text-[#8B8478] text-center mt-2">
              Tus datos de pago se guardan de forma segura solo para los cobros
              de tu suscripción.
            </p>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
            >
              Confirmar pago y reactivar plan
            </button>
            <p className="text-xs text-[#8B8478] mt-3 leading-[1.4]">
              Se va a cobrar hoy el monto de tu plan. Si el pago es aprobado, tu
              próxima entrega se adelanta automáticamente.
            </p>
          </div>
        </form>
      </PageWrapper>
    );
  }

  // Step 3: Reactivación exitosa (mantener fecha)
  if (currentStep === "confirm") {
    const deliveryDetails = getDeliveryDetails();

    return (
      <PageWrapper title="REACTIVAR PLAN" onClose={onClose}>
        <div className="text-center py-5 pb-4">
          <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            ✓
          </div>
          <h1 className="text-base font-semibold m-0 mb-1.5 text-center">
            Tu suscripción fue reactivada
          </h1>
          <p className="text-[0.8rem] text-[#807A70] m-0 text-center">
            A partir de tu próximo ciclo vas a volver a recibir tu café con este
            plan.
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Resumen de tu suscripción
          </div>

          <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
            <span className="text-[0.8rem] text-[#5C574F]">Plan</span>
            <span className="text-[0.85rem] font-semibold">Plan Brasil</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
            <span className="text-[0.8rem] text-[#5C574F]">Configuración</span>
            <span className="text-[0.85rem] font-semibold">
              2 bolsas de 250 g · En grano
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
            <span className="text-[0.8rem] text-[#5C574F]">
              Forma de entrega
            </span>
            <span className="text-[0.85rem] font-semibold text-right">
              {deliveryDetails.forma}
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-[0.8rem] text-[#5C574F]">
              {deliveryOption === "envio" ? "Dirección" : "Local"}
            </span>
            <span className="text-[0.85rem] font-semibold text-right max-w-[60%]">
              {deliveryDetails.detalle}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
          >
            Volver a Mi suscripción
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Step 4: Pago confirmado
  const deliveryDetails = getDeliveryDetails();

  return (
    <PageWrapper title="REACTIVAR PLAN" onClose={onClose}>
      <div className="text-center py-5 pb-4">
        <div className="w-[60px] h-[60px] bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3.5 text-[1.6rem]">
          ✓
        </div>
        <h1 className="text-base font-semibold m-0 mb-1.5 text-center">
          Tu suscripción fue reactivada
        </h1>
        <p className="text-[0.8rem] text-[#807A70] m-0 text-center">
          Procesamos el pago de hoy. Tu próxima entrega se adelantó y después tu
          plan vuelve a cobrarse en tu fecha habitual.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 px-4.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mt-2.5">
        <div className="text-[0.78rem] font-semibold tracking-[0.10em] uppercase text-[#B0A99C] mb-2.5">
          Resumen de tu suscripción
        </div>

        <div className="flex justify-between py-2 border-t border-[#EFEAE2] text-[0.82rem] text-[#5C574F]">
          <span>Plan</span>
          <span className="font-semibold text-[#111] text-right ml-3">
            Plan Brasil
          </span>
        </div>

        <div className="flex justify-between py-2 border-t border-[#EFEAE2] text-[0.82rem] text-[#5C574F]">
          <span>Configuración</span>
          <span className="font-semibold text-[#111] text-right ml-3">
            2 bolsas de 250 g · En grano
          </span>
        </div>

        <div className="flex justify-between py-2 border-t border-[#EFEAE2] text-[0.82rem] text-[#5C574F]">
          <span>Forma de entrega</span>
          <span className="font-semibold text-[#111] text-right ml-3">
            {deliveryDetails.forma}
          </span>
        </div>

        <div className="flex justify-between py-2 border-t border-[#EFEAE2] text-[0.82rem] text-[#5C574F]">
          <span>{deliveryOption === "envio" ? "Dirección" : "Local"}</span>
          <span className="font-semibold text-[#111] text-right ml-3 max-w-[55%]">
            {deliveryDetails.detalle}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={onClose}
          className="w-full rounded-full py-3.5 px-4 text-[0.95rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
        >
          Volver a Mi suscripción
        </button>
      </div>
    </PageWrapper>
  );
}

export default ReactivatePlan;

