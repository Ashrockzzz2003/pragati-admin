"use client";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type Transactions = {
    totalAmountPaid: number;
    eventID: number;
};

type Events = {
    eventID: number;
    eventName: string;
    isMgt: string;
};

interface Revenue_Data {
    invoice: Transactions[];
    events: Events[];
}

const chartData = [
    { event: "Management", visitors: 275, fill: "var(--color-mgmt)" },
    { event: "Non Management", visitors: 275, fill: "var(--color-nonmgmt)" },
];

const chartConfig = {
    mgmt: {
        label: "Management Games",
        color: "hsl(var(--chart-1))",
    },
    nonmgmt: {
        label: "Non Management Games",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const RevenuePage: React.FC<Revenue_Data> = ({ invoice, events }) => {
    // Calculate total revenue
    const totalRevenue = useMemo(() => {
        return invoice.reduce((sum, inv) => sum + inv.totalAmountPaid, 0);
    }, [invoice]);

    // Calculate event-wise revenue
    const event_revenue = useMemo(() => {
        return events
            .map((event) => {
                const revenue = invoice
                    .filter((inv) => inv.eventID === event.eventID)
                    .reduce((sum, inv) => sum + inv.totalAmountPaid, 0);

                return {
                    id: event.eventID,
                    name: event.eventName,
                    revenue,
                };
            })
            .sort((a, b) => b.revenue - a.revenue);
    }, [invoice, events]);

    return (
        <div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Revenue Distribution</CardTitle>
                    <CardDescription>
                        Between Management and Non Management Games
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="event"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            "cx" in viewBox &&
                                            "cy" in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        ₹
                                                        {parseInt(
                                                            String(
                                                                totalRevenue,
                                                            ),
                                                            10,
                                                        ).toLocaleString(
                                                            "en-IN",
                                                        )}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground"
                                                    >
                                                        Total Revenue
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {event_revenue.map((rev) => (
                    <Card
                        key={rev.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="text-center">
                            <CardTitle>{rev.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <p className="text-4xl font-bold">
                                ₹
                                {parseInt(
                                    String(rev.revenue),
                                    10,
                                ).toLocaleString("en-IN")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RevenuePage;
