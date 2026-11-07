import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type Props = {
  icon: ReactNode;
  name: string;
  active: boolean;
  enabled?: boolean;
  onClick: () => void;
};

export default function ProfileItem({ icon, name, active, enabled, onClick }: Props) {
  return (
    <button className={`profile-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="check">{enabled && <Check size={17} strokeWidth={2.6} />}</span>
      {icon}
      <span>{name}</span>
    </button>
  );
}