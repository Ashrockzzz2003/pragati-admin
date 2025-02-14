"use client";

import { EditNotification } from "@/components/announcement/edit-announcement-form";
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
import { Binoculars, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
    const router = useRouter();
    const [progress, setProgress] = useState(13);

    const [alerts, setAlerts] = useState([]);

    const deleteAlert = (alertId: string) => {
        setProgress(13);
        fetch(api.ALERTS_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
            body: JSON.stringify({
                notificationID: parseInt(alertId),
            }),
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setProgress(100);
                        window.location.reload();
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
    };

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

        fetch(api.ALERTS_URL, {
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
                            setAlerts(data.DATA);
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
                navItems={generateNavItems(
                    "/dashboard/announcements",
                    "/dashboard/announcements",
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
                                        Announcements
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold">Announcements</h1>
                    <div className="flex flex-col flex-wrap gap-4">
                        {alerts.map(
                            (alert: {
                                notificationID: string;
                                title: string;
                                description: string;
                                author: string;
                                venue: string;
                                startDate: string;
                                endDate: string;
                                createdAt: string;
                            }) => (
                                <div
                                    key={alert.notificationID}
                                    className="flex flex-col bg-muted/50 rounded-2xl shadow-sm w-full"
                                >
                                    <div
                                        key={alert.notificationID}
                                        className="flex justify-between items-center p-4 bg-secondary/80 rounded-md shadow-sm hover:bg-secondary transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="flex flex-row items-center gap-4">
                                            <div className="flex flex-col gap-0">
                                                <h2 className="text-lg font-semibold text-foreground m-0 p-0">
                                                    {alert.title}
                                                </h2>
                                                <p className="text-sm text-muted-foreground m-0">
                                                    by {alert.author}
                                                </p>
                                                <p className="text-sm mt-2">
                                                    <strong>Venue:</strong>{" "}
                                                    {alert.venue}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Dates:</strong>{" "}
                                                    <span className="text-primary">
                                                        {alert.startDate}
                                                    </span>{" "}
                                                    to{" "}
                                                    <span className="text-primary">
                                                        {alert.endDate}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <EditNotification
                                                notificationID={
                                                    alert.notificationID
                                                }
                                                initialTitle={alert.title}
                                                initialDescription={
                                                    alert.description
                                                }
                                                initialVenue={alert.venue}
                                                initialStartDate={
                                                    alert.startDate
                                                }
                                                initialEndDate={alert.endDate}
                                                initialAuthor={alert.author}
                                                onSuccess={() =>
                                                    window.location.reload()
                                                }
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    deleteAlert(
                                                        alert.notificationID,
                                                    )
                                                }
                                            >
                                                <Trash2 className="w-6 h-6 text-red-400" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-card-foreground px-4 py-2">
                                        {alert.description}
                                    </p>
                                </div>
                            ),
                        )}

                        {alerts.length === 0 && (
                            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4 w-full">
                                <Binoculars className="w-128 h-128 my-2" />
                                <p className="text-lg font-semibold text-foreground">
                                    No announcements found
                                </p>
                                <p className="text-sm text-card-foreground">
                                    Create a new announcement to get started
                                </p>
                                <hr className="border-t border-muted w-1/2 my-8" />
                                <Button
                                    onClick={() =>
                                        router.push(
                                            "/dashboard/announcements/new",
                                        )
                                    }
                                >
                                    <PlusCircle className="w-128 h-128" />{" "}
                                    Create a new announcement
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
