interface CancelSuccessProps {
  onBack: () => void;
}

function CancelSuccess({ onBack }: CancelSuccessProps) {
  return (
    <main className="text-center pt-10">
      <div className="w-16 h-16 rounded-full bg-[#e8f7ec] flex items-center justify-center mx-auto mb-5 text-[2rem] text-[#2e7d32]">
        ✓
      </div>
      <h1 className="text-xl m-0 mb-3 font-semibold">
        Tu suscripción fue cancelada
      </h1>
      <p className="text-sm text-[#666] leading-[1.6] m-0 mb-8 max-w-[360px] mx-auto">
        No se van a generar nuevos cobros ni entregas. Gracias por haber sido
        parte de Culto Café.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="w-full max-w-[320px] rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
      >
        Volver a mi cuenta
      </button>
    </main>
  );
}

export default CancelSuccess;
