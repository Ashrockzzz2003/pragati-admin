"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CircleFadingArrowUpIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { api } from "@/lib/api";

type Transactions = {
    txnID: number;
    userName: string;
    userEmail: string;
    transactionStatus: string;
    amount: number;
    eventID: number;
};

type Events = {
    eventID: number;
    eventName: string;
};

interface Transactions_Table {
    invoice: Transactions[];
    events: Events[];
}

type SortKey = keyof Transactions;

const TransactionsTable: React.FC<Transactions_Table> = ({
    invoice,
    events,
}) => {
    const [eventFilter, setEventFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<SortKey>("txnID");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const uniqueMethods = useMemo(() => {
        return Array.from(new Set(invoice.map((inv) => inv.eventID)));
    }, [invoice]);

    const eventMap = useMemo(() => {
        return events.reduce(
            (acc, event) => {
                acc[event.eventID] = event.eventName;
                return acc;
            },
            {} as Record<number, string>,
        );
    }, [events]);

    const filteredAndSortedInvoices = useMemo(() => {
        const filtered = invoice
            .filter(
                (inv) =>
                    eventFilter === "all" ||
                    inv.eventID === Number(eventFilter),
            )
            .filter(
                (inv) =>
                    statusFilter === "all" ||
                    inv.transactionStatus === statusFilter,
            )
            .sort((a, b) => {
                if (a[sortKey] < b[sortKey])
                    return sortOrder === "asc" ? -1 : 1;
                if (a[sortKey] > b[sortKey])
                    return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        return filtered;
    }, [eventFilter, statusFilter, sortKey, sortOrder, invoice]);

    const totalAmount = useMemo(() => {
        return filteredAndSortedInvoices
            .filter((invoice) => invoice.transactionStatus === "2")
            .reduce((sum, invoice) => sum + invoice.amount, 0)
            .toFixed(2);
    }, [filteredAndSortedInvoices]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                {/* Filter by Event */}
                <div>
                    <span>Filter by Event:</span>
                    <Select onValueChange={setEventFilter} value={eventFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            {uniqueMethods.map((eventID) => (
                                <SelectItem
                                    key={eventID}
                                    value={String(eventID)}
                                >
                                    {eventMap[eventID]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Filter by Status */}
                <div>
                    <span>Filter by Status:</span>
                    <Select
                        onValueChange={(value) => setStatusFilter(value)}
                        value={statusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="0">Failed</SelectItem>
                            <SelectItem value="1">Pending</SelectItem>
                            <SelectItem value="2">Success</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("txnID")}
                            >
                                Transaction ID
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
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("eventID")}
                            >
                                Event Name
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("transactionStatus")}
                            >
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("amount")}
                            >
                                Amount
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedInvoices.map((inv) => (
                        <TableRow key={inv.txnID}>
                            <TableCell className="font-medium">
                                {inv.txnID}
                            </TableCell>
                            <TableCell>
                                <div>{inv.userName}</div>
                                <div className="text-sm text-gray-500">
                                    {inv.userEmail}
                                </div>
                            </TableCell>
                            <TableCell>
                                {eventMap[inv.eventID] || "Unknown Event"}
                            </TableCell>
                            <TableCell className="flex flex-row justify-start items-center align-middle gap-2 h-full mt-2">
                                <Badge
                                    variant={
                                        inv.transactionStatus === "0"
                                            ? "destructive"
                                            : inv.transactionStatus === "1"
                                              ? "secondary"
                                              : "default"
                                    }
                                >
                                    {inv.transactionStatus === "0"
                                        ? "Failed"
                                        : inv.transactionStatus === "1"
                                          ? "Pending"
                                          : "Success"}
                                </Badge>

                                {inv.transactionStatus === "1" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={`${api.VERIFY_TRANSACTION_URL}/${inv.txnID}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white"
                                            >
                                                <CircleFadingArrowUpIcon
                                                    size={16}
                                                    className="hover:text-green-500"
                                                />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Verify Transaction
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell
                                className={`text-right ${
                                    inv.transactionStatus === "0"
                                        ? "text-red-500"
                                        : inv.transactionStatus === "1"
                                          ? "text-yellow-500"
                                          : "text-white"
                                }`}
                            >
                                ₹ {inv.amount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">
                            ₹ {totalAmount}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default TransactionsTable;
