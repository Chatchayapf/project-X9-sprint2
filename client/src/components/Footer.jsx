const Footer = () => {
  return (
    <footer id="contact" className="bg-base-200 text-base-content mt-10 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-center">

        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            D9
          </div>
          <span className="font-bold text-base">Digi9Craft</span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-base-content/70 max-w-xs">
          Creative Digital Assets — สินค้าดิจิทัลคุณภาพสูง พร้อมดาวน์โหลดทันที
        </p>

        {/* Nav Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <a className="link link-hover text-sm">About us</a>
          <a className="link link-hover text-sm">Contact</a>
        </nav>

        {/* Social Icons */}
        <nav className="flex flex-wrap justify-center gap-1">
          {['𝕏', '📸', '▶', '💼'].map((icon, i) => (
            <a key={i} className="btn btn-ghost btn-circle text-lg w-10 h-10 min-h-0">
              {icon}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs opacity-50 leading-relaxed">
          © 2026 Digi9Craft. All rights reserved.
          <br className="sm:hidden" />
          {' '}Powered by Orochi Model X Team
        </p>

      </div>
    </footer>
  );
};

export default Footer;
