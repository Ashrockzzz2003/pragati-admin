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

const editClub = (
    clubID: string,
    clubName: string,
    godName: string,
    imageUrl: string,
    clubHead: string,
    setLoading: (loading: boolean) => void,
    onSuccess: () => void,
) => {
    setLoading(true);
    fetch(api.CLUBS_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
        },
        body: JSON.stringify({
            godName,
            clubName,
            imageUrl,
            clubHead,
            clubAbbrevation: clubName.substring(0, 9).toUpperCase(),
            clubID: parseInt(clubID),
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

export function EditClub({
    clubID,
    initialClubName,
    initialGodName,
    initialImageUrl,
    initialClubHead,
    onSuccess,
}: {
    clubID: string;
    initialClubName: string;
    initialGodName: string;
    initialImageUrl: string;
    initialClubHead: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [clubName, setClubName] = React.useState(initialClubName);
    const [godName, setGodName] = React.useState(initialGodName);
    const [imageUrl, setImageUrl] = React.useState(initialImageUrl);
    const [clubHead, setClubHead] = React.useState(initialClubHead);

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
                        <DialogTitle>Edit Club</DialogTitle>
                        <DialogDescription>
                            {"Edit the club data here."}
                        </DialogDescription>
                    </DialogHeader>
                    <EditClubForm
                        classname="px-0"
                        clubName={clubName}
                        setClubName={setClubName}
                        godName={godName}
                        setGodName={setGodName}
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        clubHead={clubHead}
                        setClubHead={setClubHead}
                        clubID={clubID}
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
                    <DrawerTitle>Edit Club</DrawerTitle>
                    <DrawerDescription>
                        {"Edit the club data here."}
                    </DrawerDescription>
                </DrawerHeader>
                <EditClubForm
                    classname="px-4"
                    clubName={clubName}
                    setClubName={setClubName}
                    godName={godName}
                    setGodName={setGodName}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    clubHead={clubHead}
                    setClubHead={setClubHead}
                    clubID={clubID}
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

function EditClubForm({
    classname,
    clubID,
    loading,
    setLoading,
    clubName,
    setClubName,
    godName,
    setGodName,
    imageUrl,
    setImageUrl,
    clubHead,
    setClubHead,
    onSuccess,
}: {
    classname: string;
    clubID: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    clubName: string;
    setClubName: (clubName: string) => void;
    godName: string;
    setGodName: (godName: string) => void;
    imageUrl: string;
    setImageUrl: (imageUrl: string) => void;
    clubHead: string;
    setClubHead: (clubHead: string) => void;
    onSuccess: () => void;
}) {
    return (
        <div className={cn("grid items-start gap-4", classname)}>
            <form
                className="grid gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    editClub(
                        clubID,
                        clubName,
                        godName,
                        imageUrl,
                        clubHead,
                        setLoading,
                        onSuccess,
                    );
                }}
            >
                <div className="grid gap-2">
                    <Label htmlFor="clubName">Club Name</Label>
                    <Input
                        type="text"
                        id="clubName"
                        value={clubName}
                        placeholder="BIZIT"
                        onChange={(e) => setClubName(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="clubHead">Club Head</Label>
                    <Input
                        type="text"
                        id="clubHead"
                        value={clubHead}
                        placeholder="Rohit S Warrier"
                        onChange={(e) => setClubHead(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="godName">God Name</Label>
                    <Input
                        type="text"
                        id="godName"
                        value={godName}
                        placeholder="Athena"
                        onChange={(e) => setGodName(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Club Logo Image URL</Label>
                    <Input
                        type="url"
                        id="imageUrl"
                        value={imageUrl}
                        placeholder="https://example.com/image.jpg"
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full">
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
