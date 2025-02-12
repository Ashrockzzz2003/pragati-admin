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
import { MultiSelect } from "@/components/ui/multi-select";
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
import { Edit2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
    const [eventName, setEventName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [eventFee, setEventFee] = useState("");
    const [godName, setGodName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [time, setTime] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [maxTeamSize, setMaxTeamSize] = useState("1");
    const [minTeamSize, setMinTeamSize] = useState("1");
    const [eventDate, setEventDate] = useState("1");
    const [maxRegistrations, setMaxRegistrations] = useState("10");
    const [isPerHeadFee, setIsPerHeadFee] = useState(false);

    const [orgData, setOrgData] = useState([]);
    const [tagData, setTagData] = useState([]);
    const [clubData, setClubData] = useState([]);

    const [organizerIDs, setOrganizerIDs] = useState<string[]>([]);
    const [tagIDs, setTagIDs] = useState<string[]>([]);
    const [clubID, setClubID] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState(13);

    const router = useRouter();
    const searchParams = useSearchParams();

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

        fetch(`${api.EVENTS_URL}/${searchParams.get("id")}`, {
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
                            setEventName(data.DATA[0].eventName);
                            setImageUrl(data.DATA[0].eventImageUrl);
                            setEventFee(data.DATA[0].eventFee.toString());
                            setGodName(data.DATA[0].godName);
                            setEventDescription(data.DATA[0].eventDescription);
                            setVenue(data.DATA[0].venue);
                            setTime(data.DATA[0].time);
                            setIsGroup(data.DATA[0].isGroup.toString() === "1");
                            setMaxTeamSize(data.DATA[0].maxTeamSize.toString());
                            setMinTeamSize(data.DATA[0].minTeamSize.toString());
                            setEventDate(data.DATA[0].eventDate.toString());
                            setMaxRegistrations(
                                data.DATA[0].maxRegistrations.toString(),
                            );
                            setIsPerHeadFee(
                                data.DATA[0].isPerHeadFee.toString() === "1",
                            );
                            setOrganizerIDs(
                                data.DATA[0].organizers.map(
                                    (org: {
                                        organizerID: number;
                                        organizerPhoneNumber: string;
                                        organizerName: string;
                                    }) => org.organizerID,
                                ),
                            );
                            setTagIDs(
                                data.DATA[0].tags.map(
                                    (tag: {
                                        tagID: number;
                                        tagName: string;
                                        tagAbbrevation: string;
                                    }) => tag.tagID,
                                ),
                            );
                            setClubID(data.DATA[0].clubID.toString());
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

        fetch(api.ORGS_URL, {
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
                            const _orgData = data.DATA.map(
                                (item: {
                                    organizerID: string;
                                    organizerName: string;
                                }) => {
                                    return {
                                        value: item.organizerID,
                                        label: item.organizerName,
                                    };
                                },
                            );
                            setOrgData(_orgData);
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

        fetch(api.TAGS_URL, {
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
                            const _tagData = data.DATA.map(
                                (item: { tagID: string; tagName: string }) => {
                                    return {
                                        value: item.tagID,
                                        label: item.tagName,
                                    };
                                },
                            );
                            setTagData(_tagData);
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
                            const _clubData = data.DATA.map(
                                (item: {
                                    clubID: string;
                                    clubName: string;
                                }) => {
                                    return {
                                        value: item.clubID.toString(),
                                        label: item.clubName,
                                    };
                                },
                            );
                            setClubData(_clubData);
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
    }, [router, orgData.length, tagData.length, searchParams]);

    const editEvent = () => {
        setProgress(13);
        fetch(api.EVENTS_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
            body: JSON.stringify({
                eventID: parseInt(searchParams.get("id") as string),
                eventName,
                imageUrl,
                eventFee: parseInt(eventFee),
                godName,
                eventDescription,
                venue: venue,
                time,
                isGroup,
                maxTeamSize: parseInt(maxTeamSize),
                minTeamSize: parseInt(minTeamSize),
                eventDate,
                maxRegistrations: parseInt(maxRegistrations),
                isPerHeadFee,
                organizerIDs: organizerIDs.map((id) => parseInt(id)),
                tagIDs: tagIDs.map((id) => parseInt(id)),
                clubID: parseInt(clubID),
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
                navItems={generateNavItems("/dashboard", "")}
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
                                    <BreadcrumbPage>Edit Event</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <h1 className="text-2xl font-semibold mx-4">Update Event</h1>
                <p className="text-muted-foreground mx-4">{eventName}</p>
                <div className="bg-muted/50 m-4 p-4 rounded-xl flex flex-col gap-4">
                    <form
                        className="grid gap-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            editEvent();
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

                        <div className="grid gap-2">
                            <Label
                                htmlFor="imageUrl"
                                className="text-lg font-semibold"
                            >
                                Select the club that is organizing the event.
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    setClubID(value);
                                }}
                                value={clubID}
                            >
                                <SelectTrigger className="border focus:border-primary-focus">
                                    <SelectValue placeholder="Select the club" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select a club</SelectLabel>
                                        {clubData.map(
                                            (item: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                                    Is the a group event?
                                    <p className="text-sm text-muted-foreground font-light">
                                        Check this box if this event is a group
                                        (team) event.
                                    </p>
                                </label>
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
                                value={eventDate}
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
                                Timings of the event
                            </Label>
                            <Textarea
                                className="min-h-[88px] border focus:border-primary-focus"
                                placeholder={
                                    "Round 1: 10.30 AM - 3.30 PM\nRound 2: 4.30 PM - 8.30 PM"
                                }
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
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
                                Venue
                            </Label>
                            <Input
                                type="text"
                                id="venue"
                                value={venue}
                                placeholder="ASB C101"
                                onChange={(e) => setVenue(e.target.value)}
                                required
                                className="border focus:border-primary-focus"
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
                                    <p className="text-sm text-muted-foreground font-light">
                                        Check this box if this event is a per
                                        head fee event. If not, the fee will be
                                        charged per team.
                                    </p>
                                </label>
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
                            <Label className="text-lg font-semibold">
                                Event Organizers
                            </Label>
                            <MultiSelect
                                data={orgData}
                                name="organizers"
                                selected={organizerIDs}
                                setSelected={setOrganizerIDs}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-lg font-semibold">
                                Tags for events
                            </Label>
                            <MultiSelect
                                data={tagData}
                                name="tags"
                                selected={tagIDs}
                                setSelected={setTagIDs}
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
                            onClick={editEvent}
                        >
                            <Edit2 className="w-6 h-6" />
                            Update
                        </Button>
                    </form>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
