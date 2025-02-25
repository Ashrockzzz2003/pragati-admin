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
};

interface EventWiseParticipantsTableProps {
    participants: Participant[];
}

const EventWiseParticipantsTable: React.FC<EventWiseParticipantsTableProps> = ({
    participants,
}) => {
    const [nameSearch, setNameSearch] = useState("");
    const [sortKey, setSortKey] = useState<"userName" | "collegeName">("userName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filteredParticipants = useMemo(() => {
        if (!Array.isArray(participants)) return [];

        return participants
            .filter((participant) =>
                participant.userName.toLowerCase().includes(nameSearch.toLowerCase())
            )
            .sort((a, b) => {
                const valA = a[sortKey].toLowerCase();
                const valB = b[sortKey].toLowerCase();
                if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
    }, [nameSearch, participants, sortKey, sortOrder]);

    const handleSort = (key: "userName" | "collegeName") => {
        if (key === sortKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="space-y-4 mt-8">
            <Input
                placeholder="Search names..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="max-w-sm"
            />
            <Button className="w-fit md:w-auto whitespace-normal leading-3 break-words mt-2" disabled>
                <Download size={16} className="mr-2" />
                Download - Coming Soon
            </Button>

            {filteredParticipants.length === 0 ? (
                <p className="text-gray-500">No participants for this event with this name yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reg ID</TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort("userName")}>
                                    User Details
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort("collegeName")}>
                                    College
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
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
                                    <p className="font-semibold">{participant.registrationID}</p>
                                </TableCell>
                                <TableCell className="w-fit">
                                    <div>
                                        <p className="font-semibold">{participant.userName}</p>
                                        <p className="text-xs text-foreground font-light">{participant.userEmail}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="w-fit">
                                    <p className="text-foreground">{participant.phoneNumber}</p>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm font-semibold">{participant.collegeName}</p>
                                        <p className="text-xs text-muted-foreground">{participant.collegeCity}</p>
                                    </div>
                                </TableCell>
                                {participants.length > 0 &&
                                    typeof participants[0].teamName === "string" &&
                                    participants[0].teamName.length > 0 && (
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-semibold">{participant.teamName}</p>
                                                <p className="text-xs text-muted-foreground">{participant.role}</p>
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
