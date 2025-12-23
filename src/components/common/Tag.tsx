export enum TagStyle {
  DEFAULT = "bg-[#F1F0EB] text-[#5C574F]",
  SUCCESS = "bg-[#E8F7EC] text-[#2E7D32]",
  WARNING = "bg-[#FFF4CC] text-[#8A6E1F]",
  ERROR = "bg-[#FCE4E4] text-[#C53030]",
}

interface TagProps {
  style: TagStyle;
  text: string;
}

function Tag({ style, text }: TagProps) {
  return (
    <div
      className={`rounded-full py-1 px-2.5 text-[11px] uppercase tracking-[0.08em] ${style}`}
    >
      {text}
    </div>
  );
}

export default Tag;
