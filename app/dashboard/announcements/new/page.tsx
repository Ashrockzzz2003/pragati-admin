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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { generateNavItems } from "@/lib/nav-manager";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [venue, setVenue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState(13);

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
            setProgress(100);
        } else {
            router.replace("/");
        }
    }, [router]);

    const addNewAnnouncement = () => {
        setProgress(13);
        fetch(api.ALERTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
            body: JSON.stringify({
                title,
                description,
                author,
                venue,
                startDate,
                endDate,
            }),
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setProgress(100);
                        router.replace("/dashboard/announcements");
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
                    "/dashboard/announcements/new",
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
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        New Announcement
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <h1 className="text-2xl font-semibold mx-4">
                    Create New Announcement
                </h1>
                <div className="bg-muted/50 m-4 p-4 rounded-xl flex flex-col gap-4">
                    <form
                        className="grid gap-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            addNewAnnouncement();
                        }}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                value={title}
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[88px] border focus:border-primary-focus"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                type="text"
                                id="author"
                                value={author}
                                placeholder="Author"
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                type="text"
                                id="venue"
                                value={venue}
                                placeholder="Venue"
                                onChange={(e) => setVenue(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            onClick={addNewAnnouncement}
                        >
                            <PlusCircle className="w-6 h-6" />
                            Create
                        </Button>
                    </form>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
