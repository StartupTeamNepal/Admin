 import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAccessToken } from "@/shared/api/authStorage";

import { loginAdmin } from "@/features/auth/api/apilinks";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, watch } =
    useForm<LoginFormValues>({
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    });

  const rememberMe = watch("rememberMe");

const submit = async (values: LoginFormValues) => {
  if (!values.email.trim() || !values.password.trim()) {
    toast.error("Please enter both email and password");
    return;
  }

  try {
    const response = await loginAdmin({
      email: values.email,
      password: values.password,
    });

    // Store access token
    setAccessToken(response.data.token);

    // Store refresh token
    localStorage.setItem("refreshToken", response.data.refreshToken);

    // Store expiration time
    localStorage.setItem("expiresAt", response.data.expiresAt);

    // Optional: store user information
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("user", JSON.stringify({
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role,
      restaurantName: response.data.restaurantName,
    }));

    toast.success(response.message);

    navigate("/", { replace: true });
  } catch (error: any) {
    console.error("Login error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Invalid email or password. Please try again."
    );
  }
};

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Login
        </CardTitle>

        <CardDescription className="text-sm sm:text-base">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(submit)}>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: true,
              })}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password">Password</Label>

              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground hover:underline sm:text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("password", {
                  required: true,
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setValue("rememberMe", Boolean(checked))
              }
            />

            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium"
            >
              Remember me
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Sign In */}
          <Button type="submit" className="w-full">
            Sign In
          </Button>

          {/* Sign Up */}
          <div className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Don't have an account?</span>

            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
 