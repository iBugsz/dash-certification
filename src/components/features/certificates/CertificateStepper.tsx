"use client";

import { Check, Loader2 } from "lucide-react";

const STEPS = [{ id: 1 }, { id: 2 }, { id: 3 }];

interface Props {
  currentStep: number;
  isProcessing: boolean;
  getStepperWidth: () => string;
}

export function CertificateStepper({
  currentStep,
  isProcessing,
  getStepperWidth,
}: Props) {
  return (
    <>
      <style>{`
        @keyframes stepperPulse {
          0%   { width: 50%; }
          50%  { width: 82%; }
          100% { width: 50%; }
        }
        .stepper-pulse {
          animation: stepperPulse 1.6s ease-in-out infinite;
        }
      `}</style>
      <div className="relative flex justify-between max-w-xs mx-auto items-center mb-12">
        <div
          className="absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 z-0"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="absolute top-1/2 left-0 h-[3px] transition-all duration-300 ease-out z-0"
          style={{ width: getStepperWidth(), backgroundColor: "var(--accent)" }}
        />
        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all"
              style={{
                backgroundColor:
                  currentStep >= step.id ? "var(--accent)" : "var(--card)",
                borderColor:
                  currentStep >= step.id ? "var(--card)" : "var(--border)",
                color:
                  currentStep >= step.id ? "white" : "var(--sidebar-fg-muted)",
              }}
            >
              {step.id === 3 && isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
