"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { IconBrandGoogle } from "@tabler/icons-react";
// import { useLogin } from "./services/hooks/login/login";
import Cookies from "js-cookie";
import { useState } from "react";
import { Eye, EyeOff, Terminal } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useLogin } from "@/services/hooks/auth";
import { useUserStore } from "./providers/userStoreProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputMotions } from "@/components/inputMotions";
// import { useUserStore } from "./providers/userStoreProvider";

const formSchema = z.object({
  email: z.string().min(5, { message: "Username Harus Diisi." }),
  password: z.string().min(5, { message: "Password Harus Diisi." }),
});
interface data {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { name, setName } = useUserStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, error } = useLogin({
    onSuccess: async (res) => {
      const datas = res;
      const token = datas.accessToken;
      if (token) {
        setName(datas.user.name);
        localStorage.setItem("token", token);
        Cookies.set("token", token);
        router.push("/projects");
      } else {
        console.error("Invalid response data");
      }
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate({
      body: {
        email: values.email,
        password: values.password,
      },
    });
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        {/* <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 w-full"> */}
        {!!error && (
          <Alert variant="default">
            <Terminal />
            <AlertTitle>Oopss!</AlertTitle>
            <AlertDescription>Something Wrong Bro!</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h3 className="w-full item-center justify-center text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-cyan-500 to-blue-500 bg-">
              Dashboard Boilerplate Next
            </h3>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputMotions placeholder="Masukan Email" {...field} />
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
                    <div className="relative">
                      <InputMotions
                        placeholder="Masukan Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full justify-content-center items-center font-bold"
            >
              {/* {isLoading ? "Logging in..." : "Login to your account"} */}
              Login to your account
            </Button>
            <Button
              type="submit"
              className="w-full justify-content-center items-center font-bold"
            >
              {/* {isLoading ? "Logging in..." : "Login to your account"} */}
              <IconBrandGoogle className="h-4 w-4 bg-primary" />
              Login With Google Account
            </Button>
          </form>
        </Form>
        {/* </div> */}
        <div className="w-full mt-4 mb-0 text-sm text-center justify-content-center items-center font-bold">
          Created By - Teguh Kurniawan
        </div>
      </BackgroundGradient>
    </div>
  );
}
