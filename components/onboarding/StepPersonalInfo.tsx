"use client";

import { AnimatePresence, m } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useWatch } from "react-hook-form";
import { FormInput } from "./FormInput";
import { OptionGroup } from "./OptionGroup";
import { QuestionPanel } from "./QuestionPanel";
import { GENDER_OPTIONS } from "@/lib/options";
import type { FormValues } from "@/types/form";

function WeightDelta() {
  const [current, goal] = useWatch<FormValues, ["currentWeight", "goalWeight"]>({ name: ["currentWeight", "goalWeight"] });
  const c = Number(current);
  const g = Number(goal);
  const valid = current !== "" && goal !== "" && c >= 25 && g >= 25 && c <= 350 && g <= 350;
  const diff = Math.round((g - c) * 10) / 10;

  let text = "";
  if (valid) {
    text = diff === 0 ? "Maintaining your current weight" : `${Math.abs(diff)} kg to ${diff < 0 ? "lose" : "gain"}`;
  }
  const Icon = diff < 0 ? TrendingDown : diff > 0 ? TrendingUp : Minus;

  return (
    <div aria-live="polite">
      <AnimatePresence initial={false}>
        {text && (
          <m.p
            key="delta"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-soft px-2 py-1 text-[13px] text-muted ring-1 ring-line">
              <Icon aria-hidden className="size-3.5" strokeWidth={2} />
              {text}
            </span>
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StepPersonalInfo() {
  return (
    <>
      <QuestionPanel>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4">
          <FormInput
            name="name"
            label="Full name"
            placeholder="Your full name"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            className="col-span-2"
          />
          <FormInput
            name="age"
            label="Age"
            type="number"
            inputMode="numeric"
            placeholder="26"
            min={13}
            max={100}
            step={1}
            suffix="years"
            enterKeyHint="next"
            className="col-span-2 sm:col-span-1"
          />
          <FormInput
            name="profession"
            label="Profession"
            placeholder="e.g. Software engineer"
            autoComplete="organization-title"
            autoCapitalize="sentences"
            enterKeyHint="next"
            className="col-span-2 sm:col-span-1"
          />
          <div className="col-span-2">
            <OptionGroup
              name="gender"
              legend="Gender"
              variant="field"
              size="sm"
              options={GENDER_OPTIONS}
              gridClassName="grid-cols-2"
            />
          </div>
        </div>
      </QuestionPanel>

      <QuestionPanel kicker="Measurements & location">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4">
          <FormInput
            name="height"
            label="Height"
            type="number"
            inputMode="decimal"
            placeholder="175"
            min={100}
            max={250}
            step="any"
            suffix="cm"
            enterKeyHint="next"
            className="col-span-2 sm:col-span-1"
          />
          <FormInput
            name="currentWeight"
            label="Current weight"
            type="number"
            inputMode="decimal"
            placeholder="78"
            min={25}
            max={350}
            step="any"
            suffix="kg"
            enterKeyHint="next"
          />
          <FormInput
            name="goalWeight"
            label="Goal weight"
            type="number"
            inputMode="decimal"
            placeholder="70"
            min={25}
            max={350}
            step="any"
            suffix="kg"
            enterKeyHint="next"
          />
          <div className="col-span-2 -mt-5 sm:col-span-3">
            <WeightDelta />
          </div>
          <FormInput
            name="place"
            label="Place"
            placeholder="e.g. Kochi, Kerala"
            autoComplete="address-level2"
            autoCapitalize="words"
            enterKeyHint="go"
            className="col-span-2 sm:col-span-3"
          />
        </div>
      </QuestionPanel>
    </>
  );
}
