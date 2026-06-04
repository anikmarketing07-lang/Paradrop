import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080f] px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-bold text-lg text-white">LeadDrop</span>
          </div>
        </div>
        <SignIn
          forceRedirectUrl="/app"
          fallbackRedirectUrl="/app"
          appearance={{
            variables: {
              colorPrimary: "#7c3aed",
              colorBackground: "#0d0d18",
              colorInputBackground: "#ffffff08",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#ffffff60",
              borderRadius: "12px",
            },
            elements: {
              rootBox: "w-full flex justify-center",
              card: "w-full shadow-2xl shadow-violet-600/10 border border-white/[0.06]",
              formButtonPrimary: "bg-violet-600 hover:bg-violet-500",
            }
          }}
        />
      </div>
    </div>
  );
}
