"use client"

import * as React from "react"
import Image from "next/image"
import {
  FileWithPreview,
  InputSideWrapper,
  InputSubcategory,
  Side,
  UpdateSide,
} from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { AreaType, defaultSide } from "@/lib/const"
import {
  catchError,
  getImageToCreate,
  getImageToPreview,
  isFormDirty,
  isImageDirty,
  slugify,
} from "@/lib/utils"
import { sideSchema, subcategorySchema } from "@/lib/validations/subcategory"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  addSideAction,
  revSubcategory,
  updateSideAction,
} from "@/app/_actions/side"
import {
  checkUpdateSubcategoryAction,
  updateSubcategoryAction,
} from "@/app/_actions/subcategory"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

import { SubcategoryWithSides } from "./cell-action"
import PrintSide from "./print-side"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()
interface UpdateSubcategoryDialogProps {
  categoryId: number
  subcategory?: SubcategoryWithSides
}

export function UpdateSubcategoryDialog({
  categoryId,
  subcategory,
}: UpdateSubcategoryDialogProps) {
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const { isUploading, startUpload } = useUploadThing("productImage")

  const subcategoryForm = useForm<InputSubcategory>({
    resolver: zodResolver(subcategorySchema),
  })

  const sideForm = useForm<InputSideWrapper>({
    resolver: zodResolver(sideSchema),
  })

  React.useEffect(() => {
    const subcategoryValues = {
      title: subcategory?.title ?? undefined,
      description: subcategory?.description ?? undefined,
    }

    const sideValue = {
      sides:
        subcategory?.sides.map((side) => {
          return {
            ...side,
            description: side.description ?? undefined,
            areaType: side.areaType ?? AreaType[0],
            mockup: side.mockup ?? undefined,
            areaImage: side.areaImage ?? undefined,
          }
        }) || [],
    }

    const previewImage = getImageToPreview(subcategory?.images)

    previewImage && setFiles([previewImage])
    subcategoryValues && subcategoryForm.reset(subcategoryValues)
    sideValue && sideForm.reset(sideValue)
  }, [sideForm, subcategory, subcategoryForm])

  const { fields, append } = useFieldArray({
    name: "sides",
    control: sideForm.control,
  })

  function onSubmit(data: InputSubcategory) {
    if (!subcategory?.id) {
      return catchError(null)
    }

    startTransition(async () => {
      try {
        await checkUpdateSubcategoryAction({
          id: subcategory.id!,
          title: data.title,
          categoryId,
        })
        const isImgDirty = isImageDirty(data.images)

        if (isFormDirty(subcategoryForm.formState.dirtyFields) || isImgDirty) {
          const images = isImgDirty
            ? await getImageToCreate(data.images, startUpload)
            : subcategory.images

          await updateSubcategoryAction({
            ...data,
            images,
            categoryId,
            id: subcategory.id,
            slug: slugify(data.title),
          })
        }

        const { sides } = sideForm.getValues()

        // Filter new sides and update current sides
        const sidesWillAdd = (
          await Promise.all(
            sides.map(async (side, index) => {
              if (!side.id) {
                const mockup = await getImageToCreate(side.mockup, startUpload)
                const areaImage = await getImageToCreate(
                  side.areaImage,
                  startUpload
                )

                side.subcategoryId = Number(subcategory.id)
                side.mockup = mockup
                side.areaImage = areaImage
              } else {
                const isMockupDirty = isImageDirty(side.mockup)
                const isAreaImgDirty = isImageDirty(side.areaImage)
                // Update sides
                if (
                  isFormDirty(sideForm.formState.dirtyFields) ||
                  isMockupDirty ||
                  isAreaImgDirty
                ) {
                  const mockup = isMockupDirty
                    ? await getImageToCreate(side.mockup, startUpload)
                    : subcategory.sides.at(index)?.mockup

                  const areaImage = isAreaImgDirty
                    ? await getImageToCreate(side.areaImage, startUpload)
                    : subcategory.sides.at(index)?.areaImage

                  await updateSideAction({
                    ...side,
                    mockup,
                    areaImage,
                  } as UpdateSide)
                }
              }

              return side
            })
          )
        ).filter((side) => !side.id) as Side[]

        // Add new sides
        sidesWillAdd.length && (await addSideAction(sidesWillAdd))
        revSubcategory(categoryId)
        // revalidatePath(`/categories/${categoryId}`)
        toast.success("Subcategory updated successfully.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <DialogContent className="scrollbar-hidden no-scrollbar flex max-h-screen flex-col gap-4 overflow-y-scroll sm:max-w-2xl lg:h-[86dvh]">
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
                  <Input placeholder="Type subcategory name here." {...field} />
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
            onClick={() => append(defaultSide)}
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
              Update Subcategory
              <span className="sr-only">Update Subcategory</span>
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
