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
    <div className="min-h-screen flex flex-col bg-white">
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
        </nav>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mt-4 sm:mt-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              <span className="inline sm:hidden">Customer tracking, made smarter.</span>
              <span className="hidden sm:inline">Customer tracking,<br/> made smarter.</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600 max-w-xl leading-[1.7]">Turn sign-ups into <strong className="text-neutral-900">insights</strong> with AI magic, <strong className="text-neutral-900">log</strong> every step, and <strong className="text-neutral-900">sync</strong> it all in one sleek, affordable tool.</p>
            
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 relative w-full max-w-xl">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border-0 bg-white/5 px-5 py-4 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-neutral-900 text-base sm:text-[17px] placeholder:text-neutral-400"
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
              <p className="text-base sm:text-[17px] text-gray-500 leading-[1.7]">There are dozens of CRMs out there—bloated, pricey, and overkill for most. If you just need a spreadsheet to list your customers, any of them will do. Many are even free.</p>
              <p className="text-base sm:text-[17px] text-gray-500 leading-[1.7]">But if you want to <i>know</i> your customers and grow smarter without the hassle, you need Newlytic. A tool that syncs, delivers insights, and logs every step should take the grunt work off your plate—so you can focus on what matters.</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block absolute -bottom-1/4 w-full" style={{ transform: 'translateY(-10px)' }}>
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
                className={`rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full h-auto transform transition-all duration-700 ease-in-out hover:-translate-y-30 cursor-pointer ${shouldPeek ? 'animate-peek' : ''}`}
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
