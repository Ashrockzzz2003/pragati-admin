"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { api } from "@/lib/api";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

const RevenuePage = () => {
    const [revenue, setRevenue] = useState<number | null>(null);
    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);

    return (
                <div>    <div className="flex flex-col flex-wrap gap-4"></div>
                    <Card className="flex flex-col">
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Pie Chart - Donut with Text</CardTitle>
                            <CardDescription>
                                January - June 2024
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
                                        content={
                                            <ChartTooltipContent hideLabel />
                                        }
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
                                                                    (viewBox.cy ||
                                                                        0) + 24
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
                </div>)
};

export default RevenuePage;
