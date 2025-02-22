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

type Participant = {
    userID: number;
    userName: string;
    userEmail: string;
    collegeName: string;
    needAccommodationDay1: number;
    needAccommodationDay2: number;
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
    const filteredParticipants = useMemo(() => {
        return participants.filter((participant) =>
            participant.userName
                .toLowerCase()
                .includes(nameSearch.toLowerCase()),
        );
    }, [nameSearch, participants]);

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search names..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Day 1 Stay</TableHead>
                        <TableHead>Day 2 Stay</TableHead>
                        <TableHead>Registered Events</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredParticipants.map((participant) => (
                        <TableRow key={participant.userID}>
                            <TableCell className="font-medium">
                                {participant.userName}
                            </TableCell>
                            <TableCell>{participant.userEmail}</TableCell>
                            <TableCell>{participant.collegeName}</TableCell>
                            <TableCell>
                                {participant.needAccommodationDay1
                                    ? "✅"
                                    : "❌"}
                            </TableCell>
                            <TableCell>
                                {participant.needAccommodationDay2
                                    ? "✅"
                                    : "❌"}
                            </TableCell>
                            <TableCell>
                                {participant.registeredEvents &&
                                participant.registeredEvents.length > 0
                                    ? participant.registeredEvents
                                          .map((e) => e.eventName)
                                          .join(", ")
                                    : ""}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ParticipantsTable;
