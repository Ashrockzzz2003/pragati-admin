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

const editTag = (
    tagID: string,
    tagName: string,
    tagAbbrevation: string,
    setLoading: (loading: boolean) => void,
    onSuccess: () => void,
) => {
    // console.log("[DEBUG] Editing tag with ID:", tagID);
    // console.table({
    //     tagName,
    //     tagAbbrevation,
    //     tagID,
    // });
    setLoading(true);
    fetch(api.TAGS_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
        },
        body: JSON.stringify({
            tagAbbrevation,
            tagName,
            tagID: parseInt(tagID),
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
                case 401:
                    secureLocalStorage.clear();
                    window.location.href = "/";
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

export function EditTag({
    tagID,
    initialTagName,
    initialTagAbbrevation,
    onSuccess,
}: {
    tagID: string;
    initialTagName: string;
    initialTagAbbrevation: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [tagName, setTagName] = React.useState(initialTagName);
    const [tagAbbrevation, setTagAbbrevation] = React.useState(
        initialTagAbbrevation,
    );
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
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>
                            {"Edit the tag name and abbreviation here."}
                        </DialogDescription>
                    </DialogHeader>
                    <EditTagForm
                        classname="px-0"
                        tagName={tagName}
                        setTagName={setTagName}
                        tagAbbrevation={tagAbbrevation}
                        setTagAbbrevation={setTagAbbrevation}
                        tagID={tagID}
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
                    <DrawerTitle>Edit Tag</DrawerTitle>
                    <DrawerDescription>
                        {"Edit the tag name and abbreviation here."}
                    </DrawerDescription>
                </DrawerHeader>
                <EditTagForm
                    classname="px-4"
                    tagName={tagName}
                    setTagName={setTagName}
                    tagAbbrevation={tagAbbrevation}
                    setTagAbbrevation={setTagAbbrevation}
                    tagID={tagID}
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

function EditTagForm({
    classname,
    tagID,
    loading,
    setLoading,
    tagName,
    setTagName,
    tagAbbrevation,
    setTagAbbrevation,
    onSuccess,
}: {
    classname: string;
    tagID: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    tagName: string;
    setTagName: (tagName: string) => void;
    tagAbbrevation: string;
    setTagAbbrevation: (tagAbbrevation: string) => void;
    onSuccess: () => void;
}) {
    return (
        <div className={cn("grid items-start gap-4", classname)}>
            <form
                className="grid gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    editTag(
                        tagID,
                        tagName,
                        tagAbbrevation,
                        setLoading,
                        onSuccess,
                    );
                }}
            >
                <div className="grid gap-2">
                    <Label htmlFor="tagAbbrevation">Tag</Label>
                    <p className="text-sm font-extralight text-secondary-foreground">
                        This will be used as a unique identifier for the tag.
                    </p>
                    <Input
                        type="text"
                        id="tagAbbrevation"
                        defaultValue={tagAbbrevation}
                        placeholder="CSE"
                        required
                        onChange={(e) => setTagAbbrevation(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="tagName">One-word Description</Label>
                    <Input
                        type="text"
                        id="tagName"
                        defaultValue={tagName}
                        placeholder="Computer Science"
                        required
                        onChange={(e) => setTagName(e.target.value)}
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
