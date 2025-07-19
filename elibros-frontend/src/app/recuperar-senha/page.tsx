"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validação básica
    if (!email) {
      setErrors(['Email é obrigatório']);
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(['Email inválido']);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar chamada para API de recuperação de senha
      console.log('Recovery email:', email);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
    } catch (error) {
      setErrors(['Erro ao enviar email de recuperação. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen" style={{
        backgroundImage: "url('/images/fundoacesso.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header */}
        <header className="flex justify-center bg-transparent border-0 p-0 mb-8 pt-8">
          <Link href="/">
            <Image
              src="/images/logoacesso.png"
              alt="logo eLibros"
              width={160}
              height={80}
              className="w-40"
            />
          </Link>
        </header>

        {/* Success Message */}
        <main className="flex justify-center px-4">
          <section className="bg-[#FFFFF5] w-full max-w-md p-16 rounded-lg text-center font-['Poppins']">
            <h2 className="text-[#1C1607] text-xl font-normal mb-4">
              Email Enviado!
            </h2>
            <p className="text-lg font-normal mb-6">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link 
              href="/login"
              className="inline-block bg-[#1C1607] text-white text-center rounded-lg text-base font-light py-3 px-8 hover:bg-[#2a2110] transition-colors"
            >
              Voltar ao Login
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: "url('/images/fundoacesso.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header */}
      <header className="flex justify-center bg-transparent border-0 p-0 mb-8 pt-8">
        <Link href="/">
          <Image
            src="/images/logoacesso.png"
            alt="logo eLibros"
            width={160}
            height={80}
            className="w-40"
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex justify-center px-4">
        <section className="bg-[#FFFFF5] w-full max-w-md p-16 rounded-lg text-center font-['Poppins']">
          <h2 className="text-[#1C1607] text-xl font-normal mb-4">
            Recuperar Senha
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-4">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mb-2">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <p className="text-lg font-normal mb-6">
              Digite seu email para receber as instruções de recuperação de senha.
            </p>

            {/* Email Field */}
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-md py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-[#FFD147] focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1C1607] text-white text-center rounded-lg text-base font-light py-3 px-8 w-full hover:bg-[#2a2110] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Enviando...' : 'Enviar Email'}
            </button>

            {/* Back to Login Link */}
            <Link 
              href="/login" 
              className="text-[#FFD147] no-underline font-medium hover:underline"
            >
              Voltar ao Login
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
}
