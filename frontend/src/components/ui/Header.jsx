export function Header({ appName, title, subtitle }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{appName}</p>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
