import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { ShowflowLogo } from './ShowflowLogo';
import { eventImages } from '../data/imageAssets';
import { ImageWithFallback } from './ImageWithFallback';

interface PatronLoginViewProps {
  onNavigate: (screen: string) => void;
  onOpenBrandSplash: () => void;
}

export const PatronLoginView: React.FC<PatronLoginViewProps> = ({
  onNavigate,
  onOpenBrandSplash,
}) => {
  const [authTab, setAuthTab] = useState<'mobile' | 'email'>('mobile');
  const [mobileNum, setMobileNum] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!otpSent || resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digits = val.replace(/[^0-9]/g, '');
    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, 6 - index).split('');
      setOtpDigits((current) => {
        const next = [...current];
        pastedDigits.forEach((digit, offset) => { next[index + offset] = digit; });
        return next;
      });
      otpInputRefs.current[Math.min(index + pastedDigits.length, 5)]?.focus();
      return;
    }
    const clean = digits.slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleSendOtp = () => {
    const normalizedPhone = mobileNum.replace(/\D/g, '');
    if (normalizedPhone.length !== 10) {
      setFormError('Enter a valid 10-digit mobile number.');
      return;
    }
    setMobileNum(normalizedPhone);
    setFormError('');
    setOtpSent(true);
    setResendTimer(30);
    setOtpDigits(Array(6).fill(''));
    showNotice('Preview code: 123456. No SMS will be sent.');
  };

  const handleVerifyOtp = () => {
    if (otpDigits.join('') !== '123456') {
      setFormError('That code does not match. Enter the 6-digit preview code shown above.');
      return;
    }
    setFormError('');
    onNavigate('seating');
  };

  const handleEmailSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput) || passwordInput.length < 8) {
      setFormError('Enter a valid email address and a password of at least 8 characters.');
      return;
    }
    setFormError('');
    onNavigate('seating');
  };

  return (
    <div className="vv-login-page relative isolate min-h-screen bg-[#f7f6f4] text-[#1b1a1a] flex flex-col">
      <div className="vv-login-background fixed inset-0 z-0 pointer-events-none">
        <ImageWithFallback src={eventImages.loginBackdrop} alt="" className="h-full w-full object-cover object-center" />
        <div className="vv-login-background-overlay absolute inset-0" />
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#262323] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#e43645]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="vv-login-header relative z-10 w-full border-b border-[#e9e5e2] bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left Brand Lockup */}
        <div className="flex items-center gap-3">
          <button onClick={onOpenBrandSplash} title="Showflow" className="cursor-pointer text-left">
            <ShowflowLogo size="md" subtitle="Nights, found" darkText />
          </button>
        </div>

        {/* Right Utility Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 text-xs text-[#716b68]">
            <Phone className="w-3.5 h-3.5 text-[#d52b3a]" />
              <span>Need a hand?</span>
            <strong className="text-[#272322] font-mono tabular-nums">+91 80 4000 5000</strong>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#d52b3a] hover:text-[#a91d2b] px-2 py-1.5 cursor-pointer"
          >
            <span>Explore shows</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
        </div>
      </header>

      <main className="vv-login-main relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center overflow-hidden px-4 py-5 sm:px-7 lg:px-8 lg:py-7">
        <section className="vv-login-panel relative z-10 flex w-full items-center justify-center">
          <div className="vv-login-form w-full max-w-md p-6 sm:p-9">
            {/* Top Centered Logo Box & Heading */}
            <div className="space-y-2 text-left">
              <h2 className="font-display pt-1 text-2xl font-extrabold text-[#211f1e]">
                Sign in to Showflow.
              </h2>
              <p className="text-sm leading-relaxed text-[#716b68]">
                Choose mobile or email to continue.
              </p>
            </div>

            {/* Segmented Mode Tabs */}
            <div className="mt-5 grid grid-cols-2 rounded-lg border border-[#e6dfdc] bg-[#f7f5f4] p-1" role="tablist" aria-label="Sign-in method">
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'mobile'}
                onClick={() => { setAuthTab('mobile'); setFormError(''); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authTab === 'mobile'
                    ? 'bg-[#d52b3a] text-white shadow-sm'
                      : 'text-[#716b68] hover:text-[#211f1e]'
                }`}
              >
                Mobile
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'email'}
                onClick={() => { setAuthTab('email'); setFormError(''); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authTab === 'email'
                    ? 'bg-[#d52b3a] text-white shadow-sm'
                      : 'text-[#716b68] hover:text-[#211f1e]'
                }`}
              >
                Email
              </button>
            </div>

            {authTab === 'mobile' ? (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="mobile-number" className="mb-1.5 block text-xs font-bold text-[#373230]">
                    Mobile number <span className="text-[#d52b3a]">*</span>
                  </label>
                  <div className="flex items-center overflow-hidden rounded-lg border border-[#d9d2cf] bg-white focus-within:border-[#d52b3a] focus-within:ring-2 focus-within:ring-[#d52b3a]/10">
                    <div className="flex shrink-0 items-center gap-1.5 border-r border-[#e6dfdc] bg-[#faf9f8] px-3 py-3 text-sm font-bold text-[#393431]">
                      <span aria-hidden="true">🇮🇳</span>
                      <span className="tabular-nums">+91</span>
                    </div>
                    <input
                      id="mobile-number"
                      type="tel"
                      value={mobileNum}
                      onChange={(e) => {
                        setMobileNum(e.target.value);
                        setOtpSent(false);
                        setResendTimer(0);
                        setOtpDigits(Array(6).fill(''));
                        setFormError('');
                      }}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="10-digit mobile number"
                      aria-describedby="mobile-help"
                      className="w-full bg-transparent px-3.5 py-3 text-sm font-semibold text-[#211f1e] outline-none placeholder:font-normal placeholder:text-[#9b928e] tabular-nums"
                    />
                  </div>
                  <p id="mobile-help" className="mt-2 text-xs text-[#817976]">We’ll show a local preview code. No SMS is sent.</p>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSent && resendTimer > 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#d52b3a] py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#b92231] disabled:cursor-not-allowed disabled:bg-[#d7a0a4]"
                >
                  <span>{otpSent ? resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend preview code' : 'Continue with mobile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {otpSent && <div className="space-y-3.5 rounded-lg border border-[#ecd1d3] bg-[#fff8f8] p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#716b68]">Preview code for:</span>
                    <strong className="font-mono text-[#211f1e] tabular-nums">
                      +91 {mobileNum.slice(0, 5)} {mobileNum.slice(5)}
                    </strong>
                  </div>
                  <p className="text-xs font-bold text-[#d52b3a]">Demo code: 123456</p>

                  <div className="grid grid-cols-6 gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(element) => { otpInputRefs.current[idx] = element; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        value={digit}
                        aria-label={`OTP digit ${idx + 1}`}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Backspace' && !digit && idx > 0) otpInputRefs.current[idx - 1]?.focus();
                        }}
                        className="h-11 w-full rounded-md border border-[#d9d2cf] bg-white text-center font-mono text-sm font-bold text-[#211f1e] outline-none focus:border-[#d52b3a] focus:ring-2 focus:ring-[#d52b3a]/10"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpDigits.join('').length !== 6}
                    className="w-full rounded-lg bg-[#211f1e] py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#383331] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Verify preview code
                  </button>
                </div>}
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="mt-5 space-y-3.5">
                <div>
                  <label htmlFor="login-email" className="mb-1 block text-xs font-bold text-[#373230]">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#d9d2cf] bg-white px-3.5 py-3 text-sm text-[#211f1e] outline-none placeholder:text-[#9b928e] focus:border-[#d52b3a] focus:ring-2 focus:ring-[#d52b3a]/10"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-1 block text-xs font-bold text-[#373230]">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoComplete="current-password"
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-[#d9d2cf] bg-white px-3.5 py-3 text-sm text-[#211f1e] outline-none placeholder:text-[#9b928e] focus:border-[#d52b3a] focus:ring-2 focus:ring-[#d52b3a]/10"
                  />
                </div>
                <button type="submit" className="w-full rounded-lg bg-[#d52b3a] py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#b92231]">
                  Continue with email
                </button>
              </form>
            )}

            {formError && <p role="alert" className="mt-4 rounded-md border border-[#edc8cc] bg-[#fff2f3] px-3 py-2 text-xs font-semibold text-[#a81f2c]">{formError}</p>}

            <p className="mt-5 border-t border-[#eee9e6] pt-4 text-xs leading-relaxed text-[#817976]">
              Demo access only. No SMS is sent and no payment is processed.
            </p>

          </div>
        </section>
      </main>
    </div>
  );
};
