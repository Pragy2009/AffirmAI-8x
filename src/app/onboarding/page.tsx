'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { GoalSelector } from '@/features/onboarding/goal-selector';
import { MoodSelector } from '@/features/onboarding/mood-selector';
import { saveOnboarding } from '@/actions/onboarding';

const STEPS = ['goals', 'moods'] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = STEPS[step];

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function toggleMood(id: string) {
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function handleComplete() {
    if (selectedGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    selectedGoals.forEach((g) => formData.append('goals', g));
    selectedMoods.forEach((m) => formData.append('moods', m));

    try {
      const result = await saveOnboarding(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      }
    } catch {
      // redirect throws on success
    }
  }

  function handleNext() {
    if (step === 0 && selectedGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    setStep(1);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[hsl(230,25%,7%)] via-[hsl(245,30%,12%)] to-[hsl(280,25%,10%)] flex flex-col">
      {/* Ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-lg mx-auto w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step
                    ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500'
                    : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {currentStep === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                    What would you like to focus on?
                  </h1>
                  <p className="text-white/50 text-sm">
                    Select the areas that matter most to you. We&apos;ll personalize your affirmations.
                  </p>
                </div>
                <GoalSelector selected={selectedGoals} onToggle={toggleGoal} />
              </motion.div>
            )}

            {currentStep === 'moods' && (
              <motion.div
                key="moods"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                    How do you want to feel?
                  </h1>
                  <p className="text-white/50 text-sm">
                    Choose the moods that resonate with you. This helps us tailor your experience.
                  </p>
                </div>
                <MoodSelector selected={selectedMoods} onToggle={toggleMood} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 pb-8 pt-6">
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setStep(step - 1)}
              className="h-12 px-6 rounded-xl border border-white/10 text-white/70 font-medium flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={step === STEPS.length - 1 ? handleComplete : handleNext}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step === STEPS.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Start Your Journey
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
