interface BenefitSuccessProps {
  onBack: () => void;
}

function BenefitSuccess({ onBack }: BenefitSuccessProps) {
  return (
    <main>
      <div className="text-center py-5 pb-4">
        <div className="inline-flex items-center justify-center py-1 px-3 rounded-full bg-[#E8F7EC] text-[#2E7D32] text-[11px] font-semibold tracking-[0.12em] uppercase mb-3.5">
          Beneficio activado
        </div>
        <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl text-[#2E7D32]">
          ✓
        </div>
        <h1 className="text-lg m-0 mb-1.5 font-semibold text-center">
          ¡Beneficio activado!
        </h1>
        <p className="text-[0.8125rem] text-[#666] text-center leading-[1.5] m-0">
          Tu próximo cobro de suscripción va a tener un <strong>50% OFF</strong>
          . No tenés que hacer nada más.
        </p>
      </div>
      <section className="bg-white rounded-xl p-4 mb-4 border border-[#eeeeee]">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-3">
          Resumen de tu suscripción
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
          <span className="text-[0.8125rem] text-[#5C574F]">Plan</span>
          <span className="text-sm font-semibold">Plan Brasil</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
          <span className="text-[0.8125rem] text-[#5C574F]">Beneficio</span>
          <span className="text-sm font-semibold">50% OFF próximo ciclo</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-[0.8125rem] text-[#5C574F]">Se aplica</span>
          <span className="text-sm font-semibold">Una sola vez</span>
        </div>
      </section>
      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
      >
        Volver a mi suscripción
      </button>
      <p className="text-xs text-[#8B8478] mt-2.5 text-center leading-[1.5]">
        En la sección <strong>Mi suscripción</strong> vas a ver el beneficio
        aplicado a tu próximo cobro.
      </p>
    </main>
  );
}

export default BenefitSuccess;
