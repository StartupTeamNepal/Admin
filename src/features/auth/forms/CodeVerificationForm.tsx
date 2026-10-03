import { useForm } from "react-hook-form";
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
import {  type VerifyRequest } from "../api/apilinks";
import { verifyAdmin } from "../api/apilinks";
type VerificationFormValues = {
  email: string;
  code: string;
};

export default function VerificationForm() {
  const { register, handleSubmit } = useForm<VerificationFormValues>({
    defaultValues: {
      email: "",
      code: "",
    },
  });

 const submit = async (values: VerifyRequest) => {
  try {
    const response = await verifyAdmin(values);

    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Verify Email
        </CardTitle>

        <CardDescription className="text-sm sm:text-base">
          Enter your email and verification code
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

          {/* Verification Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>

            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="Enter verification code"
              {...register("code", {
                required: true,
              })}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}