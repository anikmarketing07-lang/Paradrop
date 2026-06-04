import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center">
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
              colorPrimary: "#0ea5e9",
              colorBackground: "#1a2030",
              colorInputBackground: "#ffffff08",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#ffffff60",
              borderRadius: "12px",
            },
            elements: {
              rootBox: "w-full flex justify-center",
              card: "w-full shadow-2xl shadow-sky-600/10 border border-white/[0.06]",
              formButtonPrimary: "bg-sky-600 hover:bg-sky-500",
            }
          }}
        />
      </div>
    </div>
  );
}
