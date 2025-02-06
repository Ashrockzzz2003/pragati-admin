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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const [eventName, setEventName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [eventFee, setEventFee] = useState("");
    const [godName, setGodName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDescSmall, setEventDescSmall] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [maxTeamSize, setMaxTeamSize] = useState("1");
    const [minTeamSize, setMinTeamSize] = useState("1");
    const [eventDate, setEventDate] = useState("1");
    const [maxRegistrations, setMaxRegistrations] = useState("10");
    const [isPerHeadFee, setIsPerHeadFee] = useState(false);

    // TODO: Implement Multi-select.
    // const [organizerIDs, setOrganizerIDs] = useState([]);
    // const [tagIDs, setTagIDs] = useState([]);
    // const [clubID, setClubID] = useState("");

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

    const addNewEvent = () => {
        setProgress(13);
        fetch(api.EVENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
            body: JSON.stringify({
                eventName,
                imageUrl,
                eventFee,
                godName,
                eventDescription,
                eventDescSmall,
                isGroup,
                maxTeamSize,
                minTeamSize,
                eventDate,
                maxRegistrations,
                isPerHeadFee,
            }),
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setProgress(100);
                        router.replace("/dashboard");
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
                navItems={generateNavItems("/dashboard", "/dashboard/new")}
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
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>New Event</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <h1 className="text-2xl font-semibold mx-4">
                    Create New Event
                </h1>
                <div className="bg-muted/50 m-4 p-4 rounded-xl flex flex-col gap-4">
                    <form
                        className="grid gap-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            addNewEvent();
                        }}
                    >
                        <div className="grid gap-2">
                            <Label
                                htmlFor="eventName"
                                className="text-lg font-semibold"
                            >
                                Event Name
                            </Label>
                            <Input
                                type="text"
                                id="eventName"
                                value={eventName}
                                placeholder="Solo Singing"
                                onChange={(e) => setEventName(e.target.value)}
                                required
                                className="border focus:border-primary-focus"
                            />
                        </div>

                        <div className="flex flex-row gap-2 border rounded-md p-4">
                            <Checkbox
                                id="isGroup"
                                checked={isGroup}
                                onCheckedChange={(checked) =>
                                    setIsGroup(checked.toString() === "true")
                                }
                                className="text-primary"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="isGroup"
                                    className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Is this a group event?
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Check this box if this event is a group
                                    event.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="godName"
                                className="text-lg font-semibold"
                            >
                                God Name (associated with the Event)
                            </Label>
                            <Input
                                type="text"
                                id="godName"
                                value={godName}
                                placeholder="Athena"
                                onChange={(e) => setGodName(e.target.value)}
                                required
                                className="border focus:border-primary-focus"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="eventDate"
                                className="text-lg font-semibold"
                            >
                                Event Start Date
                            </Label>
                            <Select
                                onValueChange={(value) => setEventDate(value)}
                            >
                                <SelectTrigger className="border focus:border-primary-focus">
                                    <SelectValue placeholder="Select the start date of the event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Select a start date
                                        </SelectLabel>
                                        <SelectItem value="1">
                                            March 3
                                        </SelectItem>
                                        <SelectItem value="2">
                                            March 4
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="eventDescription"
                                className="text-lg font-semibold"
                            >
                                About the event
                            </Label>
                            <Textarea
                                className="min-h-[196px] border focus:border-primary-focus"
                                placeholder="Enter about the event"
                                value={eventDescription}
                                onChange={(e) =>
                                    setEventDescription(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="eventDescSmall"
                                className="text-lg font-semibold"
                            >
                                Rules
                            </Label>
                            <Textarea
                                className="min-h-[108px] border focus:border-primary-focus"
                                placeholder="Enter rules"
                                value={eventDescSmall}
                                onChange={(e) =>
                                    setEventDescSmall(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="eventFee"
                                className="text-lg font-semibold"
                            >
                                Event Fee
                            </Label>
                            <Input
                                type="number"
                                id="eventFee"
                                value={eventFee}
                                placeholder="745"
                                onChange={(e) => setEventFee(e.target.value)}
                                required
                                className="border focus:border-primary-focus"
                            />
                        </div>

                        <div className="flex flex-row gap-2 border rounded-md p-4">
                            <Checkbox
                                id="isPerHeadFee"
                                checked={isPerHeadFee}
                                onCheckedChange={(checked) =>
                                    setIsPerHeadFee(
                                        checked.toString() === "true",
                                    )
                                }
                                className="text-primary"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="isPerHeadFee"
                                    className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Is the given fee per head?
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Check this box if this event is a per head
                                    fee event. If not, the fee will be charged
                                    per team.
                                </p>
                            </div>
                        </div>

                        {isGroup && (
                            <div className="flex flex-row gap-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="maxTeamSize"
                                        className="text-lg font-semibold"
                                    >
                                        Maximum Team Size
                                    </Label>
                                    <Input
                                        type="number"
                                        id="maxTeamSize"
                                        value={maxTeamSize}
                                        placeholder="5"
                                        onChange={(e) =>
                                            setMaxTeamSize(e.target.value)
                                        }
                                        required
                                        className="border focus:border-primary-focus"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="minTeamSize"
                                        className="text-lg font-semibold"
                                    >
                                        Minimum Team Size
                                    </Label>
                                    <Input
                                        type="number"
                                        id="minTeamSize"
                                        value={minTeamSize}
                                        placeholder="2"
                                        onChange={(e) =>
                                            setMinTeamSize(e.target.value)
                                        }
                                        required
                                        className="border focus:border-primary-focus"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label
                                htmlFor="maxRegistrations"
                                className="text-lg font-semibold"
                            >
                                Maximum Allowed Seats (Individuals count)
                            </Label>
                            <Input
                                type="number"
                                id="maxRegistrations"
                                value={maxRegistrations}
                                placeholder="100"
                                onChange={(e) =>
                                    setMaxRegistrations(e.target.value)
                                }
                                required
                                className="border focus:border-primary-focus"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="imageUrl"
                                className="text-lg font-semibold"
                            >
                                Event Poster Image URL
                            </Label>
                            <p className="text-xs text-card-foreground/70">
                                This image will be displayed on the event page
                                to the participants.
                            </p>
                            <Input
                                type="url"
                                id="imageUrl"
                                value={imageUrl}
                                placeholder="https://example.com/image.jpg"
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                                className="border focus:border-primary-focus"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            onClick={addNewEvent}
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
