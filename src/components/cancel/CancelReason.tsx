import { useState } from "react";
import { ViewType } from "../../types/ViewType";

const REASONS = [
  "Tengo café acumulado en casa",
  "El precio me resulta alto",
  "Me voy de vacaciones",
  "No estoy conforme con atención al cliente",
  "Tuve problemas con las entregas",
  "No me gusta el café que recibo",
  "No tomo café en verano",
];

interface CancelReasonProps {
  onContinue: () => void;
  onCancel: () => void;
}

function CancelReason({ onContinue, onCancel }: CancelReasonProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <main>
      <div className="mb-3">
        <h1 className="text-lg m-0 mb-1 font-semibold">
          Contanos por qué querés cancelar
        </h1>
        <p className="text-[0.8125rem] text-[#666] m-0 leading-[1.5]">
          Elegí el motivo que mejor se acerque a tu situación. Esto nos ayuda a
          mejorar la suscripción.
        </p>
      </div>
      <section className="bg-white rounded-xl p-4 mb-4 border border-[#eeeeee]">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-2">
          Elegí un motivo
        </div>
        <div className="flex flex-col gap-2">
          {REASONS.map((motivo) => {
            const isSelected = selectedReason === motivo;
            return (
              <button
                key={motivo}
                type="button"
                onClick={() => setSelectedReason(motivo)}
                className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer relative text-sm text-[#111] leading-[1.4] ${
                  isSelected ? "border-[#111]" : "border-[#E0DED9]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white box-border ${
                    isSelected
                      ? "border-[6px] border-[#111]"
                      : "border-2 border-[#D4D0C7]"
                  }`}
                />
                {motivo}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#8B8478] mt-2.5 leading-[1.5]">
          Todavía no se va a cancelar tu suscripción. En el próximo paso vas a
          poder revisar y confirmar.
        </p>
      </section>
      <button
        type="button"
        disabled={!selectedReason}
        onClick={onContinue}
        className={`w-full rounded-full border-none py-3.5 px-4 text-sm font-medium text-white ${
          selectedReason
            ? "bg-[#111] cursor-pointer"
            : "bg-[#C4C0B9] cursor-not-allowed"
        }`}
      >
        Continuar con la cancelación
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="mt-3 bg-transparent border-none p-0 text-[0.8125rem] font-medium cursor-pointer underline text-[#111] block w-full text-center"
      >
        Volver sin cancelar
      </button>
    </main>
  );
}

export default CancelReason;
