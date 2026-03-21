type ChipProps = {
  label: string;
};

export function Chip({ label }: ChipProps) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
      {label}
    </span>
  );
}
