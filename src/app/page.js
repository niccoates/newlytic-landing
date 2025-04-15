"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productImage from '@/assets/product.png';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [shouldPeek, setShouldPeek] = useState(false);

  useEffect(() => {
    // Start the peek animation after a short delay
    const timer = setTimeout(() => setShouldPeek(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      <style jsx global>{`
        @keyframes peek {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
        }
      `}</style>
      <header className="bg-white mt-10 sm:mt-20">
        <nav aria-label="Global" className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-6">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Newlytic</span>
              <Image
                alt=""
                src="/logo.svg"
                width={30}
                height={30}
              />
            </Link>
          </div>
          <div>
            <Link 
              href="https://x.com/newlytic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
            >
              <span className="sr-only">Follow us on X (Twitter)</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mt-10 sm:mt-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Your customer pipeline, <br/>on autopilot.
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600 max-w-xl leading-[1.8]">
             Automatically log new signups, get AI-powered intel, and track every interaction — simple, actionable, and always up to date.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 relative w-full max-w-xl">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border-0 bg-white/5 px-5 py-4 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-neutral-900 text-base sm:text-[17px] placeholder:text-neutral-400 outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 flex-none rounded-xl bg-neutral-900 px-5 py-4 sm:py-2.5 text-base sm:text-[15px] font-semibold text-white shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Joining...' : 'Join waitlist'}
                </button>
              </div>
            </form>
            {status === 'success' && (
              <p className="mt-2 text-sm text-green-600">Thanks for joining! We'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
            )}
          </div>

          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-[1.1]">Why Newlytic?</h2>
            <div className="mt-3 sm:mt-4 max-w-3xl space-y-3 sm:space-y-4">
              <p className="text-base sm:text-[17px] text-gray-500 leading-[1.7]">Most tools make you do the heavy lifting—manually updating records, digging for company info, or jumping between apps just to see what’s happening.</p>
              <p className="text-base sm:text-[17px] text-gray-500 leading-[1.7]">Every new signup is enriched with company intel, synced from your favorite tools, and tracked from first touch to conversion. It’s everything you need to spot real opportunities, minus the CRM clutter.</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block bottom-0 left-0 right-0 w-full mt-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl">
              <Image
                alt="App screenshot"
                src={productImage}
                width={1920}
                height={1236}
                priority
                quality={100}
                sizes="(max-width: 1280px) 90vw, 1200px"
                className={`rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full max-h-[60vh] h-auto transform transition-all duration-700 ease-in-out hover:translate-y-[-5%] cursor-pointer object-contain mx-auto ${shouldPeek ? 'animate-peek' : ''}`}
                style={{
                  animation: shouldPeek ? 'peek 1s ease-in-out' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
