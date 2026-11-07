type Props = {
  freq: string;
  value: number;
  onChange: (v: number) => void;
};

export default function EQSlider({ freq, value, onChange }: Props) {
  return (
    <div className="eq-band">
      <input
        className="eq-slider"
        type="range"
        min={-12}
        max={12}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="eq-value">{value > 0 ? `+${value}` : value}dB</span>
      <span className="eq-freq">{freq}</span>
    </div>
  );
}