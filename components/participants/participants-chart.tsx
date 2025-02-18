"use client"
import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Button } from "../ui/button"
const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const events = [
  { id: "event1", name: "Hackathon", current: 50, max: 100 },
  { id: "event2", name: "AI Workshop", current: 30, max: 50 },
  { id: "event3", name: "Tech Talk", current: 80, max: 100 },
  { id: "event4", name: "Startup Pitch Fest", current: 25, max: 50 },
  { id: "event5", name: "Entrepreneurship Summit", current: 40, max: 75 },
  { id: "event6", name: "Marketing Masterclass", current: 60, max: 80 },
  { id: "event7", name: "Product Management Bootcamp", current: 35, max: 60 },
  { id: "event8", name: "Business Analytics Workshop", current: 45, max: 90 },
  { id: "event9", name: "Investment & Finance Forum", current: 50, max: 100 },
  { id: "event10", name: "Leadership & Strategy Conference", current: 20, max: 50 },
  { id: "event11", name: "Sales & Negotiation Training", current: 30, max: 70 },
];


const ParticipantsChart = () => {
  return (
    <div>
      <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
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
                    key={event.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    // onClick={() => router.push(`/participants/${event.id}`)}
                >
                    <CardHeader className="text-center">
                        <CardTitle>{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <p className="text-4xl font-bold">{event.current}</p>
                        <p className="text-sm text-gray-500">/ {event.max} participants</p>
                    </CardContent>
                    <CardContent>
                        <Button className="w-full whitespace-normal leading-3 break-words">Click to view participants</Button>
                    </CardContent>
                </Card>
            ))}
        </div>

    </div>
  )
}

export default ParticipantsChart
