"use client"

import * as React from "react"
import Image from "next/image"
import {
  FileWithPreview,
  InputSideWrapper,
  InputSubcategory,
  Side,
} from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { Plus } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { defaultSide } from "@/lib/const"
import { catchError, getImageToCreate, slugify } from "@/lib/utils"
import { sideSchema, subcategorySchema } from "@/lib/validations/subcategory"
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
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { addSideAction, revSubcategory } from "@/app/_actions/side"
import {
  addSubcategoryAction,
  checkAddSubcategoryAction,
} from "@/app/_actions/subcategory"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import PrintSide from "./print-side"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

interface AddSubcategoryDialogProps {
  categoryId: number
}

export function AddSubcategoryDialog({
  categoryId,
}: AddSubcategoryDialogProps) {
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  const { isUploading, startUpload } = useUploadThing("productImage")

  const subcategoryForm = useForm<InputSubcategory>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const sideForm = useForm<InputSideWrapper>({
    resolver: zodResolver(sideSchema),
    defaultValues: { sides: [defaultSide] },
  })

  function addSide() {
    append(defaultSide)
  }

  const { fields, append } = useFieldArray({
    name: "sides",
    control: sideForm.control,
  })

  function onSubmit(data: InputSubcategory) {
    startTransition(async () => {
      try {
        await checkAddSubcategoryAction({
          title: data.title,
          categoryId,
        })

        const images = await getImageToCreate(data.images, startUpload)

        const subcategoryId = await addSubcategoryAction({
          ...data,
          images,
          categoryId,
          slug: slugify(data.title),
        })

        const { sides } = sideForm.getValues()

        const sidesMapped = (await Promise.all(
          sides.map(async (side) => {
            const mockup = await getImageToCreate(side.mockup, startUpload)
            const areaImage = await getImageToCreate(
              side.areaImage,
              startUpload
            )

            side.subcategoryId = Number(subcategoryId)
            side.mockup = mockup
            side.areaImage = areaImage

            return side
          })
        )) as Side[]

        sidesMapped.length && (await addSideAction(sidesMapped))

        setFiles(null)
        sideForm.reset()
        subcategoryForm.reset()
        revSubcategory(categoryId)
        toast.success("Subcategory added successfully.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-hidden no-scrollbar flex max-h-screen flex-col gap-4 overflow-y-scroll sm:max-w-2xl lg:h-[80dvh]">
        <DialogHeader>
          <DialogTitle>Subcategory</DialogTitle>
        </DialogHeader>
        <Form {...subcategoryForm}>
          <form
            className="grid w-full gap-5 px-1"
            onSubmit={(...args) =>
              void subcategoryForm.handleSubmit(onSubmit)(...args)
            }
          >
            <FormField
              control={subcategoryForm.control}
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
              control={subcategoryForm.control}
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
                  setValue={subcategoryForm.setValue}
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
                message={subcategoryForm.formState.errors.images?.message}
              />
            </FormItem>
            <FormLabel className="font-semibold">Print sides</FormLabel>
            <div className="flex flex-col gap-6">
              {fields.map((field, index) => (
                <PrintSide
                  key={index}
                  index={index}
                  form={sideForm}
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
      </DialogContent>
    </Dialog>
  )
}
