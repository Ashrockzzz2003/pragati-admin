"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { hashPassword } from "@/lib/hash";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            // console.log("[DEBUG] Logging in with:", {
            //   userEmail: email,
            //   userPassword: password,
            // })
            // console.log("[DEBUG] Fetching from:", api.LOGIN_URL)
            const response = await fetch(api.LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: email,
                    userPassword: hashPassword(password),
                }),
            });

            switch (response.status) {
                case 200:
                    const {
                        DATA: { roleID, TOKEN, USER },
                    } = await response.json();

                    if (roleID !== 1) {
                        alert("You are not authorized to access this page");
                        return;
                    }

                    secureLocalStorage.clear();
                    secureLocalStorage.setItem("t", TOKEN);
                    secureLocalStorage.setItem("u", JSON.stringify(USER));

                    router.replace("/dashboard");
                    break;
                case 400:
                    const { MESSAGE } = await response.json();
                    alert(MESSAGE);
                    break;
                case 500:
                    alert(
                        "We are facing some issues at the moment. We are working on it. Please try again later.",
                    );
                    break;
                default:
                    alert(
                        "Something went wrong. Please refresh the page and try again later.",
                    );
                    break;
            }
        } catch (error) {
            console.error(error);
            alert(
                "Something went wrong. Please refresh the page and try again later.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Welcome to Admin Console
                    </CardTitle>
                    <CardDescription>
                        Login with your college official email. Contact the dev
                        team for password if you don&apos;t have one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your Amrita Email Address"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Link
                                            href="https://pragati.amrita.edu/resetPassword"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Visit Pragati 2025?{" "}
                                <Link
                                    href="https://pragati.amrita.edu"
                                    className="underline underline-offset-4"
                                >
                                    Click here
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our{" "}
                <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    );
}
