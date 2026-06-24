export default function Footer() {
  return (
    <footer className="bg-[#fdf8f0] text-[#2c1a12] py-12 px-6 lg:px-12 border-t border-[#e6d8c8] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-zaslia tracking-tight text-[#8b5a33]">Lex8</div>
        <div className="flex gap-8 text-sm text-neutral-600">
          <a href="#" className="hover:text-brand transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand transition-colors">Terms</a>
          <a href="#" className="hover:text-brand transition-colors">Security</a>
        </div>
        <div className="text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} Lex8 Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
