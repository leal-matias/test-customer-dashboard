import { useState } from "react";
import PageWrapper from "../common/PageWrapper";

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

interface ModifyDeliveryProps {
  onClose: () => void;
}

const STORES: Store[] = [
  { id: "ciudad-vieja", nombre: "Ciudad Vieja", direccion: "Sarandí 473" },
  { id: "epa", nombre: "Epa", direccion: "Constituyente 2045" },
  { id: "tostaduria", nombre: "Tostaduría", direccion: "Rivera 3220" },
  {
    id: "punta-carretas",
    nombre: "Punta Carretas",
    direccion: "José Ellauri 350",
  },
];

const DEPARTAMENTOS = ["Montevideo", "Canelones", "Maldonado"];
const BARRIOS = ["Pocitos", "Centro", "Ciudad Vieja"];
const CODIGOS_POSTALES = ["11300", "11000"];

function ModifyDelivery({ onClose }: ModifyDeliveryProps) {
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [selectedOption, setSelectedOption] = useState<"envio" | "retiro">(
    "envio"
  );
  const [selectedStore, setSelectedStore] = useState("ciudad-vieja");
  const [address, setAddress] = useState<Address>({
    departamento: "Montevideo",
    direccion: "Rivera 1234",
    apartamento: "Apto 101",
    barrio: "Pocitos",
    codigoPostal: "11300",
  });

  const footnoteText =
    selectedOption === "envio"
      ? "Este cambio impacta en tu próxima entrega programada a domicilio."
      : "Este cambio impacta en tu próxima entrega para retiro en el local seleccionado.";

  const getConfirmationDetails = () => {
    if (selectedOption === "envio") {
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

  // Vista de confirmación
  if (step === "confirm") {
    const confirmDetails = getConfirmationDetails();

    return (
      <PageWrapper title="MODIFICAR ENTREGA" onBack={() => setStep("edit")} onClose={onClose}>
        <section>
          {/* Ícono de confirmación */}
          <div className="text-center py-5 pb-4">
            <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              ✓
            </div>
            <h1 className="text-base font-semibold m-0 mb-1.5 text-[#111]">
              Entrega actualizada
            </h1>
            <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
              Tu forma de entrega se actualizó correctamente. La próxima entrega
              se preparará según estos datos.
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl p-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
            <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
              Resumen de tu entrega
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">
                Forma de entrega
              </span>
              <span className="text-[0.85rem] font-semibold">
                {confirmDetails.forma}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
              <span className="text-[0.8rem] text-[#5C574F]">
                Dirección / local
              </span>
              <span className="text-[0.85rem] font-semibold text-right">
                {confirmDetails.detalle}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-[0.8rem] text-[#5C574F]">
                Próxima entrega
              </span>
              <span className="text-[0.85rem] font-semibold">
                Se mantiene la fecha ya programada
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full rounded-full py-3 px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
            >
              Volver a mi cuenta
            </button>
          </div>
        </section>
      </PageWrapper>
    );
  }

  // Vista de edición
  return (
    <PageWrapper title="MODIFICAR ENTREGA" onBack={onClose} onClose={onClose}>
      <section>
        <h1 className="text-base font-semibold m-0 mb-1.5 text-[#111]">
          Modificar forma de entrega
        </h1>
        <p className="text-[0.8rem] text-[#807A70] m-0 mb-3">
          Elegí si querés recibir tu café por envío a domicilio o retirarlo en
          uno de nuestros locales.
        </p>

        {/* OPCIONES DE ENTREGA */}
        <div className="bg-white rounded-xl p-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
          <div className="text-xs font-semibold tracking-wide uppercase text-[#9A9388] mb-2">
            Opciones de entrega
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {/* ENVÍO A DOMICILIO */}
            <button
              onClick={() => setSelectedOption("envio")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-9 cursor-pointer relative transition-all duration-150 ${
                selectedOption === "envio"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  selectedOption === "envio"
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

            {/* RETIRO EN LOCAL */}
            <button
              onClick={() => setSelectedOption("retiro")}
              className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-9 cursor-pointer relative transition-all duration-150 ${
                selectedOption === "retiro"
                  ? "border-[#111] shadow-[0_0_0_1px_#111]"
                  : "border-[#E0DED9]"
              }`}
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${
                  selectedOption === "retiro"
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

        {/* DIRECCIÓN PARA ENVÍO */}
        {selectedOption === "envio" && (
          <div className="bg-white rounded-xl p-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
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

        {/* SELECCIÓN DE LOCAL PARA RETIRO */}
        {selectedOption === "retiro" && (
          <div className="bg-white rounded-xl p-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5">
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
            onClick={() => setStep("confirm")}
            className="w-full rounded-full py-3 px-4 text-[0.9rem] font-semibold border-none cursor-pointer bg-[#111] text-white"
          >
            Confirmar entrega
          </button>
          <p className="text-xs text-[#8B8478] mt-3 leading-[1.4] text-center mb-0">
            {footnoteText}
          </p>
          <button
            onClick={onClose}
            className="text-[0.8rem] text-[#5C574F] text-center mt-3 underline cursor-pointer border-none bg-transparent block w-full font-[inherit]"
          >
            Volver sin cambiar entrega
          </button>
        </div>
      </section>
    </PageWrapper>
  );
}

export default ModifyDelivery;

