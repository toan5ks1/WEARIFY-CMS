"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Category } from "@/db/schema"
import { InputUpdateCategory } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { catchError } from "@/lib/utils"
import { categorySchema } from "@/lib/validations/category"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { updateCategoryAction } from "@/app/_actions/category"

interface CategoryClientProps {
  category: Category
}

export function UpdateCategoryForm({ category }: CategoryClientProps) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<InputUpdateCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category.title,
      description: category?.description ?? undefined,
    },
  })

  function onSubmit(data: InputUpdateCategory) {
    startTransition(async () => {
      try {
        await updateCategoryAction({ ...data, id: category.id })

        toast.success("Category updated successfully.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <div className="flex flex-col justify-between gap-4">
      <Heading
        title={"Update category"}
        description="Update this category information"
      />
      <Separator />
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
    </div>
  )
}
