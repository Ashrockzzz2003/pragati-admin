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

const editOrg = (
    orgID: string,
    organizerName: string,
    phoneNumber: string,
    setLoading: (loading: boolean) => void,
    onSuccess: () => void,
) => {
    setLoading(true);
    fetch(api.ORGS_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
        },
        body: JSON.stringify({
            phoneNumber,
            organizerName,
            organizerID: parseInt(orgID),
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

export function EditOrg({
    orgID,
    initialOrganizerName,
    initialPhoneNumber,
    onSuccess,
}: {
    orgID: string;
    initialOrganizerName: string;
    initialPhoneNumber: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [organizerName, setOrganizerName] =
        React.useState(initialOrganizerName);
    const [phoneNumber, setPhoneNumber] = React.useState(initialPhoneNumber);
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
                        <DialogTitle>Edit Organizer Details</DialogTitle>
                        <DialogDescription>
                            {"Edit the organizer name and phone number here."}
                        </DialogDescription>
                    </DialogHeader>
                    <EditOrganizerForm
                        classname="px-0"
                        organizerName={organizerName}
                        setOrganizerName={setOrganizerName}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        orgID={orgID}
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
                    <DrawerTitle>Edit Organizer Details</DrawerTitle>
                    <DrawerDescription>
                        {"Edit the organizer name and phone number here."}
                    </DrawerDescription>
                </DrawerHeader>
                <EditOrganizerForm
                    classname="px-4"
                    organizerName={organizerName}
                    setOrganizerName={setOrganizerName}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    orgID={orgID}
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

function EditOrganizerForm({
    classname,
    orgID,
    loading,
    setLoading,
    organizerName,
    setOrganizerName,
    phoneNumber,
    setPhoneNumber,
    onSuccess,
}: {
    classname: string;
    orgID: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    organizerName: string;
    setOrganizerName: (organizerName: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    onSuccess: () => void;
}) {
    return (
        <div className={cn("grid items-start gap-4", classname)}>
            <form
                className="grid gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    editOrg(
                        orgID,
                        organizerName,
                        phoneNumber,
                        setLoading,
                        onSuccess,
                    );
                }}
            >
                <div className="grid gap-2">
                    <Label htmlFor="organizerName">Full Name</Label>
                    <Input
                        type="text"
                        id="organizerName"
                        value={organizerName}
                        placeholder="Ananya R"
                        onChange={(e) => setOrganizerName(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        placeholder="887xxxxxxx"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
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
