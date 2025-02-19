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

const event_revenue = [
    { id: "event1", name: "Hackathon", revenue: 150000 },
    { id: "event2", name: "AI Workshop", revenue: 75000 },
    { id: "event3", name: "Tech Talk", revenue: 120000 },
    { id: "event4", name: "Startup Pitch Fest", revenue: 90000 },
    { id: "event5", name: "Entrepreneurship Summit", revenue: 200000 },
    { id: "event6", name: "Marketing Masterclass", revenue: 85000 },
    { id: "event7", name: "Product Management Bootcamp", revenue: 95000 },
    { id: "event8", name: "Business Analytics Workshop", revenue: 110000 },
    { id: "event9", name: "Investment & Finance Forum", revenue: 170000 },
    { id: "event10", name: "Leadership & Strategy Conference", revenue: 80000 },
    { id: "event11", name: "Sales & Negotiation Training", revenue: 65000 },
];

const RevenuePage = () => {
    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);

    return (
        <div>
            {" "}
            <div className="flex flex-col flex-wrap gap-4"></div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Pie Chart - Donut with Text</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
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
                                nameKey="browser"
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
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground"
                                                    >
                                                        Visitors
                                                    </tspan>
                                                </text>
                                            );
                                        }
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
                                ₹ {rev.revenue}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RevenuePage;
