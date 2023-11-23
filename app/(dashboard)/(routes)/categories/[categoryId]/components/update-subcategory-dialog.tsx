"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FileWithPreview, Side, StoredFile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { Plus } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { defaultSide } from "@/lib/const"
import { catchError, isArrayOfFile, slugify } from "@/lib/utils"
import { subcategorySchema } from "@/lib/validations/subcategory"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { addSideAction } from "@/app/_actions/side"
import {
  addSubcategoryAction,
  checkSubcategoryAction,
} from "@/app/_actions/subcategory"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { SubcategoryColumn } from "./columns"
import PrintSide from "./print-side"

export type Inputs = z.infer<typeof subcategorySchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

interface UpdateSubcategoryDialogProps {
  categoryId: number
}

export function UpdateSubcategoryDialog({
  categoryId,
}: UpdateSubcategoryDialogProps) {
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  const { isUploading, startUpload } = useUploadThing("productImage")

  const form = useForm<Inputs>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      title: "",
      description: "",
      sides: [defaultSide],
    },
  })

  function addSide() {
    append(defaultSide)
  }

  const { fields, append } = useFieldArray({
    name: "sides",
    control: form.control,
  })

  function onSubmit({ sides, ...data }: Inputs) {
    startTransition(async () => {
      try {
        await checkSubcategoryAction({
          title: data.title,
          categoryId,
        })

        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
              }))
              return formattedImages ? formattedImages[0] : null
            })
          : null

        const subcategoryId = await addSubcategoryAction({
          ...data,
          images,
          categoryId,
          slug: slugify(data.title),
        })

        const sidesMapped = sides?.length
          ? ((await Promise.all(
              sides.map(async (side) => {
                const mockup = isArrayOfFile(side.mockup)
                  ? await startUpload(side.mockup).then((res) => {
                      const formattedImages = res?.map((image) => ({
                        id: image.key,
                        name: image.key.split("_")[1] ?? image.key,
                        url: image.url,
                      }))

                      return formattedImages ? formattedImages[0] : null
                    })
                  : null

                const areaImage = isArrayOfFile(side.areaImage)
                  ? await startUpload(side.areaImage).then((res) => {
                      const formattedImages = res?.map((image) => ({
                        id: image.key,
                        name: image.key.split("_")[1] ?? image.key,
                        url: image.url,
                      }))

                      return formattedImages ? formattedImages[0] : null
                    })
                  : null

                side.subcategoryId = Number(subcategoryId)
                side.mockup = mockup
                side.areaImage = areaImage

                return side
              })
            )) as Side[])
          : null

        sidesMapped && (await addSideAction(sidesMapped))

        toast.success("Subcategory added successfully.")

        form.reset()
        setFiles(null)
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 sm:max-w-2xl lg:h-[80dvh]">
        <DialogHeader>
          <DialogTitle>Add subcategory</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full" scrollBarClassName="hidden">
          <Form {...form}>
            <form
              className="grid w-full gap-5 px-1"
              onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type subcategory name here."
                        {...field}
                      />
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
                        placeholder="Type subcategory description here."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex w-full flex-col gap-1.5">
                <FormLabel>Images</FormLabel>
                {files?.length ? (
                  <Image
                    src={files[0].preview}
                    alt={files[0].name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                  />
                ) : null}
                <FormControl>
                  <FileDialog
                    setValue={form.setValue}
                    name="images"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 4}
                    files={files}
                    setFiles={setFiles}
                    isUploading={isUploading}
                    disabled={isPending}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.images?.message}
                />
              </FormItem>
              <FormLabel className="font-semibold">Print sides</FormLabel>
              <div className="flex flex-col gap-6">
                {fields.map((field, index) => (
                  <PrintSide
                    key={index}
                    index={index}
                    form={form}
                    isPending={isPending}
                    isUploading={isUploading}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addSide}
              >
                Add side
              </Button>
              <DialogFooter className="sticky">
                <Button className="w-fit" disabled={isPending} type="submit">
                  {isPending && (
                    <Icons.spinner
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Add Subcategory
                  <span className="sr-only">Add Subcategory</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
