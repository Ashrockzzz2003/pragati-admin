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
    userID: number;
    userName: string;
    userEmail: string;
    collegeName: string;
    phoneNumber: string;
    collegeCity: string;
    registeredEvents:
        | { eventID: number; eventFee: number; eventName: string }[]
        | null;
};

interface ParticipantsTableProps {
    participants: Participant[];
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
    participants,
}) => {
    const [nameSearch, setNameSearch] = useState("");
    const [sortKey, setSortKey] = useState<"userName" | "collegeName">("userName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filteredParticipants = useMemo(() => {
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
            <Button
                className="w-fit md:w-auto whitespace-normal leading-3 break-words mt-2"
                disabled
            >
                <Download size={16} className="mr-2" />
                Download - Coming Soon
            </Button>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort("userName")}>
                                User Details
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort("collegeName")}>
                                College
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Registered Events</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredParticipants.map((participant) => (
                        <TableRow key={participant.userID}>
                            <TableCell className="w-fit">
                                <div>
                                    <p className="font-semibold">{participant.userName}</p>
                                    <p className="text-xs text-foreground font-light">{participant.userEmail}</p>
                                    <p className="text-xs text-foreground font-light">{participant.phoneNumber}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="text-sm font-semibold">{participant.collegeName}</p>
                                    <p className="text-xs text-muted-foreground">{participant.collegeCity}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                {participant.registeredEvents && participant.registeredEvents.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {participant.registeredEvents.map((e) => (
                                            <span key={e.eventID} className="rounded-lg bg-primary p-1.5 text-xs font-semibold text-primary-foreground border border-black">
                                                {e.eventName}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">-</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ParticipantsTable;
