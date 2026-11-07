import logo from '../assets/logo.svg';

export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="Auralis"
      style={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
        // Si tu logo es oscuro, descomenta:
        // filter: 'brightness(0) invert(1)',
      }}
    />
  );
}