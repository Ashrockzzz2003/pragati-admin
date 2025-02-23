"use client";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const chartConfig = {
    participants: {
        label: "Participants",
    },
    reg: {
        label: "Registered",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

type Event = {
    eventID: number;
    eventName: string;
    numRegistrations: number;
    maxRegistrations: number;
};

interface ParticipantsChartProps {
    events: Event[];
}

const ParticipantsChart: React.FC<ParticipantsChartProps> = ({ events }) => {
    const router = useRouter(); 
    const totalRegistrations = events.reduce(
        (sum, event) => sum + event.numRegistrations,
        0,
    );
    const totalMaxRegistrations = events.reduce(
        (sum, event) => sum + event.maxRegistrations,
        0,
    );
    const percentage =
        totalMaxRegistrations > 0
            ? (totalRegistrations / totalMaxRegistrations) * 100
            : 0;
    const startAngle = 0;
    const endAngle = (percentage / 100) * 360;
    const chartData = [
        {
            participants: "Registered",
            numRegistered: totalRegistrations,
            fill: "hsl(var(--primary))",
        },
    ];

    return (
        <div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Participant Count</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            innerRadius={80}
                            outerRadius={110}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar
                                dataKey="numRegistered"
                                background
                                cornerRadius={10}
                            />
                            <PolarRadiusAxis
                                tick={false}
                                tickLine={false}
                                axisLine={false}
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
                                                        className="fill-foreground text-4xl font-bold"
                                                    >
                                                        {chartData[0].numRegistered.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground"
                                                    >
                                                        Participants
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="leading-none text-muted-foreground">
                        Showing total participants registered for events
                    </div>
                </CardFooter>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {events.map((event) => (
                    <Card
                        key={event.eventID}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="text-center">
                            <CardTitle>{event.eventName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <p className="text-4xl font-bold">
                                {event.numRegistrations}
                            </p>
                            <p className="text-sm text-gray-500">
                                / {event.maxRegistrations} participants
                            </p>
                        </CardContent>
                        <CardContent>
                            <div className="flex flex-col">
                                <Button className="w-full md:w-auto whitespace-normal leading-3 break-words" onClick={() => router.push(`/dashboard/participants/${event.eventID}`)}>
                                    View Participants
                                </Button>
                                <Button className="w-full md:w-auto whitespace-normal leading-3 break-words mt-2">
                                    Download Participant Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ParticipantsChart;
