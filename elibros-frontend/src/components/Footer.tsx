interface FooterProps {}

export default function Footer({}: FooterProps) {
  return (
    <footer className="mt-20 px-4 md:px-20 py-8 bg-[#1C1607]">
      <div className="flex flex-row justify-between pb-6.5 border-2 border-b-stone-800">
        <h1>
          <a href="/" className="flex">
            <img src="/logo.png" alt="eLibros" className="w-48 md:w-52" />
          </a>
        </h1>
        <div className="flex flex-row gap-4 items-center">
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center"><img width="14px" height="14px" src="/IN.png" alt="IN" /></div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center"><img width="11px" height="11px" src="/Facebook.png"  alt="Facebook" /></div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center"><img width="18px" height="18px" src="/Twitter.png"  alt="Twitter" /></div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center"><img width="18px" height="18px" src="/instagram.png"  alt="Instagram" /></div>
        </div>
    </div>
    <div className="mt-6 flex flex-row justify-between ">
      <p className="text-white text-left">@ 2024 Entregadores. Todos os direitos reservados</p>
      <div className="flex flex-row text-right gap-9">
        <p className="text-white">Termos</p>
        <p className="text-white">Privacidade</p>
        <p className="text-white">Cookies</p>
      </div>
    </div>
    </footer>
  );
}
