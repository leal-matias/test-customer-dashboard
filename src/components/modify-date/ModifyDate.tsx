import { useState, useMemo } from "react";

type Step = "step-1" | "step-2" | "step-confirm";
type BillingOption = "next-month" | "this-month";

interface ModifyDateProps {
  onClose: () => void;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const MONTHS_LOWER = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const DAYS_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function formatDate(date: Date): string {
  return `${DAYS_NAMES[date.getDay()]} ${date.getDate()} de ${
    MONTHS_LOWER[date.getMonth()]
  }`;
}

function ModifyDate({ onClose }: ModifyDateProps) {
  const [currentStep, setCurrentStep] = useState<Step>("step-1");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [billingOption, setBillingOption] =
    useState<BillingOption>("next-month");
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDay = today.getDate();

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  }, [year, month]);

  const selectedDate = useMemo(() => {
    if (selectedDay === null) return null;
    return new Date(year, month, selectedDay);
  }, [selectedDay, year, month]);

  const showBillingOption = selectedDay !== null && selectedDay > todayDay;

  const goBack = () => {
    if (currentStep === "step-2") setCurrentStep("step-1");
    else if (currentStep === "step-confirm") setCurrentStep("step-2");
    else onClose();
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isPaymentFilled = () => {
    return (
      formData.cardHolder.trim().length > 0 &&
      formData.cardNumber.trim().length >= 8 &&
      formData.cardExpiry.trim().length >= 4 &&
      formData.cardCvv.trim().length >= 3
    );
  };

  const getBillingOptionText = () => {
    if (billingOption === "next-month") {
      return "Desde el próximo mes (sin cobro extra ahora)";
    }
    return "Este mes (se genera un cobro extra y recibís doble café)";
  };

  // Step 1: Elegir nueva fecha
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
              MODIFICAR FECHA
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
              Paso 1 de 2
            </p>
            <h1 className="text-base font-semibold m-0 mb-1.5">
              Elegí tu nueva fecha de entrega
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Podés cambiar la fecha en la que querés recibir tu café. Después
              vas a confirmar el cambio ingresando tu método de pago.
            </p>

            {/* Próxima entrega actual */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Próxima entrega actual
              </div>
              <p className="text-[0.95rem] font-semibold m-0 mb-1 text-[#111]">
                Jueves 12 de diciembre
              </p>
              <p className="text-[0.8rem] text-[#5C574F] m-0">
                Retiro en Ciudad Vieja
              </p>
            </div>

            {/* Nueva fecha de entrega - Calendario */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Nueva fecha de entrega
              </div>

              <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                Seleccioná un día del mes
              </label>
              <p className="text-[0.75rem] text-[#8B8478] m-0 mb-2">
                {MONTHS[month]} {year}
              </p>

              {/* Calendario */}
              <div className="grid grid-cols-7 gap-1 mt-1">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[0.7rem] font-semibold text-[#9A9388] py-1.5 uppercase"
                  >
                    {day}
                  </div>
                ))}

                {/* Espacios vacíos al inicio */}
                {Array.from({ length: calendarData.firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: calendarData.daysInMonth }).map(
                  (_, i) => {
                    const day = i + 1;
                    const isToday = day === todayDay;
                    const isSelected = day === selectedDay;

                    if (isToday) {
                      return (
                        <div
                          key={day}
                          className="aspect-square flex flex-col items-center justify-center rounded-lg text-[0.85rem] bg-[#EEE9E0] text-[#5C574F] border border-[#D6D0C7] min-h-[44px] p-1"
                        >
                          <span className="leading-none">{day}</span>
                          <span className="block mt-0.5 text-[0.65rem] uppercase tracking-wide text-[#8B8478]">
                            Hoy
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDay(day);
                          if (day < todayDay) {
                            setBillingOption("next-month");
                          }
                        }}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[0.85rem] cursor-pointer border transition-all duration-150 min-h-[44px] p-1 ${
                          isSelected
                            ? "bg-[#111] text-white font-semibold border-[#111]"
                            : "bg-[#F9F8F6] text-[#111] border-transparent hover:bg-[#F0EDE8]"
                        }`}
                      >
                        <span className="leading-none">{day}</span>
                      </button>
                    );
                  }
                )}
              </div>

              <p className="text-[0.75rem] text-[#8B8478] mt-3 m-0 leading-[1.4]">
                La fecha que elijas va a ser la nueva fecha de entrega de tu
                suscripción. Si es un día anterior al de hoy, el cambio aplica
                para el próximo mes.
              </p>

              {selectedDay !== null && selectedDay < todayDay && (
                <p className="text-[0.75rem] text-[#8B8478] mt-2 m-0">
                  Como elegiste un día anterior a hoy, el cambio se va a aplicar
                  a partir del próximo mes.
                </p>
              )}
            </div>

            {/* Opción de facturación */}
            {showBillingOption && (
              <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
                <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                  ¿Desde cuándo aplicar el cambio?
                </div>

                <label
                  className={`flex gap-2 items-start text-[0.8rem] text-[#5C574F] cursor-pointer p-2 rounded-lg border mb-2.5 ${
                    billingOption === "next-month"
                      ? "border-[#111] bg-[#F9F8F6]"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="billing-option"
                    value="next-month"
                    checked={billingOption === "next-month"}
                    onChange={() => setBillingOption("next-month")}
                    className="mt-0.5 accent-[#111]"
                  />
                  <span>
                    <span className="font-semibold block mb-0.5">
                      A partir del próximo mes
                    </span>
                    <span className="text-[#8B8478] text-[0.75rem] leading-[1.4]">
                      No generamos un cobro extra este mes. La nueva fecha va a
                      aplicar desde el próximo ciclo.
                    </span>
                  </span>
                </label>

                <label
                  className={`flex gap-2 items-start text-[0.8rem] text-[#5C574F] cursor-pointer p-2 rounded-lg border ${
                    billingOption === "this-month"
                      ? "border-[#111] bg-[#F9F8F6]"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="billing-option"
                    value="this-month"
                    checked={billingOption === "this-month"}
                    onChange={() => setBillingOption("this-month")}
                    className="mt-0.5 accent-[#111]"
                  />
                  <span>
                    <span className="font-semibold block mb-0.5">
                      Aplicar a este mes
                    </span>
                    <span className="text-[#8B8478] text-[0.75rem] leading-[1.4]">
                      Vamos a generar un nuevo cobro y vas a recibir doble café
                      este mes.
                    </span>
                  </span>
                </label>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => setCurrentStep("step-2")}
                disabled={selectedDay === null}
                className={`w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer ${
                  selectedDay !== null
                    ? "bg-[#111] text-white"
                    : "bg-[#C4C0B9] text-white cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                Primero elegí la nueva fecha. En el siguiente paso vas a
                confirmar el método de pago.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Step 2: Confirmar método de pago
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
              MODIFICAR FECHA
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
              Paso 2 de 2
            </p>
            <h1 className="text-base font-semibold m-0 mb-1.5">
              Confirmá tu próxima entrega
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Revisá el resumen y elegí el método de pago para esta próxima
              entrega.
            </p>

            {/* Resumen */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Resumen de tu próxima entrega
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
                <span className="text-[0.8rem] text-[#5C574F]">Plan</span>
                <span className="text-[0.85rem] font-semibold">
                  Plan Brasil
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
                <span className="text-[0.8rem] text-[#5C574F]">
                  Configuración
                </span>
                <span className="text-[0.85rem] font-semibold">
                  2 bolsas de 250 g · En grano
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
                <span className="text-[0.8rem] text-[#5C574F]">
                  Forma de entrega
                </span>
                <span className="text-[0.85rem] font-semibold">
                  Retiro en Ciudad Vieja
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
                <span className="text-[0.8rem] text-[#5C574F]">
                  Nueva fecha
                </span>
                <span className="text-[0.85rem] font-semibold">
                  {selectedDate ? formatDate(selectedDate) : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[0.8rem] text-[#5C574F]">
                  Aplicación del cambio
                </span>
                <span className="text-[0.85rem] font-semibold">
                  {getBillingOptionText()}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
              <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
                Método de pago
              </div>

              <div className="mb-2.5">
                <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                  Titular de la tarjeta
                </label>
                <input
                  type="text"
                  placeholder="Como figura en la tarjeta"
                  value={formData.cardHolder}
                  onChange={handleInputChange("cardHolder")}
                  className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2 px-2.5 text-[0.9rem] text-[#111] outline-none focus:border-[#111]"
                />
              </div>

              <div className="mb-2.5">
                <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="•••• •••• •••• ••••"
                  value={formData.cardNumber}
                  onChange={handleInputChange("cardNumber")}
                  className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2 px-2.5 text-[0.9rem] text-[#111] outline-none focus:border-[#111]"
                />
              </div>

              <div className="mb-2.5">
                <label className="block text-[0.78rem] font-medium text-[#5C574F] mb-1">
                  Vencimiento
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM / AA"
                  value={formData.cardExpiry}
                  onChange={handleInputChange("cardExpiry")}
                  className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2 px-2.5 text-[0.9rem] text-[#111] outline-none focus:border-[#111]"
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
                  placeholder="CVV"
                  value={formData.cardCvv}
                  onChange={handleInputChange("cardCvv")}
                  className="w-full rounded-lg border border-[#DAD4C8] bg-white py-2 px-2.5 text-[0.9rem] text-[#111] outline-none focus:border-[#111]"
                />
              </div>

              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                Tus datos de pago se guardan de forma segura solo para los
                cobros de tu suscripción.
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setCurrentStep("step-confirm")}
                disabled={!isPaymentFilled()}
                className={`w-full rounded-full py-[11px] px-4 text-[0.9rem] font-semibold border-none cursor-pointer ${
                  isPaymentFilled()
                    ? "bg-[#111] text-white"
                    : "bg-[#C4C0B9] text-white cursor-not-allowed"
                }`}
              >
                Confirmar cambio de fecha
              </button>
              <p className="text-[0.75rem] text-[#8B8478] text-center mt-2">
                Vamos a procesar el cobro según la opción que elegiste y con la
                nueva fecha de entrega.
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
            MODIFICAR FECHA
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
              ¡Nueva fecha confirmada!
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 text-center">
              Actualizamos la próxima entrega de tu suscripción con la fecha que
              elegiste.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
              Resumen de tu próxima entrega
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">Fecha</span>
              <span className="text-[0.85rem] font-semibold">
                {selectedDate ? formatDate(selectedDate) : "—"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">
                Forma de entrega
              </span>
              <span className="text-[0.85rem] font-semibold">
                Retiro en Ciudad Vieja
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[0.8rem] text-[#5C574F]">
                Método de pago
              </span>
              <span className="text-[0.85rem] font-semibold">
                Tarjeta terminada en •••• 1234
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
        </main>
      </div>
    </div>
  );
}

export default ModifyDate;
