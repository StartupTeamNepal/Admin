import { useState, type ReactNode } from "react";
import {
  Controller,
  useForm,
  type FieldPath,
  type FieldErrors,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../api/apilinks";
import { isAxiosError } from "axios";

type Values = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  restaurantName: string;
  businessType: string;
  cuisineType: string;
  description: string;
  phone: string;
  alternativePhone: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  googleMapsUrl: string;
  businessRegistrationNumber: string;
  taxVatNumber: string;
  openingTime: string;
  closingTime: string;
};

const BUSINESS_TYPES = ["Restaurant", "Café", "Bakery", "Bar & Pub", "Cloud kitchen", "Food truck"];
const CUISINES = ["Nepali", "Indian", "Chinese", "Italian", "Continental", "Fast food", "Café & Bakery", "Other"];

const STEPS: {
  title: string;
  description: string;
  fields: FieldPath<Values>[];
}[] = [
  {
    title: "Account",
    description: "Your login details.",
    fields: ["fullName", "email", "password", "confirmPassword"],
  },
  {
    title: "Restaurant",
    description: "What customers will see.",
    fields: ["restaurantName", "businessType", "cuisineType", "description", "phone", "alternativePhone"],
  },
  {
    title: "Location",
    description: "Where you operate.",
    fields: ["streetAddress", "city", "stateProvince", "postalCode", "country", "googleMapsUrl"],
  },
  {
    title: "Business",
    description: "Legal details and hours.",
    fields: ["businessRegistrationNumber", "taxVatNumber", "openingTime", "closingTime"],
  },
];

function Field({
  id,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="flex items-baseline justify-between">
        <span>{label}</span>
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">Optional</span>
        )}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function TextField({
  id,
  label,
  reg,
  errors,
  ...rest
}: {
  id: FieldPath<Values>;
  label: string;
  reg: UseFormRegisterReturn;
  errors: FieldErrors<Values>;
  type?: string;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "numeric" | "text";
}) {
  const { hint, optional, className, ...inputProps } = rest;
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      className={className}
      error={errors[id]?.message as string | undefined}
    >
      <Input
        id={id}
        aria-invalid={!!errors[id]}
        {...inputProps}
        {...reg}
      />
    </Field>
  );
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function RestaurantRegistrationForm() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      restaurantName: "",
      businessType: "",
      cuisineType: "",
      description: "",
      phone: "",
      alternativePhone: "",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "Nepal",
      googleMapsUrl: "",
      businessRegistrationNumber: "",
      taxVatNumber: "",
      openingTime: "09:00",
      closingTime: "21:00",
    },
  });

  const password = watch("password");
  const description = watch("description");
  const strength = passwordStrength(password);
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];
  const isLast = step === STEPS.length - 1;

  const next = async () => {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep((s) => s + 1);
    else toast.error("Please fix the highlighted fields.");
  };

