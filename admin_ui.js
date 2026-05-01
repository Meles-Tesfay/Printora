const fs = require('fs');
let code = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Replacements
const replacements = [
  {
    search: 'className="w-64 bg-[#111] text-white hidden md:flex flex-col sticky top-0 h-screen"',
    replace: 'className="w-64 bg-white text-gray-800 border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen"'
  },
  {
    search: 'className="p-6 border-b border-gray-800"',
    replace: 'className="p-6 border-b border-gray-100"'
  },
  {
    search: 'className="h-10 w-auto invert brightness-0"',
    replace: 'className="h-10 w-auto"'
  },
  {
    search: 'text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 block',
    replace: 'text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 block'
  },
  {
    search: 'className="p-4 mx-4 my-4 bg-white/5 rounded-2xl border border-white/10"',
    replace: 'className="p-4 mx-4 my-4 bg-[#A1FF4D]/10 rounded-2xl border border-[#A1FF4D]/20"'
  },
  {
    search: 'className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm"',
    replace: 'className="w-9 h-9 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-sm"'
  },
  {
    search: 'className="text-[12px] font-black text-white leading-none"',
    replace: 'className="text-[12px] font-black text-[#2B3220] leading-none"'
  },
  {
    search: 'className="text-[9px] font-bold text-orange-500 mt-0.5 tracking-widest uppercase"',
    replace: 'className="text-[9px] font-bold text-[#567a28] mt-0.5 tracking-widest uppercase"'
  },
  {
    search: 'bg-orange-500/20 text-orange-400" : "text-gray-400 hover:bg-white/5"',
    replace: 'bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"',
    global: true
  },
  {
    search: 'bg-orange-500 text-white text-[9px]',
    replace: 'bg-[#A1FF4D] text-[#1B2412] text-[9px]',
    global: true
  },
  {
    search: 'border-t border-gray-800',
    replace: 'border-t border-gray-100'
  },
  {
    search: 'text-gray-400 hover:bg-white/5',
    replace: 'text-gray-400 hover:bg-gray-50'
  }
];

replacements.forEach(rep => {
  if (rep.global) {
    code = code.split(rep.search).join(rep.replace);
  } else {
    code = code.replace(rep.search, rep.replace);
  }
});

fs.writeFileSync('app/admin/page.tsx', code);
console.log('Admin UI updated');
