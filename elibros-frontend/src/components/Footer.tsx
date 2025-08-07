import Link from 'next/link';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FooterProps {
  // Props podem ser adicionadas aqui no futuro
}

export default function Footer({}: FooterProps) {
  return (
    <footer className="mt-20 px-4 md:px-20 py-8 bg-[#1C1607]">
      <div className="flex flex-row justify-between pb-6.5 border-2 border-b-stone-800">
        <h1>
          <Link href="/" className="flex">
            <Image src="/logo.png" alt="eLibros" width={208} height={60} className="w-48 md:w-52" />
          </Link>
        </h1>
        <div className="flex flex-row gap-4 items-center">
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center">
            <Image width={14} height={14} src="/IN.png" alt="IN" />
          </div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center">
            <Image width={11} height={11} src="/Facebook.png" alt="Facebook" style={{ width: 'auto', height: 'auto' }} />
          </div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center">
            <Image width={18} height={18} src="/Twitter.png" alt="Twitter" style={{ width: 'auto', height: 'auto' }} />
          </div>
          <div className="border-stone-800 border-2 w-15 h-15 rounded-full flex justify-center items-center">
            <Image width={18} height={18} src="/instagram.png" alt="Instagram" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-row justify-between">
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