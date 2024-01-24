import { env } from "@/env.mjs"
import { StoredFile } from "@/types"
import { isClerkAPIResponseError } from "@clerk/nextjs"
import type { User } from "@clerk/nextjs/server"
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import { UploadFileResponse } from "uploadthing/client"
import * as z from "zod"

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "USD", notation = "compact" } = options

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price))
}

export function formatNumber(
  number: number | string,
  options: {
    decimals?: number
    style?: Intl.NumberFormatOptions["style"]
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { decimals = 0, style = "decimal", notation = "standard" } = options

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number))
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function formatId(id: number) {
  return `#${id.toString().padStart(4, "0")}`
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  return email
}

export function dbErrMsg(err: Error) {
  let errMsg
  const errorMessageParts = err.message.split("code =")

  if (errorMessageParts.length > 1) {
    const codeAndDesc = errorMessageParts[1].split("desc =")
    const errorCode = codeAndDesc[0]?.trim()
    const errorDesc = codeAndDesc[1]?.trim()
    errMsg = `${errorCode}: ${errorDesc}`
  }
  return errMsg
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast(errors.join("\n"))
  } else if (err instanceof Error) {
    const dbErr = dbErrMsg(err)
    return toast(dbErr ?? err.message)
  } else {
    return toast("Something went wrong, please try again later.")
  }
}

export function catchClerkError(err: unknown) {
  const unknownErr = "Something went wrong, please try again later."

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast(errors.join("\n"))
  } else if (isClerkAPIResponseError(err)) {
    return toast.error(err.errors[0]?.longMessage ?? unknownErr)
  } else {
    return toast.error(unknownErr)
  }
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export const nanToNull = (value: any) => {
  return value && value !== "" ? parseInt(value) : 0
}

export function isFormDirty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length > 0
}

/**
 *
 * @param newImg image mapped from form
 * @param oldImg image fetched
 * @returns
 */
export function isImageDirty(image: unknown) {
  const newImg = isArrayOfFile(image) ? image[0] : null
  return newImg ? newImg.size !== 0 : false
}

/**
 *
 * @param fileImg raw image file from form
 * @param startUpload method from uploadthing client
 * @returns
 */
export async function getImageToCreate(
  fileImg: unknown,
  startUpload: (
    files: File[],
    input?: undefined
  ) => Promise<UploadFileResponse[] | undefined>
) {
  const images = isArrayOfFile(fileImg)
    ? await startUpload(fileImg).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split("_")[1] ?? image.key,
          url: image.url,
        }))
        return formattedImages ? formattedImages[0] : null
      })
    : null

  return images
}

export function getImageToPreview(image?: StoredFile | null) {
  if (!image) {
    return null
  }

  const file = new File([], image.name, {
    type: "image",
  })
  const fileWithPreview = Object.assign(file, {
    preview: image.url,
  })

  return fileWithPreview
}
