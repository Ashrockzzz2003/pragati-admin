"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { generateNavItems } from "@/lib/nav-manager";
import { Binoculars, Edit3, Notebook, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
    const router = useRouter();
    const [progress, setProgress] = useState(13);

    const [events, setEvents] = useState([]);

    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });

    useEffect(() => {
        const _user =
            JSON.parse(secureLocalStorage.getItem("u") as string) ?? {};
        setProgress(50);
        if (_user.userName && _user.userEmail) {
            setUser({
                name: _user.userName,
                email: _user.userEmail,
                avatar: "https://gravatar.com/avatar/dd55aeae8806246ac1d0ab0c6baa34f5?&d=robohash&r=x",
            });
            setProgress(66);
        } else {
            router.replace("/");
        }

        fetch(api.ALL_EVENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setProgress(80);
                        res.json().then((data) => {
                            setEvents(data.DATA);
                            console.table(data.DATA);
                            setProgress(100);
                        });
                        break;
                    case 400:
                        res.json().then(({ MESSAGE }) => {
                            alert(MESSAGE);
                        });
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
            })
            .catch((err) => {
                console.error(err);
                alert(
                    "Something went wrong. Please refresh the page and try again later.",
                );
            })
            .finally(() => {
                setProgress(100);
            });
    }, [router]);

    return user.name === "" || user.email === "" || progress < 100 ? (
        <div className="flex items-center justify-center h-screen w-[50%] ml-auto mr-auto">
            <Progress value={progress} />
        </div>
    ) : (
        <SidebarProvider>
            <AppSidebar
                user={user}
                navItems={generateNavItems("/dashboard", "/dashboard")}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">
                                        Pragati 2025
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Admin Dashboard
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Events</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold">Events</h1>
                    <div className="flex flex-wrap gap-4">
                        {events.map(
                            (ev: {
                                eventID: number;
                                eventName: string;
                                eventImageUrl: string;
                            }) => (
                                <div
                                    key={ev.eventName}
                                    className="flex flex-col gap-4 p-1.5 bg-secondary/40 rounded-2xl shadow-sm transition-colors duration-200 cursor-pointer border border-muted w-full md:w-fit"
                                >
                                    <div className="flex gap-2 flex-col items-center">
                                        <Image
                                            src={ev.eventImageUrl}
                                            alt={ev.eventName}
                                            height={400}
                                            width={100}
                                            className="w-full h-full rounded-2xl object-cover border border-muted"
                                        />
                                        <div className="flex flex-col">
                                            <h2 className="text-lg font-semibold text-foreground">
                                                {ev.eventName}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-center">
                                        <Button
                                            variant="secondary"
                                            className="w-full text-center"
                                            onClick={() => {
                                                router.push(
                                                    `/dashboard/events/edit?id=${ev.eventID}`,
                                                );
                                            }}
                                        >
                                            <Notebook className="w-4 h-4" />
                                            Event Details
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="w-fit text-center"
                                            onClick={() => {
                                                router.push(
                                                    `/dashboard/events/edit?id=${ev.eventID}`,
                                                );
                                            }}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit Event
                                        </Button>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                    {events.length === 0 && (
                        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4">
                            <Binoculars className="w-128 h-128 my-2" />
                            <p className="text-lg font-semibold text-foreground">
                                No events found
                            </p>
                            <p className="text-sm text-card-foreground">
                                Create a new event to get started
                            </p>
                            <hr className="border-t border-muted w-1/2 my-8" />
                            <Button
                                onClick={() => router.push("/dashboard/new")}
                            >
                                <PlusCircle className="w-128 h-128" /> Create a
                                new event
                            </Button>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
