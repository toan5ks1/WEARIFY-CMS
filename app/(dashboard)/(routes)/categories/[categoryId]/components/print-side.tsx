"use client"

import React from "react"
import Image from "next/image"
import { FileWithPreview } from "@/types"
import { type FieldArrayWithId, type UseFormReturn } from "react-hook-form"

import { AreaType } from "@/lib/const"
import { toTitleCase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileDialog } from "@/components/file-dialog"

import { Inputs } from "./subcategory-dialog"

interface PrintSideProps {
  form: UseFormReturn<Inputs, any, undefined>
  isUploading: boolean
  isPending: boolean
  index: number
}

export default function PrintSide({
  form,
  isUploading,
  isPending,
  index,
}: PrintSideProps) {
  const [sideMockups, setSideMockups] = React.useState<
    FileWithPreview[] | null
  >(null)
  const [printAreas, setPrintAreas] = React.useState<FileWithPreview[] | null>(
    null
  )
  const areaTypeDefault = form.getValues().sides ? form.getValues().sides![index].areaType : AreaType[0];

  const [areaType, setAreaType] = React.useState<string>(areaTypeDefault)
  function changeAreaType(
    onChange: (event: string | React.ChangeEvent<Element>) => void,
    props: string
  ) {
    setAreaType(props)

    return onChange(props)
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name={`sides.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Side {index + 1}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Type print side name here." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 items-start gap-6 sm:flex-row">
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Mockup</FormLabel>
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
              files={sideMockups}
              setFiles={setSideMockups}
              isUploading={isUploading}
              disabled={isPending}
              name={`sides.${index}.mockup`}
            />
          </FormControl>
          {sideMockups?.length ? (
            <Image
              src={sideMockups[0].preview}
              alt={sideMockups[0].name}
              className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
              width={80}
              height={80}
            />
          ) : null}
        </FormItem>
        <div className="flex w-full flex-col gap-3">
          <FormLabel htmlFor="width">Print area</FormLabel>
          <div className="grid grid-cols-2 gap-1">
            {areaType === AreaType[0] ? (
              <FormItem className="self-end">
                <FormControl>
                  <FileDialog
                    setValue={form.setValue}
                    name={`sides.${index}.areaImage`}
                    maxFiles={1}
                    maxSize={1024 * 1024 * 4}
                    files={printAreas}
                    setFiles={setPrintAreas}
                    isUploading={isUploading}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            ) : areaType === AreaType[1] ? (
              <FormItem className="self-end">
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Set dimensions</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" onFocusOutside={(event) => {event.preventDefault()}}>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Dimensions
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Set the dimensions for the print area (centimeter).
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel htmlFor="width">Width</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0"
                                className="col-span-2 h-8"
                                type="number"
                                inputMode="numeric"
                                {...form.register(
                                  `sides.${index}.dimension.0.w`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel htmlFor="height">Height</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0"
                                className="col-span-2 h-8"
                                type="number"
                                inputMode="numeric"
                                {...form.register(
                                  `sides.${index}.dimension.0.h`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel htmlFor="x">X</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0"
                                className="col-span-2 h-8"
                                type="number"
                                inputMode="numeric"
                                {...form.register(
                                  `sides.${index}.dimension.0.x`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel htmlFor="y">Y</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0"
                                className="col-span-2 h-8"
                                type="number"
                                inputMode="numeric"
                                {...form.register(
                                  `sides.${index}.dimension.0.y`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            ) : null}
            <FormField
              control={form.control}
              name={`sides.${index}.areaType`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Select
                    onValueChange={(props) =>
                      changeAreaType(field.onChange, props)
                    }
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Area type" />
                    </SelectTrigger>
                    <SelectContent>
                      {AreaType.map((type) => (
                        <SelectItem key={type} value={type}>
                          {toTitleCase(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          {printAreas?.length ? (
            <Image
              src={printAreas[0].preview}
              alt={printAreas[0].name}
              className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
              width={80}
              height={80}
            />
          ) : null}
          <UncontrolledFormMessage
            message={
              form.formState.errors.sides &&
              form.formState.errors.sides[index]?.dimension?.message
            }
          />
        </div>
      </div>
    </div>
  )
}
