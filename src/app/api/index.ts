import { fetcher } from "@/libs/fetch"
import { PermissionData } from "@/types/api"

export const reqGetTry = (url: string) => fetcher({ url })

export const getPermissionCurrentUser = (url: string): Promise<PermissionData[]> => fetcher({ url })
