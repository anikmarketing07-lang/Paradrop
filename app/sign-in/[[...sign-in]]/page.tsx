import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2] px-4 py-8 relative overflow-hidden">
      {/* Soft ambient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
             style={{ background: "radial-gradient(circle, rgba(94,106,210,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
             style={{ background: "radial-gradient(circle, rgba(245,197,120,0.18) 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src="/paradrop-logo.png" alt="Paradrop" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-emerald-600/30" />
            <span className="font-bold text-xl text-[#08090A] tracking-tight">Paradrop</span>
          </div>
          <p className="text-sm text-[#5F5F6B]">Welcome back. Sign in to find your next client.</p>
        </div>
        <SignIn
          forceRedirectUrl="/app"
          fallbackRedirectUrl="/app"
          appearance={{
            variables: {
              colorPrimary: "#5E6AD2",
              colorBackground: "#FFFFFF",
              colorInputBackground: "#F7F6F2",
              colorInputText: "#08090A",
              colorText: "#08090A",
              colorTextSecondary: "#5F5F6B",
              colorDanger: "#dc2626",
              borderRadius: "12px",
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            },
            elements: {
              rootBox: "w-full flex justify-center",
              card: "w-full bg-white border border-[#08090A]/8 shadow-xl shadow-emerald-600/8",
              headerTitle: "text-[#08090A]",
              headerSubtitle: "text-[#5F5F6B]",
              socialButtonsBlockButton: "border border-[#08090A]/12 bg-white hover:bg-[#F7F6F2] text-[#08090A]",
              socialButtonsBlockButtonText: "text-[#08090A] font-medium",
              dividerLine: "bg-[#08090A]/10",
              dividerText: "text-[#5F5F6B]",
              formFieldLabel: "text-[#08090A]/75 font-medium text-xs uppercase tracking-wider",
              formFieldInput: "bg-[#F7F6F2] border border-[#08090A]/12 text-[#08090A] placeholder-[#08090A]/30 focus:border-emerald-600/60",
              formButtonPrimary: "bg-gradient-to-br from-emerald-600 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/30",
              footerActionLink: "text-emerald-600 hover:text-emerald-700 font-medium",
              footer: "bg-transparent",
              identityPreviewText: "text-[#08090A]/75",
              identityPreviewEditButton: "text-emerald-600",
            },
          }}
        />
      </div>
    </div>
  );
}
