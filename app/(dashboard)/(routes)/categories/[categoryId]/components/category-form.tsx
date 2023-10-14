"use client";

import * as React from "react";
import Image from "next/image";
import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { catchError, isArrayOfFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDialog } from "@/components/file-dialog";
import { Zoom } from "@/components/zoom-image";
// import { addProductAction, checkProductAction } from "@/app/_actions/product";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Icons } from "@/components/icons";
import { categorySchema } from "@/lib/validations/category";

type Inputs = z.infer<typeof categorySchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UpdateCategoryForm() {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const { isUploading, startUpload } = useUploadThing("productImage");

  const form = useForm<Inputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: Inputs) {
    // startTransition(async () => {
    //   try {
    //     await checkProductAction({
    //       name: data.title,
    //     });
    //     const images = isArrayOfFile(data.images)
    //       ? await startUpload(data.images).then((res) => {
    //           const formattedImages = res?.map((image) => ({
    //             id: image.key,
    //             name: image.key.split("_")[1] ?? image.key,
    //             url: image.url,
    //           }));
    //           return formattedImages ?? null;
    //         })
    //       : null;
    //     await addProductAction({
    //       ...data,
    //       images,
    //     });
    //     toast.success("Category added successfully.");
    //     form.reset();
    //     setFiles(null);
    //   } catch (err) {
    //     catchError(err);
    //   }
    // });
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type category name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type category description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Update Category
          <span className="sr-only">Update Category</span>
        </Button>
      </form>
    </Form>
  );
}
