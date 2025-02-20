"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { EditClub } from "@/components/club/edit-club-form";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
    const router = useRouter();
    const [progress, setProgress] = useState(13);

    const [clubs, setClubs] = useState([]);

    const deleteClub = (clubId: string) => {
        setProgress(13);
        fetch(api.CLUBS_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
            body: JSON.stringify({
                clubID: parseInt(clubId),
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

        fetch(api.CLUBS_URL, {
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
                            setClubs(data.DATA);
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

    return user.name === "" || user.email === "" || progress < 100 ? (
        <div className="flex items-center justify-center h-screen w-[50%] ml-auto mr-auto">
            <Progress value={progress} />
        </div>
    ) : (
        <SidebarProvider>
            <AppSidebar
                user={user}
                navItems={generateNavItems(
                    "/dashboard/clubs",
                    "/dashboard/clubs",
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
                                    <BreadcrumbPage>Clubs</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold">Clubs</h1>
                    <div className="flex flex-wrap gap-4">
                        {clubs.map(
                            (club: {
                                clubID: string;
                                clubName: string;
                                imageUrl: string;
                                clubHead: string;
                                clubAbbrevation: string;
                                godName: string;
                                createdAt: string;
                            }) => (
                                <div
                                    key={club.clubID}
                                    className="flex flex-col gap-4 p-2 bg-secondary/80 rounded-md shadow-sm hover:bg-secondary transition-colors duration-200 cursor-pointer border border-muted w-full md:w-fit"
                                >
                                    <div className="flex flex-row justify-between gap-1">
                                        <div className="flex gap-4 flex-row items-center">
                                            <Image
                                                src={club.imageUrl}
                                                alt={club.clubName}
                                                height={400}
                                                width={88}
                                                className="w-32 h-32 rounded-full object-cover border border-muted"
                                            />
                                            <div className="flex flex-col">
                                                <h2 className="text-lg font-semibold text-foreground">
                                                    {club.clubName}
                                                </h2>
                                                <p className="text-xs text-primary">
                                                    {club.godName}
                                                </p>
                                                <p className="text-xs text-card-foreground">
                                                    {club.clubHead}
                                                </p>
                                                <p className="text-xs text-card-foreground">
                                                    Created on{" "}
                                                    {new Date(
                                                        club.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center gap-2 m-4">
                                            <EditClub
                                                clubID={club.clubID}
                                                initialClubName={club.clubName}
                                                initialGodName={club.godName}
                                                initialImageUrl={club.imageUrl}
                                                initialClubHead={club.clubHead}
                                                onSuccess={() =>
                                                    window.location.reload()
                                                }
                                            />
                                            <Button
                                                variant="outline"
                                                className="border border-muted text-red-400"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteClub(club.clubID);
                                                }}
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        variant="default"
                                        className="w-full text-center"
                                    >
                                        View Club Events
                                    </Button>
                                </div>
                            ),
                        )}

                        {clubs.length === 0 && (
                            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4 w-full">
                                <Binoculars className="w-128 h-128 my-2" />
                                <p className="text-lg font-semibold text-foreground">
                                    No clubs found
                                </p>
                                <p className="text-sm text-card-foreground">
                                    Create a new club to get started
                                </p>
                                <hr className="border-t border-muted w-1/2 my-8" />
                                <Button
                                    onClick={() =>
                                        router.push("/dashboard/clubs/new")
                                    }
                                >
                                    <PlusCircle className="w-128 h-128" />{" "}
                                    Create a new club
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
