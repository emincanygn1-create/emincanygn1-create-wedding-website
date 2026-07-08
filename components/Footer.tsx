export default function Footer() {
  return (
    <footer className="py-10 pb-28 px-6 bg-olive-900 text-center">
      <div className="w-10 h-px bg-gold/50 mx-auto mb-6" />
      <p className="text-[11px] text-cream/40 font-body tracking-wider">
        Made with love · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
