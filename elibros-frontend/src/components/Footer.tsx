interface FooterProps {}

export default function Footer({}: FooterProps) {
  return (
    <footer className="mt-20 px-4 md:px-20 py-8 bg-[#1C1607]">
      <div className="flex flex">
        <h1>
          <a href="/" className="flex">
            <img src="/logo.png" alt="eLibros" className="w-48 md:w-52" />
          </a>
        </h1>
        <div className="flex flex-row gap-4">
          <img src="/IN.png" alt="IN" className="" />
          <img src="/Facebook.png" alt="Facebook" className="" />
          <img src="/Twitter.png" alt="Twitter" className="" />
          <img src="/instagram.png" alt="Instagram" className="" />
        </div>
      <p className="text-white text-center">@ 2024 Entregadores. Todos os direitos reservados</p>
    </div>
    </footer>
  );
}
