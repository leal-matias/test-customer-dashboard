interface CancelOfferProps {
  onAcceptBenefit: () => void;
  onCancelAnyway: () => void;
}

function CancelOffer({ onAcceptBenefit, onCancelAnyway }: CancelOfferProps) {
  return (
    <main>
      <div className="text-center mb-4 pt-2">
        <div className="inline-flex items-center justify-center py-1 px-2.5 rounded-full bg-[#e8f7ec] text-[#165c2f] text-[11px] font-semibold tracking-[0.08em] uppercase mb-2.5">
          beneficio especial
        </div>
        <h1 className="text-xl m-0 mb-1.5 font-semibold">
          ¿Te quedás con un 50% OFF?
        </h1>
        <p className="text-[0.8125rem] text-[#666] m-0 leading-[1.5]">
          Antes de cancelar tu suscripción, podés obtener un{" "}
          <strong>50% de descuento en tu próximo ciclo</strong> si decidís
          seguir en Culto.
        </p>
      </div>
      <section className="bg-white rounded-xl p-4 mb-4 border border-[#eeeeee]">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-2">
          Cómo funciona el beneficio
        </div>
        <ul className="list-none p-0 m-0 text-[0.8125rem] text-[#555] leading-[1.6]">
          <li className="mb-1.5">
            • Aplicamos un <strong>50% OFF</strong> en tu próximo cobro de
            suscripción.
          </li>
          <li className="mb-1.5">
            • El descuento se usa <strong>una sola vez</strong> y se aplica
            automáticamente.
          </li>
          <li className="mb-1.5">
            • Tu plan, fecha de cobro y forma de entrega se mantienen como hasta
            ahora.
          </li>
        </ul>
        <p className="text-xs text-[#8B8478] mt-2.5 leading-[1.5]">
          Si después de usar el beneficio querés cancelar igual, vas a poder
          hacerlo desde tu cuenta.
        </p>
      </section>
      <button
        type="button"
        onClick={onAcceptBenefit}
        className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
      >
        Aceptar beneficio y seguir con mi suscripción
      </button>
      <button
        type="button"
        onClick={onCancelAnyway}
        className="mt-3 bg-transparent border-none p-0 text-[0.8125rem] font-medium cursor-pointer underline text-[#b91c1c] block w-full text-center"
      >
        Quiero cancelar igual
      </button>
      <p className="text-[11px] text-[#8B8478] mt-2.5 text-center leading-[1.4]">
        Todavía no se va a cancelar tu suscripción. Solo se aplicará el
        beneficio si elegís continuar.
      </p>
    </main>
  );
}

export default CancelOffer;
