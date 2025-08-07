"use client";

import Image from 'next/image';
import { Header, Footer, BooksCarousel } from '../components';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Banner Section */}
        <section 
          className="bg-cover bg-center bg-top flex items-center justify-start px-4 md:px-20 py-20 mb-8"
          style={{ backgroundImage: "url('/banner.png')" }}
        >
          <p className="text-[#FFFFF5] text-left text-base md:text-lg font-light max-w-lg">
            &quot;Há sonhos que devem permanecer nas <br />
            gavetas, nos cofres, trancados até o <br />
            nosso fim. E por isso passíveis de serem <br />
            sonhados a vida inteira.&quot; - Hilda Hilst
          </p>
        </section>

        {/* About Section */}
        <section className="px-4 md:px-12 flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <figure className="flex justify-center items-center">
            <Image 
              src="/marca.svg" 
              alt="eLibros Marca" 
              width={300} 
              height={150}
              className="w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px]"
              priority
            />
          </figure>
          
          <div className="flex flex-col w-full gap-6">
            <div className="w-full">
              <h2 className="text-[#1C1607] text-2xl md:text-3xl font-medium mb-4">
                Conheça o eLibros
              </h2>
              <p className="pb-4 text-base">
                Livraria digital brasileira onde você pode encontrar os seus escritores nacionais favoritos, ou até ir atrás de descobrir novos!
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col w-full md:w-2/5">
                <Image src="/icons/missao.svg" alt="Missão" width={20} height={20} className="w-5 h-5 mb-2" />
                <h3 className="text-lg font-medium mb-1">Missão</h3>
                <p className="text-sm font-light">
                  Aumentar a visibilidade dos livros nacionais!
                </p>
              </div>
              
              <div className="flex flex-col w-full md:w-2/5">
                <Image src="/icons/visao.svg" alt="Visão" width={20} height={20} className="w-5 h-5 mb-2" />
                <h3 className="text-lg font-medium mb-1">Visão</h3>
                <p className="text-sm font-light">
                  Vender livros brasileiros em escala internacional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Stats Section */}
        <section className="px-4 md:px-20 my-12 flex flex-col md:flex-row justify-center md:justify-evenly gap-8">
          <div className="w-full md:w-1/4 text-center">
            <h3 className="text-[#5B4F3D] text-2xl font-semibold mb-2">+5Mi acessos</h3>
            <p className="text-sm">
              Desde 2023, conseguimos juntar mais de 5,000,000 acessos em nossa loja
            </p>
          </div>
          
          <div className="w-full md:w-1/4 text-center">
            <h3 className="text-[#5B4F3D] text-2xl font-semibold mb-2">26 estados</h3>
            <p className="text-sm">
              Atualmente, somos capazes de entregar suas compras em qualquer estado do país
            </p>
          </div>
          
          <div className="w-full md:w-1/4 text-center">
            <h3 className="text-[#5B4F3D] text-2xl font-semibold mb-2">+10mil livros</h3>
            <p className="text-sm">
              Nossa coleção conta com mais de 10,000 livros de inúmeros autores diferentes
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-[#FFD147] px-4 md:px-20 py-8 my-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-[#574725] text-2xl font-medium">Contate-nos</h2>
          
          <div className="hidden md:block h-14 w-0.5 bg-[#BF9D35]"></div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex items-center text-[#473b1d] text-lg">
              <figure className="pr-3">
                <Image src="/icons/email.svg" alt="Email" width={20} height={20} className="h-5" />
              </figure>
              <p>elibros@entregadores.com</p>
            </div>
            
            <div className="flex items-center text-[#473b1d] text-lg">
              <figure className="pr-3">
                <Image src="/icons/fone.svg" alt="Telefone" width={20} height={20} className="h-5" />
              </figure>
              <p>Disque (84) 4005-9832</p>
            </div>
          </div>
        </section>

        {/* Books Carousel */}
        <BooksCarousel showViewMore={true} />
      </main>

      <Footer />
    </div>
  );
}
