import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { useLoginMutation } from "@/core/requests/mutations/use-login-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LocalStorageKeys } from "@/core/constants/local-storage-keys";
import { useNavigate } from "react-router";
import { AppRoutes } from "@/core/constants/app-routes";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useLocalStorage<string>(LocalStorageKeys.ACCESS_TOKEN);

  const { mutate: login } = useLoginMutation({
    onSuccess: ({ accessToken }) => setAccessToken(accessToken),
  });

  useEffect(() => {
    if (accessToken) {
      navigate(AppRoutes.DASHBOARD);
    }
  }, [accessToken, navigate]);

  function onSubmit(values: FormValues) {
    login({ ...values });
  }

  return (
    <Card className="min-w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>Login with your Email &amp; Password.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="mail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Login
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Register
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
