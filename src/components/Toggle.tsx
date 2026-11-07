type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  hint?: string;
};

export default function Toggle({ checked, onChange, label, hint }: Props) {
  return (
    <div>
      <div className="toggle-row">
        <button
          className={`toggle ${checked ? 'on' : ''}`}
          onClick={() => onChange(!checked)}
          aria-pressed={checked}
        >
          <span className="knob" />
        </button>
        {label && <span className="toggle-label">{label}</span>}
      </div>
      {hint && <p className="toggle-hint">{hint}</p>}
    </div>
  );
}