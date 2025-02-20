import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import secureLocalStorage from "react-secure-storage";
import { api } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

const editNotification = (
    notificationID: string,
    title: string,
    description: string,
    author: string,
    venue: string,
    startDate: string,
    endDate: string,
    setLoading: (loading: boolean) => void,
    onSuccess: () => void,
) => {
    setLoading(true);
    fetch(api.ALERTS_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
        },
        body: JSON.stringify({
            notificationID: parseInt(notificationID),
            title,
            description,
            author,
            venue,
            startDate,
            endDate,
        }),
    })
        .then((res) => {
            switch (res.status) {
                case 200:
                    setLoading(false);
                    onSuccess();
                    break;
                case 400:
                    res.json().then(({ MESSAGE }) => {
                        alert(MESSAGE);
                    });
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
            setLoading(false);
        });
};

export function EditNotification({
    notificationID,
    initialTitle,
    initialDescription,
    initialAuthor,
    initialVenue,
    initialStartDate,
    initialEndDate,
    onSuccess,
}: {
    notificationID: string;
    initialTitle: string;
    initialDescription: string;
    initialAuthor: string;
    initialVenue: string;
    initialStartDate: string;
    initialEndDate: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [title, setTitle] = React.useState(initialTitle);
    const [description, setDescription] = React.useState(initialDescription);
    const [author, setAuthor] = React.useState(initialAuthor);
    const [venue, setVenue] = React.useState(initialVenue);
    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);
    const [loading, setLoading] = React.useState(false);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Edit3 className="w-6 h-6" />
                        Edit
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Notification</DialogTitle>
                        <DialogDescription>
                            {"Edit the notification details here."}
                        </DialogDescription>
                    </DialogHeader>
                    <EditNotificationForm
                        classname="px-0"
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        author={author}
                        setAuthor={setAuthor}
                        venue={venue}
                        setVenue={setVenue}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        notificationID={notificationID}
                        loading={loading}
                        setLoading={setLoading}
                        onSuccess={() => {
                            setOpen(false);
                            onSuccess();
                        }}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <Edit3 className="w-6 h-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Notification</DrawerTitle>
                    <DrawerDescription>
                        {"Edit the notification details here."}
                    </DrawerDescription>
                </DrawerHeader>
                <EditNotificationForm
                    classname="px-4"
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    author={author}
                    setAuthor={setAuthor}
                    venue={venue}
                    setVenue={setVenue}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    notificationID={notificationID}
                    loading={loading}
                    setLoading={setLoading}
                    onSuccess={onSuccess}
                />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function EditNotificationForm({
    classname,
    notificationID,
    loading,
    setLoading,
    title,
    setTitle,
    description,
    setDescription,
    author,
    setAuthor,
    venue,
    setVenue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onSuccess,
}: {
    classname: string;
    notificationID: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    author: string;
    setAuthor: (author: string) => void;
    venue: string;
    setVenue: (venue: string) => void;
    startDate: string;
    setStartDate: (startDate: string) => void;
    endDate: string;
    setEndDate: (endDate: string) => void;
    onSuccess: () => void;
}) {
    return (
        <div className={cn("grid items-start gap-4", classname)}>
            <form
                className="grid gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    editNotification(
                        notificationID,
                        title,
                        description,
                        author,
                        venue,
                        startDate,
                        endDate,
                        setLoading,
                        onSuccess,
                    );
                }}
            >
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        type="text"
                        id="title"
                        defaultValue={title}
                        placeholder="Title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[88px] border focus:border-primary-focus"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                        type="text"
                        id="author"
                        defaultValue={author}
                        placeholder="Author"
                        required
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                        type="text"
                        id="venue"
                        defaultValue={venue}
                        placeholder="Venue"
                        required
                        onChange={(e) => setVenue(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        type="date"
                        id="startDate"
                        value={startDate}
                        required
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        type="date"
                        id="endDate"
                        value={endDate}
                        required
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Edit3 className="w-6 h-6" />
                    )}
                    {loading ? "Updating..." : "Update"}
                </Button>
            </form>
        </div>
    );
}
