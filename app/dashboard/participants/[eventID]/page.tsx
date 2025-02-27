"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
    const { eventID } = useParams();
    const searchParams = useSearchParams();

    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState<number>(0);

    const [participants, setParticipants] = useState<
        {
            registrationID: number;
            userID: number;
            userName: string;
            userEmail: string;
            teamName: string;
            role: string;
            collegeName: string;
            collegeCity: string;
            phoneNumber: string;
            rollNumber: string;
            degree: string;
            academicYear: number;
            needAccommodationDay1: number;
            needAccommodationDay2: number;
        }[]
    >([]);

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
                        if (partData.DATA.length === 0) {
                            setProgress(100);
                            return;
                        }

                        if (
                            typeof partData.DATA[0].teamName === "string" &&
                            partData.DATA[0].teamName !== ""
                        ) {
                            // eslint-disable-next-line prefer-const
                            let partList: {
                                registrationID: number;
                                userID: number;
                                userName: string;
                                userEmail: string;
                                teamName: string;
                                role: string;
                                collegeName: string;
                                collegeCity: string;
                                phoneNumber: string;
                                rollNumber: string;
                                degree: string;
                                academicYear: number;
                                needAccommodationDay1: number;
                                needAccommodationDay2: number;
                            }[] = [];

                            partData.DATA.forEach(
                                (part: {
                                    registrationID: number;
                                    teamName: string;
                                    teamMembers: {
                                        userID: number;
                                        userName: string;
                                        userEmail: string;
                                        phoneNumber: string;
                                        collegeName: string;
                                        collegeCity: string;
                                        role: string;
                                        rollNumber: string;
                                        degree: string;
                                        academicYear: number;
                                        needAccommodationDay1: number;
                                        needAccommodationDay2: number;
                                    }[];
                                }) => {
                                    part.teamMembers.forEach(
                                        (team: {
                                            userID: number;
                                            userName: string;
                                            userEmail: string;
                                            collegeName: string;
                                            collegeCity: string;
                                            phoneNumber: string;
                                            role: string;
                                            rollNumber: string;
                                            degree: string;
                                            academicYear: number;
                                            needAccommodationDay1: number;
                                            needAccommodationDay2: number;
                                        }) => {
                                            partList.push({
                                                registrationID:
                                                    part.registrationID,
                                                userID: team.userID,
                                                userName: team.userName,
                                                userEmail: team.userEmail,
                                                teamName: part.teamName,
                                                role: team.role,
                                                collegeName: team.collegeName,
                                                collegeCity: team.collegeCity,
                                                phoneNumber: team.phoneNumber,
                                                rollNumber: team.rollNumber,
                                                degree: team.degree,
                                                academicYear: team.academicYear,
                                                needAccommodationDay1:
                                                    team.needAccommodationDay1,
                                                needAccommodationDay2:
                                                    team.needAccommodationDay2,
                                            });
                                        },
                                    );
                                },
                            );

                            // sort by registration ID
                            partList.sort(
                                (a, b) => a.registrationID - b.registrationID,
                            );
                            setParticipants(partList);

                            setProgress(70);
                        } else {
                            setParticipants(partData.DATA);
                        }

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
    }, [router, eventID]);

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
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <h1 className="text-2xl font-semibold">
                        {searchParams.get("name") ?? "Event"} - Participants
                    </h1>
                    {Array.isArray(participants) && participants.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Total participants: {participants.length}
                        </p>
                    )}

                    {Array.isArray(participants) && participants.length > 0 ? (
                        <EventWiseParticipantsTable
                            participants={participants}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4 mt-4">
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
