"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { Progress } from "@/components/ui/progress";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateNavItems } from "@/lib/nav-manager";
import TransactionsTable from "@/components/revenue/transactions-table";
import { api } from "@/lib/api";
import { Binoculars } from "lucide-react";

const TransactionsPage = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });
    const [progress, setProgress] = useState<number>(0);
    const [transactions, setTransactions] = useState([]);
    const [events, setEvents] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const _user =
            JSON.parse(secureLocalStorage.getItem("u") as string) ?? {};
        setProgress(30);

        if (_user.userName && _user.userEmail) {
            setUser({
                name: _user.userName,
                email: _user.userEmail,
                avatar: "https://gravatar.com/avatar/dd55aeae8806246ac1d0ab0c6baa34f5?&d=robohash&r=x",
            });
            setProgress(50);
        } else {
            router.replace("/");
            return;
        }

        fetch(api.ALL_TRANSACTIONS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setProgress(70);
                        res.json().then((data) => {
                            setTransactions(data.DATA);
                            setProgress(80);
                        });
                        break;
                    case 400:
                        res.json().then(({ MESSAGE }) => {
                            alert(MESSAGE);
                        });
                        break;
                    case 401:
                        secureLocalStorage.clear();
                        router.replace("/");
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

        fetch(api.ALL_EVENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
            },
        })
            .then((eventRes) => {
                if (eventRes.status === 200) {
                    eventRes.json().then((eventData) => {
                        setEvents(eventData.DATA);
                        setProgress(100);
                    });
                } else {
                    alert("Failed to fetch event data.");
                }
            })
            .catch((err) => {
                console.error("Error fetching event data", err);
            })
            .finally(() => {
                setProgress(100);
            });
    }, [router]);

    return user?.name === "" || user?.email === "" || progress < 100 ? (
        <div className="flex items-center justify-center h-screen w-[50%] ml-auto mr-auto">
            <Progress value={progress} />
        </div>
    ) : (
        <SidebarProvider>
            <AppSidebar
                user={user}
                navItems={generateNavItems(
                    "/dashboard/revenue",
                    "/dashboard/revenue/transactions",
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
                                        Transactions
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold">Transactions</h1>
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4">
                            <Binoculars className="w-128 h-128 my-1" />
                            <p className="text-lg font-semibold text-foreground">
                                No transactions made yet.
                            </p>
                            <p className="text-xs text-foreground">
                                Transactions made by participants will appear
                                here. Sit back and relax.
                            </p>
                        </div>
                    ) : (
                        <TransactionsTable
                            invoice={transactions}
                            events={events}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default TransactionsPage;
