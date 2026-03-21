import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#f5f3e7] font-sans">
      
      {/* Left Column - Image & Marketing */}
      <div className="hidden lg:flex flex-col relative w-[48%] xl:w-[45%] bg-zinc-900 flex-shrink-0 min-h-screen overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
           <img src="/hustle-tee-new.jpg" alt="Background" className="w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col pt-16 px-12 xl:px-16 text-white h-full">
          {/* Headline */}
          <h1 className="text-[52px] xl:text-[62px] font-black leading-none uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
            <span className="block mb-1 drop-shadow-md">SMALL PRODUCT,</span>
            <span className="bg-[#2DC1DB] text-white px-3 py-1 -ml-3 inline-block shadow-md">BIG PROFIT</span>
            <span className="block mt-1 drop-shadow-md">POTENTIAL</span>
          </h1>
          
          {/* Subtext */}
          <p className="mt-8 text-[15.5px] xl:text-[17px] font-medium leading-[1.6] opacity-95 max-w-md drop-shadow-lg">
            Phone cases are year-round profit-makers that smartphone users can't get enough of.
          </p>
          <p className="mt-4 text-[15.5px] xl:text-[17px] font-medium leading-[1.6] opacity-95 max-w-md drop-shadow-lg">
            Add your designs to popular cases, like the new Samsung Galaxy S24 options, and plug them as the perfect add-on to any order.
          </p>

          {/* Bottom Chat Icon */}
          <div className="mt-auto pb-10">
            <div className="w-14 h-14 bg-[#454c30] border border-white/20 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#525a3a] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-12 relative overflow-y-auto">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-[#2B3118] shadow-sm transition-colors z-20 hover-vibrate">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>

        <div className="w-full max-w-[440px] flex flex-col my-auto">
          
          <h2 className="text-[44px] md:text-[54px] font-black uppercase text-[#2B3118] tracking-normal text-center mb-10" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em', letterSpacing: '0.02em' }}>
            WELCOME BACK.
          </h2>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 shadow-sm rounded-md py-3.5 px-4 hover:bg-gray-50 transition-colors font-bold text-[14.5px] text-gray-800">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[18px] h-[18px]" />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 shadow-sm rounded-md py-3.5 px-4 hover:bg-gray-50 transition-colors font-bold text-[14.5px] text-gray-800">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-51-22.9-80-22.9-42.3 0-82.6 24.2-104.9 63.8-45 80.3-15.1 199.1 28.8 261.3 21.6 30.7 47 62.4 80.7 61.2 32.3-1.2 44.8-21 82.2-21 37.4 0 48.6 21.1 82.7 20.4 35.1-.7 57.6-29.3 79-59.8 24.7-35.5 35.1-70 35.7-71.8-1.1-.4-66.9-25.2-67-104.5zM227.6 112.9c18.5-22.5 31.1-53.9 27.6-84.9-26.5 1.1-58.8 17.5-78 40.1-17.1 19.8-31.5 52.3-27.4 82.2 29.8 2.3 59.3-14.8 77.8-37.4z"/></svg>
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-[11px] font-bold text-gray-500 tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-gray-800">Email</label>
              <input type="email" className="w-full bg-white border border-gray-300 shadow-sm rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#A1FF4C] focus:border-transparent text-gray-900" />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[14px] font-bold text-gray-800">Password</label>
              <div className="relative">
                <input type="password" className="w-full bg-white border border-gray-300 shadow-sm rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#A1FF4C] focus:border-transparent text-gray-900 pr-12" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Mockup */}
            <div className="w-[300px] bg-white border border-[#e5e5e5] rounded-sm p-4 mt-1 flex items-center justify-between shadow-sm self-center sm:self-start">
              <div className="flex items-center gap-3">
                <div className="w-[22px] h-[22px] rounded-full bg-[#32a852] flex items-center justify-center shadow-inner">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[14px] font-medium text-gray-700">Success!</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 font-bold text-[10px] text-gray-700 uppercase tracking-tight">
                  <span className="text-[#f48120] text-lg leading-none mt-[-4px]">☁</span> CLOUDFLARE
                </div>
                <div className="text-[8px] text-gray-500 mt-1 flex gap-1">
                  <a href="#" className="hover:underline">Privacy</a> • <a href="#" className="hover:underline">Terms</a>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#B2FF66] md:bg-[#A1FF4C] hover:bg-[#8ee53f] transition-colors text-black font-bold text-[16px] py-4 rounded-md shadow-sm mt-3">
              Sign in
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-6 text-center sm:text-left">
            <a href="#" className="text-[14px] font-bold text-[#2B3118] underline decoration-gray-400 underline-offset-4 hover:decoration-[#2B3118] transition-colors">
              Forgot password?
            </a>
            
            <p className="text-[14px] text-[#2B3118] font-medium sm:text-center mt-2">
              New to Stenvo? <Link href="/signup" className="font-bold underline decoration-gray-400 underline-offset-4 hover:decoration-[#2B3118] transition-colors ml-1 lg:ml-2">Sign Up</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
