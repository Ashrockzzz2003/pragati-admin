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
import { ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";

type Transactions = {
    txnID: number;
    userName: string;
    userEmail: string;
    transactionStatus: string;
    event: string;
    amount: number;
};

interface Transactions_Table {
    invoice: Transactions[];
}

type SortKey = keyof Transactions;

const TransactionsTable: React.FC<Transactions_Table> = ({ invoice }) => {
    const [eventFilter, setEventFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<SortKey>("txnID");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const uniqueMethods = useMemo(() => {
        return Array.from(new Set(invoice.map((inv) => inv.event)));
    }, [invoice]);

    const filteredAndSortedInvoices = useMemo(() => {
        const filtered = invoice
            .filter((inv) => eventFilter === "all" || inv.event === eventFilter)
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
                            {uniqueMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                    {method}
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
                                Name
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("userEmail")}
                            >
                                Email ID
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("event")}
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
                            <TableCell>{inv.userName}</TableCell>
                            <TableCell>{inv.userEmail}</TableCell>
                            <TableCell>Event Name</TableCell>
                            <TableCell>
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
                            </TableCell>

                            <TableCell className="text-right">
                                ₹ {inv.amount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
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
