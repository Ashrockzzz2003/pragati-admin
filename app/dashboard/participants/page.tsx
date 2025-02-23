"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { Progress } from "@/components/ui/progress";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateNavItems } from "@/lib/nav-manager";
import ParticipantsChart from "@/components/participants/participants-chart";

const ParticipantsPage = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState<number>(0);
    const [events, setEvents] = useState([]);

    const router = useRouter();

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
            return;
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
                            if (data.DATA.length === 0) {
                                setEvents([]);
                                setProgress(100);
                                return;
                            }

                            // sort data by numRegistrations
                            data.DATA.sort(
                                (
                                    a: {
                                        numRegistrations: string;
                                    },
                                    b: {
                                        numRegistrations: string;
                                    },
                                ) =>
                                    parseInt(b.numRegistrations.toString()) -
                                    parseInt(a.numRegistrations.toString()),
                            );

                            setEvents(data.DATA);
                            setProgress(100);
                        });
                        break;
                    case 400:
                        res.json().then(({ MESSAGE }) => {
                            alert(MESSAGE);
                        });
                        break;
                    case 401:
                        secureLocalStorage.clear();
                        router.replace("/");
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

    return user?.name === "" || user?.email === "" || progress < 100 ? (
        <div className="flex items-center justify-center h-screen w-[50%] ml-auto mr-auto">
            <Progress value={progress} />
        </div>
    ) : (
        <SidebarProvider>
            <AppSidebar
                user={user}
                navItems={generateNavItems(
                    "/dashboard/participants",
                    "/dashboard/participants",
                )}
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
                                    <BreadcrumbPage>
                                        Event-wise Participants
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold">
                        Event-wise Participants
                    </h1>
                    <ParticipantsChart events={events} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ParticipantsPage;
