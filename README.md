# Fabil — Client Onboarding

Premium multi-step intake form for Fabil's personal coaching. Frontend only — submission is mocked.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Hook Form · Zod · Framer Motion · Lucide.
Font: Geist, bundled in `app/fonts` and loaded with `next/font/local`, so builds work offline.
Design tokens (ivory, surface, ink, lime, sage, borders…) live in the `@theme` block of `app/globals.css`.
`components.json` is included so `npx shadcn add <component>` works if you want shadcn/ui primitives later.

## Structure
```
app/                      layout, page, global styles (theme tokens in globals.css @theme)
components/onboarding/
  OnboardingExperience    phase controller: splash → intro → form → success
  SplashScreen            "READY FOR TRANSFORMATION" intro (skippable, once per 6h, reduced-motion aware)
  Hero                    intro screen
  OnboardingForm          RHF + per-step Zod resolver, navigation, focus mgmt, draft persistence
  ProgressIndicator       segmented (desktop) / compact bar (mobile)
  FormStep                shared step layout (intro column + question panels)
  QuestionPanel           white surface wrapping one question / related group
  StepPersonalInfo / StepGoals / StepLifestyle / StepCommitment / StepReview
  SuccessScreen           lazy-loaded
  OptionCard / OptionGroup  accessible custom radios (real <input type="radio">)
  FormInput / FormTextarea / FieldError / StepNavigation / ActionButton / Background / BrandMark
lib/
  validation.ts           Zod step schemas, EMPTY_FORM, toMemberFormData()
  options.ts              option lists + labels
  steps.ts                step titles/copy
  submit.ts               mock submit — replace with your API call
  draft.ts                sessionStorage draft (survives Instagram/WhatsApp in-app reloads)
types/form.ts             MemberFormData (API payload) + FormValues (raw form state)
```

## Connecting a backend
Replace the body of `submitMemberForm()` in `lib/submit.ts` with a `fetch` to your endpoint.
It already receives a clean, typed `MemberFormData` (numbers as numbers, yes/no as booleans).
