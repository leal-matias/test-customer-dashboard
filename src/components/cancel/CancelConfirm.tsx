interface CancelConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function CancelConfirm({ onConfirm, onCancel }: CancelConfirmProps) {
  return (
    <main>
      <div className="mb-4">
        <h1 className="text-lg m-0 mb-1.5 font-semibold">
          Confirmá la cancelación de tu suscripción
        </h1>
        <p className="text-[0.8125rem] text-[#666] m-0 leading-[1.5]">
          Si confirmás, se va a cancelar tu suscripción y vas a dejar de recibir
          tu café a partir del próximo ciclo.
        </p>
      </div>
      <section className="bg-white rounded-xl p-4 mb-4 border border-[#eeeeee]">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-3">
          Resumen de tu suscripción
        </div>
        <div className="text-[0.8125rem] text-[#555] leading-[1.8]">
          <div className="mb-1.5">
            <strong className="text-[#111]">Plan:</strong> Plan Brasil
          </div>
          <div className="mb-1.5">
            <strong className="text-[#111]">Próximo cobro:</strong> 10 de cada
            mes
          </div>
          <div className="mb-1.5">
            <strong className="text-[#111]">Próxima entrega:</strong> Jueves 12
            de diciembre
          </div>
          <div className="mt-3 pt-3 border-t border-[#eee]">
            <strong className="text-[#111]">Estado después de cancelar:</strong>{" "}
            No se generarán más cobros ni entregas.
          </div>
        </div>
      </section>
      <div className="bg-[#fff9e6] rounded-[10px] p-3 mb-4 text-xs text-[#8B7500] leading-[1.5] border border-[#ffe8a3]">
        Si cancelás ahora, el beneficio del 50% OFF en tu próximo ciclo se va a
        perder.
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
      >
        Confirmar cancelación
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

export default CancelConfirm;