const submit = async (values: Values) => {
  try {
    const res = await registerAdmin(
    values
     );

    toast.success(res.message || "Account created successfully.");
    reset();
    setStep(0);
    navigate("/login");
  } catch (error) {
    const message =
      isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "We couldn't create your account. Please try again.";
    toast.error(message);
  }
};
  const required = (msg: string) => ({ required: msg });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-10">
      {/* Progress */}
      <nav aria-label="Progress" className="mb-6">
        <ol className="flex items-center">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.title} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                <div className="flex items-center gap-2">
                  <span
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                      done && "border-primary bg-primary text-primary-foreground",
                      current && "border-primary text-primary ring-4 ring-primary/15",
                      !done && !current && "text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm font-medium sm:inline",
                      current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("mx-3 h-px flex-1", done ? "bg-primary" : "bg-border")} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <CardTitle className="text-2xl">
            {step === 0 ? "Create your restaurant account" : STEPS[step].title}
          </CardTitle>
          <CardDescription>{STEPS[step].description}</CardDescription>
        </CardHeader>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (isLast) handleSubmit(submit)(e);
            else next();
          }}
        >
          <CardContent>
            {/* Step 1: Account */}
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="fullName"
                  label="Full name"
                  placeholder="Your name"
                  autoComplete="name"
                  reg={register("fullName", required("Enter your full name"))}
                  errors={errors}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@restaurant.com"
                  autoComplete="email"
                  reg={register("email", {
                    required: "Enter your email",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                  })}
                  errors={errors}
                />

                <Field
                  id="password"
                  label="Password"
                  error={errors.password?.message}
                  className="sm:col-span-2"
                >
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10"
                      aria-invalid={!!errors.password}
                      {...register("password", {
                        required: "Create a password",
                        minLength: { value: 8, message: "Use at least 8 characters" },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            className={cn(
                              "h-1 flex-1 rounded-full bg-muted transition-colors",
                              strength >= n &&
                                (strength <= 1
                                  ? "bg-destructive"
                                  : strength <= 2
                                  ? "bg-amber-500"
                                  : "bg-emerald-500")
                            )}
                          />
                        ))}
                      </div>
                      <span className="w-14 text-right text-xs text-muted-foreground">
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </Field>

                <TextField
                  id="confirmPassword"
                  label="Confirm password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="sm:col-span-2"
                  reg={register("confirmPassword", {
                    required: "Re-enter your password",
                    validate: (v) => v === getValues("password") || "Passwords don't match",
                  })}
                  errors={errors}
                />
              </div>
            )}

            {/* Step 2: Restaurant */}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="restaurantName"
                  label="Restaurant name"
                  placeholder="e.g. Himalayan Kitchen"
                  className="sm:col-span-2"
                  reg={register("restaurantName", required("Enter your restaurant's name"))}
                  errors={errors}
                />

                {(
                  [
                    ["businessType", "Business type", BUSINESS_TYPES],
                    ["cuisineType", "Cuisine", CUISINES],
                  ] as const
                ).map(([name, label, options]) => (
                  <Field key={name} id={name} label={label} error={errors[name]?.message}>
                    <Controller
                      name={name}
                      control={control}
                      rules={required(`Select a ${label.toLowerCase()}`)}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id={name} className="w-full" aria-invalid={!!errors[name]}>
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                ))}

                <Field
                  id="description"
                  label="Description"
                  className="sm:col-span-2"
                  error={errors.description?.message}
                  hint={`${description.length}/300 · A short intro customers will see.`}
                >
                  <Textarea
                    id="description"
                    maxLength={300}
                    placeholder="Family-run kitchen serving traditional dishes since 2015…"
                    className="min-h-24 resize-none"
                    aria-invalid={!!errors.description}
                    {...register("description", required("Add a short description"))}
                  />
                </Field>

                <TextField
                  id="phone"
                  label="Phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+977 98XXXXXXXX"
                  reg={register("phone", {
                    required: "Enter a phone number",
                    pattern: { value: /^[+\d][\d\s-]{6,}$/, message: "Enter a valid phone number" },
                  })}
                  errors={errors}
                />
                <TextField
                  id="alternativePhone"
                  label="Alternative phone"
                  type="tel"
                  inputMode="tel"
                  optional
                  placeholder="+977 98XXXXXXXX"
                  reg={register("alternativePhone")}
                  errors={errors}
                />
              </div>
            )}

            {/* Step 3: Location */}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="streetAddress"
                  label="Street address"
                  autoComplete="street-address"
                  placeholder="Street, tole, house number"
                  className="sm:col-span-2"
                  reg={register("streetAddress", required("Enter the street address"))}
                  errors={errors}
                />
                <TextField id="city" label="City" autoComplete="address-level2" reg={register("city", required("Enter a city"))} errors={errors} />
                <TextField id="stateProvince" label="State / Province" autoComplete="address-level1" reg={register("stateProvince", required("Enter a state or province"))} errors={errors} />
                <TextField id="postalCode" label="Postal code" autoComplete="postal-code" reg={register("postalCode", required("Enter a postal code"))} errors={errors} />
                <TextField id="country" label="Country" autoComplete="country-name" reg={register("country", required("Enter a country"))} errors={errors} />
                <TextField
                  id="googleMapsUrl"
                  label="Google Maps link"
                  type="url"
                  optional
                  className="sm:col-span-2"
                  placeholder="https://maps.google.com/…"
                  hint="Helps customers and delivery riders find you."
                  reg={register("googleMapsUrl")}
                  errors={errors}
                />
              </div>
            )}

            {/* Step 4: Business */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="businessRegistrationNumber"
                    label="Business registration no."
                    reg={register("businessRegistrationNumber", required("Enter your registration number"))}
                    errors={errors}
                  />
                  <TextField
                    id="taxVatNumber"
                    label="PAN / VAT number"
                    reg={register("taxVatNumber", required("Enter your tax or VAT number"))}
                    errors={errors}
                  />
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">Daily opening hours</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="openingTime" label="Opens at" type="time" reg={register("openingTime", required("Set an opening time"))} errors={errors} />
                    <TextField id="closingTime" label="Closes at" type="time" reg={register("closingTime", required("Set a closing time"))} errors={errors} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can set different hours for each day after signing up.
                  </p>
                </fieldset>
              </div>
            )}
          </CardContent>

          <CardFooter className="mt-6 justify-between border-t pt-6">
                <Button
                type="button"
                variant="ghost"
                onClick={() => {
                    if (step === 0) {
                    navigate("/login");
                    } else {
                    setStep((s) => s - 1);
                    }
                }}
                disabled={isSubmitting}
                >
                <ArrowLeft className="size-4" />
                Back
                </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account…
                </>
              ) : isLast ? (
                "Create account"
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <a href="/login" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </a>
      </p>
    </div>
  );
}