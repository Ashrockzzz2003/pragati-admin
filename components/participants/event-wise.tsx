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
    eventName: string;
};

interface EventWiseParticipantsTableProps {
    participants: Participant[];
}

const EventWiseParticipantsTable: React.FC<EventWiseParticipantsTableProps> = ({ participants }) => {
    const [nameSearch, setNameSearch] = useState("");

    const filteredParticipants = useMemo(() => {
        if (!Array.isArray(participants)) return []; 
        return participants.filter((participant) =>
            participant.userName.toLowerCase().includes(nameSearch.toLowerCase())
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

            {filteredParticipants.length === 0 ? (
                <p className="text-gray-500">No participants for this event with this name yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Event Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.map((participant) => (
                            <TableRow key={participant.userID}>
                                <TableCell className="font-medium">{participant.userName}</TableCell>
                                <TableCell>{participant.userEmail}</TableCell>
                                <TableCell>{participant.collegeName}</TableCell>
                                <TableCell>{participant.eventName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default EventWiseParticipantsTable;
