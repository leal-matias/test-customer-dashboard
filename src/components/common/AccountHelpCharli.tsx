interface AccountHelpCharliProps {
  onOpenCharli?: () => void;
}

function AccountHelpCharli({ onOpenCharli }: AccountHelpCharliProps) {
  return (
    <section className="mt-6 pt-4 border-t border-[#e1ddd7]">
      <div className="flex items-start gap-3">
        <img
          src="/charli.gif"
          alt="Charli"
          className="w-10 h-10 rounded-full shrink-0 bg-[#111]"
        />
        <div>
          <p className="text-[13px] text-[#5C574F] m-0 mb-1">
            ¿Te quedó alguna duda?
          </p>
          <p className="text-[13px] text-[#5C574F] m-0 mb-2.5">
            Preguntale a Charli, nuestro barista virtual.
          </p>
          <button
            type="button"
            onClick={onOpenCharli}
            className="bg-transparent border-none p-0 text-[13px] font-medium underline cursor-pointer text-[#111]"
          >
            ↳ Vamos a conversar
          </button>
        </div>
      </div>
    </section>
  );
}

export default AccountHelpCharli;
