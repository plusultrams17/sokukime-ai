export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="loader"
        >
          {/* Outer frame */}
          <path
            pathLength="360"
            d="M32 2C15.43 2 2 15.43 2 32s13.43 30 30 30 30-13.43 30-30S48.57 2 32 2z"
          />
          {/* Inner frame */}
          <path
            pathLength="360"
            d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6z"
          />
          {/* Left hand - sleeve */}
          <path
            pathLength="360"
            d="M10 36c0 0 4-2 8-2s6 1 8 3"
          />
          {/* Left hand - wrist and palm */}
          <path
            pathLength="360"
            d="M18 34c1.5-1 3-1.5 5-1 2 0.5 3 2 4 3.5 1 1.5 1.5 2.5 1 4-0.5 1.5-2 2.5-3.5 2.5"
          />
          {/* Left fingers */}
          <path
            pathLength="360"
            d="M24.5 43c-1 0-2-0.3-3-1s-2-1.5-2.5-2.5"
          />
          <path
            pathLength="360"
            d="M19 39.5c-0.5-1-0.5-2 0-3s1.5-1.5 2.5-1.5"
          />
          {/* Right hand - sleeve */}
          <path
            pathLength="360"
            d="M54 36c0 0-4-2-8-2s-6 1-8 3"
          />
          {/* Right hand - wrist and palm */}
          <path
            pathLength="360"
            d="M46 34c-1.5-1-3-1.5-5-1-2 0.5-3 2-4 3.5-1 1.5-1.5 2.5-1 4 0.5 1.5 2 2.5 3.5 2.5"
          />
          {/* Right fingers */}
          <path
            pathLength="360"
            d="M39.5 43c1 0 2-0.3 3-1s2-1.5 2.5-2.5"
          />
          <path
            pathLength="360"
            d="M45 39.5c0.5-1 0.5-2 0-3s-1.5-1.5-2.5-1.5"
          />
          {/* Handshake clasp center */}
          <path
            pathLength="360"
            d="M28 37c1-1.5 2.5-2.5 4-2.5s3 1 4 2.5c0.8 1.2 1 2.5 0.5 3.5-0.5 1-1.5 1.5-2.5 1.5h-4c-1 0-2-0.5-2.5-1.5s-0.3-2.3 0.5-3.5z"
          />
          {/* Thumb overlap */}
          <path
            pathLength="360"
            d="M27 36.5c0.5-0.8 1.5-1.2 2.5-1 1 0.2 1.5 1 1.5 2"
          />
          <path
            pathLength="360"
            d="M37 36.5c-0.5-0.8-1.5-1.2-2.5-1-1 0.2-1.5 1-1.5 2"
          />
          {/* Upper sparkle lines (deal energy) */}
          <path
            pathLength="360"
            d="M32 22v-4"
          />
          <path
            pathLength="360"
            d="M26 24l-2-3"
          />
          <path
            pathLength="360"
            d="M38 24l2-3"
          />
          <path
            pathLength="360"
            d="M22 28l-3-1"
          />
          <path
            pathLength="360"
            d="M42 28l3-1"
          />
          {/* Small trust dots */}
          <path
            pathLength="360"
            d="M32 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          />
          <path
            pathLength="360"
            d="M23 20a0.8 0.8 0 1 0 0-1.6 0.8 0.8 0 0 0 0 1.6z"
          />
          <path
            pathLength="360"
            d="M41 20a0.8 0.8 0 1 0 0-1.6 0.8 0.8 0 0 0 0 1.6z"
          />
          {/* Lower handshake support line */}
          <path
            pathLength="360"
            d="M24 44c2 2 5 3 8 3s6-1 8-3"
          />
          {/* Cuff details */}
          <path
            pathLength="360"
            d="M12 35c0-1 1-2 3-2.5"
          />
          <path
            pathLength="360"
            d="M52 35c0-1-1-2-3-2.5"
          />
        </svg>
        <p className="text-sm font-medium text-muted tracking-wide animate-pulse">
          成約コーチAI
        </p>
      </div>
    </div>
  );
}
