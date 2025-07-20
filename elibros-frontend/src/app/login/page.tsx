"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '../../components';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validação básica
    const newErrors: string[] = [];
    if (!formData.email) newErrors.push('Email é obrigatório');
    if (!formData.password) newErrors.push('Senha é obrigatória');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar chamada para API de login
      console.log('Login data:', formData);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionamento temporário
      window.location.href = '/';
    } catch (error) {
      setErrors(['Erro ao fazer login. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/images/fundoacesso.png')" }}
    >
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <header className="flex justify-center bg-transparent border-0 p-0 mb-8">
            <Link href="/">
              <Image
                src="/images/logoacesso.png"
                alt="logo eLibros"
                width={160}
                height={80}
                className="w-80"
              />
            </Link>
          </header>

          {/* Main Content */}
          <section className="flex justify-between bg-[#FFFFF5] rounded-lg w-full max-w-4xl p-16">
          {/* Left Side - Image */}
          <figure className="flex items-center justify-center mr-8">
            <Image
              src="/images/vetorlogin.png"
              alt="Ilustração de login"
              width={400}
              height={300}
              className="w-full max-w-sm"
            />
          </figure>

          {/* Divider */}
          <div className="w-px bg-black"></div>

          {/* Right Side - Form */}
          <div className="flex flex-col justify-center ml-8 min-w-80">
            <form onSubmit={handleSubmit} className="flex flex-col">
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

              {/* Email Field */}
              <div className="mb-8">
                <label htmlFor="email" className="block text-[#1C1607] text-lg mb-2">
                  Email
                </label>
                <div className="relative">
                  <Image
                    src="/images/icons/user.png"
                    alt="User Icon"
                    width={14}
                    height={14}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-[#E5E7EB] rounded-md pl-10 pr-4 py-4 w-80 focus:outline-none focus:ring-2 focus:ring-[#FFD147] focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label htmlFor="password" className="block text-[#1C1607] text-lg mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Image
                    src="/images/icons/lock.png"
                    alt="Lock Icon"
                    width={14}
                    height={14}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5"
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border border-[#E5E7EB] rounded-md pl-10 pr-4 py-4 w-80 focus:outline-none focus:ring-2 focus:ring-[#FFD147] focus:border-transparent"
                    placeholder="Sua senha"
                    required
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-[#FFD147] bg-gray-100 border-gray-300 rounded focus:ring-[#FFD147] focus:ring-2"
                  />
                  <span className="text-sm text-[#1C1607]">Lembre-se de mim</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#1C1607] text-white text-center rounded-lg text-xl font-light py-3 px-24 mt-5 hover:bg-[#2a2110] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

              {/* Links */}
              <p className="text-base font-light text-center mt-6">
                Não possui uma conta?{' '}
                <Link href="/registro" className="text-[#FFD147] no-underline font-medium hover:underline">
                  Cadastrar
                </Link>
              </p>

              <p className="text-base font-light text-center mt-4">
                <Link href="/recuperar-senha" className="text-[#FFD147] no-underline font-medium hover:underline">
                  Esqueceu sua senha?
                </Link>
              </p>
            </form>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
