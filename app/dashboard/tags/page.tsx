"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { EditTag } from "@/components/tag/edit-tag-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { api } from "@/lib/api";
import { generateNavItems } from "@/lib/nav-manager";
import { Binoculars, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Page() {
  const router = useRouter();
  const [progress, setProgress] = useState(13);

  const [tags, setTags] = useState([]);

  const deleteTag = (tagID: string) => {
    setProgress(13);
    fetch(api.TAGS_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secureLocalStorage.getItem("t")}`,
      },
      body: JSON.stringify({
        "tagID": parseInt(tagID),
      })
    }).then((res) => {
      switch (res.status) {
        case 200:
          setProgress(100);
          window.location.reload();
          break;
        case 400:
          res.json().then(({ MESSAGE }) => {
            alert(MESSAGE)
          })
          break;
        case 500:
          alert("We are facing some issues at the moment. We are working on it. Please try again later.")
          break;
        default:
          alert("Something went wrong. Please refresh the page and try again later.")
          break;
      }
    }).catch((err) => {
      console.error(err)
      alert("Something went wrong. Please refresh the page and try again later.")
    }).finally(() => {
      setProgress(100);
    });
  }

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const _user = JSON.parse(secureLocalStorage.getItem("u") as string) ?? {};
    setProgress(50);
    if (_user.userName && _user.userEmail) {
      setUser({
        name: _user.userName,
        email: _user.userEmail,
        avatar: "https://gravatar.com/avatar/dd55aeae8806246ac1d0ab0c6baa34f5?&d=robohash&r=x",
      });
      setProgress(66);
    } else {
      router.replace("/")
    }

    fetch(api.TAGS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      switch (res.status) {
        case 200:
          setProgress(80);
          res.json().then((data) => {
            setTags(data.DATA);
            setProgress(100);
          });
          break;
        case 400:
          res.json().then(({ MESSAGE }) => {
            alert(MESSAGE)
          })
          break;
        case 500:
          alert("We are facing some issues at the moment. We are working on it. Please try again later.")
          break;
        default:
          alert("Something went wrong. Please refresh the page and try again later.")
          break;
      }
    }).catch((err) => {
      console.error(err)
      alert("Something went wrong. Please refresh the page and try again later.")
    }).finally(() => {
      setProgress(100);
    });
  }, [router])

  return (user.name === "" || user.email === "" || progress < 100) ? (
    <div className="flex items-center justify-center h-screen w-[50%] ml-auto mr-auto">
      <Progress value={progress} />
    </div>
  ) : (
    <SidebarProvider>
      <AppSidebar user={user} navItems={generateNavItems(
        "/dashboard/tags",
        "/dashboard/tags"
      )} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    Pragati 2025
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tags</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-semibold">Tags</h1>
          {/* tagID, tagName, tagAbbrevation, createdAt, updatedAt */}
          <div className="flex flex-col gap-4">
            {tags.map((tag: {
              tagID: string;
              tagName: string;
              tagAbbrevation: string;
              createdAt: string;
            }) => (
              <div key={tag.tagID} className="flex justify-between items-center p-4 bg-secondary/80 rounded-md shadow-sm hover:bg-secondary transition-colors duration-200 cursor-pointer">
                <div className="flex gap-4 flex-row items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full">
                    {tag.tagAbbrevation}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">{tag.tagName}</h2>
                    <p className="text-xs text-sidebar-primary-foreground">Created on <span className="text-primary">{new Date(tag.createdAt).toLocaleString()}</span></p>
                  </div>
                </div>
                <div>
                  <EditTag
                    tagID={tag.tagID}
                    initialTagName={tag.tagName}
                    initialTagAbbrevation={tag.tagAbbrevation}
                    onSuccess={() => window.location.reload()}
                  />
                  <Button variant="outline" onClick={(e) => {
                    e.preventDefault();
                    deleteTag(tag.tagID);
                  }}>
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}

            {tags.length === 0 && (
              <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4">
                <Binoculars className="w-128 h-128 my-2" />
                <p className="text-lg font-semibold text-foreground">No tags found</p>
                <p className="text-sm text-card-foreground">Create a new tag to get started</p>
                <hr className="border-t border-muted w-1/2 my-8" />
                <Button onClick={() => router.push("/dashboard/tags/new")}>
                  <PlusCircle className="w-128 h-128" /> Create a new tag
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}