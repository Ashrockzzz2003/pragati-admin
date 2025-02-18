"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const participants = [
  { id: 1, name: "Alice Johnson", events: ["Workshop", "Conference"] },
  { id: 2, name: "Bob Smith", events: ["Conference", "Seminar"] },
  { id: 3, name: "Charlie Brown", events: ["Workshop", "Seminar"] },
  { id: 4, name: "Diana Ross", events: ["Conference"] },
  { id: 5, name: "Ethan Hunt", events: ["Workshop", "Conference", "Seminar"] },
  { id: 6, name: "Fiona Apple", events: ["Seminar"] },
  { id: 7, name: "George Clooney", events: ["Workshop", "Conference"] },
  { id: 8, name: "Hannah Montana", events: ["Conference", "Seminar"] },
  { id: 9, name: "Ian McKellen", events: ["Workshop"] },
  { id: 10, name: "Julia Roberts", events: ["Conference", "Seminar"] },
]

type SortKey = "name" | "events"

const ParticipantsTable = () => {
  const [nameSearch, setNameSearch] = useState("")
  const [eventFilter, setEventFilter] = useState<string | "all">("all")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const uniqueEvents = useMemo(() => {
    return Array.from(new Set(participants.flatMap((p) => p.events)))
  }, [])

  const filteredAndSortedParticipants = useMemo(() => {
    return participants
      .filter(
        (participant) =>
          participant.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
          (eventFilter!="all" ? participant.events.includes(eventFilter) : true),
      )
      .sort((a, b) => {
        if (sortKey === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else {
          // For events, sort by the number of events
          const aEvents = a.events.length
          const bEvents = b.events.length
          return sortOrder === "asc" ? aEvents - bEvents : bEvents - aEvents
        }
      })
  }, [nameSearch, eventFilter, sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search names..."
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => setEventFilter(value)} value={eventFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {uniqueEvents.map((event) => (
              <SelectItem key={event} value={event}>
                {event}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button variant="ghost" onClick={() => handleSort("name")}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("events")}>
                Events
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedParticipants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">{participant.name}</TableCell>
              <TableCell>{participant.events.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


export default ParticipantsTable; 