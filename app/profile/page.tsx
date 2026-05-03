"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Mail, 
  Save, 
  Building,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    company_name: "",
  });
  
  const [profileId, setProfileId] = useState<string | null>(null);
  const [role, setRole] = useState<string>("CUSTOMER");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, phone_number, location, company_name")
          .eq("id", session.user.id)
          .single();

        if (error) {
           setError("We couldn't load your profile. Please try refreshing.");
           throw error;
        }

        if (profile) {
          setProfileId(profile.id);
          setRole(profile.role || "CUSTOMER");
          setFormData({
            full_name: profile.full_name || "",
            email: profile.email || session.user.email || "",
            phone_number: profile.phone_number || "",
            location: profile.location || "",
            company_name: profile.company_name || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;

    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          location: formData.location,
          company_name: formData.company_name,
        })
        .eq("id", profileId);

      if (error) throw error;
      
      setSuccess(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile updates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3da85b]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your personal information, contact details, and platform preferences.</p>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner area */}
        <div className="h-32 bg-gradient-to-r from-gray-900 to-[#1c211f] relative">
           <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
             <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
               <UserIcon size={32} />
             </div>
           </div>
        </div>
        
        <div className="px-8 pt-16 pb-8">
           <form onSubmit={handleSaveProfile} className="space-y-8">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3da85b]/20 focus:border-[#3da85b] transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                {/* Email Address (View Only mostly, handled by Auth) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100/50 border border-gray-100 rounded-xl text-sm text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed directly.</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3da85b]/20 focus:border-[#3da85b] transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Location / Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {role === "SUPPLIER" ? "Production Facility Location" : "Primary Shipping Location"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3da85b]/20 focus:border-[#3da85b] transition-all"
                      placeholder="123 Output St, City, Country"
                    />
                  </div>
                </div>

                {/* Conditional Fields based on Role */}
                {role === "SUPPLIER" && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Supplier Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Building size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3da85b]/20 focus:border-[#3da85b] transition-all"
                        placeholder="My Print Shop LLC"
                      />
                    </div>
                  </div>
                )}
             </div>

             {error && (
               <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-medium border border-red-100">
                 <AlertCircle size={16} />
                 {error}
               </div>
             )}

             <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center h-8">
                  {success && (
                    <span className="flex items-center gap-2 text-[#3da85b] text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                      <CheckCircle2 size={16} />
                      Profile saved successfully!
                    </span>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                    ${saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1c211f] text-white hover:bg-black hover:-translate-y-0.5 shadow-sm active:translate-y-0'}`
                  }
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
}
