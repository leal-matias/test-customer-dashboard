import { useState } from "react";
import AccountHelpCharli from "../common/AccountHelpCharli";
import LogoutSection from "../common/LogoutSection";

function PaymentMethod() {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleOpenUpdate = () => {
    setShowUpdateForm(true);
  };

  const handleSaveCard = () => {
    // En producción acá iría la llamada real al backend / pasarela
    setShowSuccessBanner(true);
    setShowUpdateForm(false);
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div>
      <div className="text-base font-medium mb-3">Hola, Danu</div>
      <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

      {/* Banner de éxito */}
      {showSuccessBanner && (
        <section className="rounded-xl py-2.5 px-3 text-[0.8125rem] leading-[1.4] mb-3.5 flex gap-2.5 items-start bg-[#E8F7EC]">
          <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-[#2E7D32]"></div>
          <div>
            <div className="font-semibold uppercase text-xs mb-0.5">
              Método de pago actualizado
            </div>
            <div className="text-[0.8rem] text-[#5C574F]">
              Vamos a usar tu nueva tarjeta para los próximos cobros de tu
              suscripción.
            </div>
          </div>
        </section>
      )}

      {/* Método actual */}
      <section className="bg-white rounded-xl py-3.5 px-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-3 border border-[#EEEAE3]">
        <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
          Método de pago actual
        </div>

        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-[0.95rem] font-semibold m-0 mb-1 text-[#111]">
              Visa •••• 1234
            </p>
            <p className="text-[0.8rem] text-[#5C574F] m-0 leading-[1.5]">
              Este es el método que usamos hoy para cobrar tu suscripción
              activa.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleOpenUpdate}
              className="bg-transparent border-none p-0 text-xs font-medium cursor-pointer underline text-[#111]"
            >
              Actualizar
            </button>
          </div>
        </div>

        <p className="text-[0.8rem] text-[#5C574F] m-0 mt-2 leading-[1.5]">
          Si tu tarjeta venció o querés cambiarla, agregá un nuevo método de
          pago. El anterior se va a reemplazar automáticamente.
        </p>
      </section>

      {/* Formulario: actualizar método de pago */}
      {showUpdateForm && (
        <section className="bg-white rounded-xl py-3.5 px-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-3 border border-[#EEEAE3]">
          <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
            Actualizar método de pago
          </div>

          <div className="mb-2.5">
            <label
              className="block text-[0.78rem] font-medium mb-1 text-[#5C574F]"
              htmlFor="card-holder"
            >
              Nombre en la tarjeta
            </label>
            <input
              id="card-holder"
              className="w-full rounded-lg border border-[#D8D3CA] py-2 px-2.5 text-[0.9rem] outline-none bg-[#FBFAF8] focus:border-[#111] focus:bg-white"
              type="text"
              placeholder="Como figura en la tarjeta"
              value={formData.cardHolder}
              onChange={handleInputChange("cardHolder")}
            />
          </div>

          <div className="mb-2.5">
            <label
              className="block text-[0.78rem] font-medium mb-1 text-[#5C574F]"
              htmlFor="card-number"
            >
              Número de tarjeta
            </label>
            <input
              id="card-number"
              className="w-full rounded-lg border border-[#D8D3CA] py-2 px-2.5 text-[0.9rem] outline-none bg-[#FBFAF8] focus:border-[#111] focus:bg-white"
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="•••• •••• •••• ••••"
              value={formData.cardNumber}
              onChange={handleInputChange("cardNumber")}
            />
          </div>

          <div className="flex gap-2 mb-2.5">
            <div className="flex-1">
              <label
                className="block text-[0.78rem] font-medium mb-1 text-[#5C574F]"
                htmlFor="card-expiry"
              >
                Vencimiento
              </label>
              <input
                id="card-expiry"
                className="w-full rounded-lg border border-[#D8D3CA] py-2 px-2.5 text-[0.9rem] outline-none bg-[#FBFAF8] focus:border-[#111] focus:bg-white"
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="MM/AA"
                value={formData.cardExpiry}
                onChange={handleInputChange("cardExpiry")}
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-[0.78rem] font-medium mb-1 text-[#5C574F]"
                htmlFor="card-cvc"
              >
                CVC
              </label>
              <input
                id="card-cvc"
                className="w-full rounded-lg border border-[#D8D3CA] py-2 px-2.5 text-[0.9rem] outline-none bg-[#FBFAF8] focus:border-[#111] focus:bg-white"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="•••"
                value={formData.cardCvc}
                onChange={handleInputChange("cardCvc")}
              />
            </div>
          </div>

          <p className="text-[0.75rem] text-[#8B8478] mt-1 mb-0 leading-[1.4]">
            No guardamos los datos completos de tu tarjeta. El procesamiento se
            realiza de forma segura a través de Mercadopago.
          </p>

          <div className="mt-3.5">
            <button
              type="button"
              onClick={handleSaveCard}
              className="w-full rounded-full border-none bg-[#111] text-white py-3 px-4 text-[0.95rem] font-medium cursor-pointer"
            >
              Guardar método de pago
            </button>
            <p className="text-[0.75rem] text-[#8B8478] mt-2 text-center leading-[1.4]">
              Vamos a usar esta tarjeta para todos los cobros futuros. Si tenés
              pagos pendientes, vamos a intentar procesarlos apenas la guardes.
            </p>
          </div>
        </section>
      )}

      <p className="text-[0.75rem] text-[#8B8478] mt-4 text-center leading-[1.4]">
        Podés actualizar tu método de pago cuando quieras. Si cambiás de tarjeta
        muy cerca de la fecha de cobro, el próximo pago puede procesarse de
        inmediato.
      </p>

      {/* Ayuda con Charli */}
      <AccountHelpCharli
        onOpenCharli={() => console.log("Abrir chat con Charli")}
      />

      {/* Cerrar sesión */}
      <LogoutSection />
    </div>
  );
}

export default PaymentMethod;
