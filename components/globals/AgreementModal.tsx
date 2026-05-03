"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AgreementModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("CUSTOMER");
  const [accepted, setAccepted] = useState(false);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAgreement = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role, terms_accepted")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUserRole(profile.role || "CUSTOMER");
          setUserProfileId(profile.id);
          
          if (profile.terms_accepted === false || profile.terms_accepted === null) {
            setShowModal(true);
          }
        }
      } catch (err) {
        console.error("Error checking user agreement:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAgreement();

    // Listen for auth changes to recheck
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        checkUserAgreement();
      } else if (event === "SIGNED_OUT") {
        setShowModal(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname]); // Re-check if pathname changes just to be safe, though context is better

  const handleAccept = async () => {
    if (!accepted || !userProfileId) return;
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ terms_accepted: true })
        .eq("id", userProfileId);

      if (error) throw error;
      
      setShowModal(false);
      // Redirect to landing page as requested
      router.push("/");
    } catch (err) {
      console.error("Error updating agreement status:", err);
      alert("Something went wrong saving your agreement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          
          {userRole === "SUPPLIER" ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Supplier Partner Agreement
              </h2>
              <p className="text-gray-600 text-sm font-medium">Welcome to the Printora Fulfillment Network. By proceeding, you agree to the following Service Level Agreement (SLA) & expectations:</p>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-sm text-gray-700 space-y-3 font-medium">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Quality Assurance:</strong> You commit to producing garments and prints that meet or exceed Printora's standard quality guidelines.</li>
                  <li><strong>Fulfillment SLA:</strong> You agree to fulfill and ship accepted orders within 3-5 business days. Repeatedly missing this deadline may result in account suspension.</li>
                  <li><strong>Revenue Split:</strong> Payouts for fulfilled orders will be transferred to your designated account based on the agreed wholesale rates, minus Printora platform fees.</li>
                  <li><strong>Confidentiality:</strong> Customer data and user-uploaded designs are provided strictly for fulfillment purposes and may not be retained, shared, or used for your own marketing.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Welcome to Printora!
              </h2>
              <p className="text-gray-600 text-sm font-medium">Before you start creating and ordering your custom print products, please review and accept our platform agreements:</p>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-sm text-gray-700 space-y-3 font-medium">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Content Policy:</strong> You agree that any designs, logos, or texts you upload for printing are owned by you or you have the right to use them. Printora does not print hateful, infringing, or illegal materials.</li>
                  <li><strong>Fulfillment & Shipping:</strong> Orders are fulfilled by our network of local Supplier Partners. Fulfillment times are estimates.</li>
                  <li><strong>Returns:</strong> Custom printed products are generally non-refundable unless there is a material defect or printing error.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <label className="flex items-start gap-3 cursor-pointer group mb-5">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" 
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3da85b]/20 focus:outline-none checked:bg-[#3da85b] checked:border-[#3da85b] transition-all cursor-pointer"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <CheckCircle2 size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
              I have read and agree to the {userRole === "SUPPLIER" ? "Supplier Partner Agreement" : "Terms of Service and Privacy Policy"}.
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!accepted || submitting}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-sm
              ${(!accepted || submitting) 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#1c211f] text-white hover:bg-black hover:-translate-y-0.5 shadow-md active:translate-y-0'
              }`}
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Confirming...' : 'Accept & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
