"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import EventWiseParticipantsTable from "@/components/participants/event-wise";
import { Binoculars } from "lucide-react";

const ParticipantsPage = () => {
    const params = useParams();
    const eventID = params.eventID;
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState<number>(0);

    const [participants, setParticipants] = useState([]);

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

        fetch(`${api.PARTICIPANTS_EVENTS_URL}/${eventID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
        })
            .then((partRes) => {
                if (partRes.status === 200) {
                    partRes.json().then((partData) => {
                        setParticipants(partData.DATA);
                        setProgress(100);
                    });
                } else {
                    alert("Failed to fetch participant data.");
                }
            })
            .catch((err) => {
                console.error("Error fetching participant data", err);
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
                    {Array.isArray(participants) && participants.length > 0 ? (
                        <EventWiseParticipantsTable
                            participants={participants}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4">
                            <Binoculars className="w-10 h-10 my-2" />{" "}
                            <p className="text-lg font-semibold text-foreground">
                                No participants found for this event
                            </p>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ParticipantsPage;
