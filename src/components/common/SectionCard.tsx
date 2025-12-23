interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  tag?: React.ReactNode;
}

function SectionCard({ title, children, subtitle, tag }: SectionCardProps) {
  return (
    <section className="bg-white rounded-xl p-4 mb-4 border border-[#eeeeee]">
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-0.5">
            {title}
          </div>
          <div className="text-sm font-semibold">{subtitle}</div>
        </div>
        {tag}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
