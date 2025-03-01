"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Participant = {
    registrationID: number;
    userID: number;
    userName: string;
    userEmail: string;
    collegeName: string;
    collegeCity: string;
    phoneNumber: string;
    role: string;
    teamName: string;
    rollNumber: string;
    degree: string;
    academicYear: number;
    needAccommodationDay1: number;
    needAccommodationDay2: number;
};

interface EventWiseParticipantsTableProps {
    participants: Participant[];
}

const EventWiseParticipantsTable: React.FC<EventWiseParticipantsTableProps> = ({
    participants,
}) => {
    const [nameSearch, setNameSearch] = useState("");
    const [sortKey, setSortKey] = useState<
        "userName" | "collegeName" | "registrationID"
    >("registrationID");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const sp = useSearchParams();

    const filteredParticipants = useMemo(() => {
        if (!Array.isArray(participants)) return [];

        return participants
            .filter((participant) =>
                participant.userName
                    .toLowerCase()
                    .includes(nameSearch.toLowerCase()),
            )
            .sort((a, b) => {
                const valA = a[sortKey].toString().toLowerCase();
                const valB = b[sortKey].toString().toLowerCase();
                if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
    }, [nameSearch, participants, sortKey, sortOrder]);

    const handleSort = (key: "userName" | "collegeName" | "registrationID") => {
        if (key === sortKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const downloadParticipants = () => {
        const csvData =
            participants.length > 0 &&
            typeof participants[0].teamName === "string" &&
            participants[0].teamName.length > 0
                ? participants.map((participant, i) => {
                      return {
                          "S.No": i + 1,
                          Email: participant.userEmail.replace(/,/g, " "),
                          Name: participant.userName.replace(/,/g, " "),
                          "Roll Number": participant.rollNumber.replace(
                              /,/g,
                              " ",
                          ),
                          "Phone Number": participant.phoneNumber.replace(
                              /,/g,
                              " ",
                          ),
                          College:
                              participant.collegeName.replace(/,/g, " ") +
                              " - " +
                              participant.collegeCity.replace(/,/g, " "),
                          Academics:
                              participant.degree.replace(/,/g, " ") +
                              " - " +
                              participant.academicYear
                                  .toString()
                                  .replace(/,/g, " "),
                          "Team Name": participant.teamName.replace(/,/g, " "),
                          Role: participant.role.replace(/,/g, " "),
                          "Need Accommodation March 3":
                              participant.needAccommodationDay1 ? "Yes" : "No",
                          "Need Accommodation March 4":
                              participant.needAccommodationDay2 ? "Yes" : "No",
                      };
                  })
                : participants.map((participant, i) => {
                      return {
                          "S.No": i + 1,
                          Email: participant.userEmail.replace(/,/g, " "),
                          Name: participant.userName.replace(/,/g, " "),
                          "Roll Number": participant.rollNumber.replace(
                              /,/g,
                              " ",
                          ),
                          "Phone Number": participant.phoneNumber.replace(
                              /,/g,
                              " ",
                          ),
                          College:
                              participant.collegeName.replace(/,/g, " ") +
                              " - " +
                              participant.collegeCity.replace(/,/g, " "),
                          Academics:
                              participant.degree.replace(/,/g, " ") +
                              " - " +
                              participant.academicYear
                                  .toString()
                                  .replace(/,/g, " "),
                          "Need Accommodation March 3":
                              participant.needAccommodationDay1 ? "Yes" : "No",
                          "Need Accommodation March 4":
                              participant.needAccommodationDay2 ? "Yes" : "No",
                      };
                  });

        const csvFields = Object.keys(csvData[0]);

        // Download the CSV file.
        const csv: string[] = csvData.map((row) =>
            csvFields
                .map((fieldName) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    JSON.stringify((row as any)[fieldName], null, 2),
                )
                .join(","),
        );
        csv.unshift(csvFields.join(","));
        const csvArray = csv.join("\r\n");

        const a = document.createElement("a");
        const file = new Blob([csvArray], { type: "text/csv" });
        a.href = URL.createObjectURL(file);
        a.download = `${sp.get("name") ? sp.get("name")?.replace(/ /g, "-") : "e-pragati-25"}-participants-list-${new Date().getTime()}.csv`;
        a.click();
    };

    return (
        <div className="space-y-4 mt-8">
            <Input
                placeholder="Search names..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="max-w-sm"
            />
            <Button
                className="w-fit md:w-auto whitespace-normal leading-3 break-words mt-2"
                onClick={downloadParticipants}
            >
                <Download size={16} className="mr-2" />
                Download List
            </Button>

            {filteredParticipants.length === 0 ? (
                <p className="text-gray-500">
                    No participants for this event with this name yet.
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("registrationID")}
                                >
                                    RegID
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("userName")}
                                >
                                    User Details
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("collegeName")}
                                >
                                    College
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Accommodation</TableHead>
                            {participants.length > 0 &&
                                typeof participants[0].teamName === "string" &&
                                participants[0].teamName.length > 0 && (
                                    <TableHead>Team Details</TableHead>
                                )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.map((participant) => (
                            <TableRow key={participant.userID}>
                                <TableCell className="w-fit">
                                    <p className="font-semibold">
                                        {participant.registrationID}
                                    </p>
                                </TableCell>
                                <TableCell className="w-fit">
                                    <div>
                                        <p className="font-semibold">
                                            {participant.userName}
                                        </p>
                                        <p className="text-xs text-foreground font-light">
                                            {participant.userEmail}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="w-fit">
                                    <p className="text-primary">
                                        {participant.phoneNumber}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {participant.collegeName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {participant.collegeCity}
                                        </p>
                                        <p className="text-xs text-primary">
                                            {participant.rollNumber}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {participant.needAccommodationDay1 &&
                                    participant.needAccommodationDay2 ? (
                                        <span className="text-sm text-primary">
                                            Both Days
                                        </span>
                                    ) : participant.needAccommodationDay1 ? (
                                        <span className="text-sm text-primary">
                                            March 3
                                        </span>
                                    ) : participant.needAccommodationDay2 ? (
                                        <span className="text-sm text-primary">
                                            March 4
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </TableCell>
                                {participants.length > 0 &&
                                    typeof participants[0].teamName ===
                                        "string" &&
                                    participants[0].teamName.length > 0 && (
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {participant.teamName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {participant.role}
                                                </p>
                                            </div>
                                        </TableCell>
                                    )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default EventWiseParticipantsTable;
