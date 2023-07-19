import LrsOauthClient from "@zctc/edms-lrs-oauth1.0"
import LrsFormData from "@/class/LrsFormDate"
import { LrsOauth2 } from "@/class"

export let OauthObj = new LrsOauthClient(
  {
    key: process.env.NEXT_PUBLIC_CONSUMER_KEY as string,
    secret: process.env.NEXT_PUBLIC_CONSUMER_SECRET as string,
  },
  process.env.NEXT_PUBLIC_SIGNATURE_METHOD as string,
)

export let formDataInstance = new LrsFormData()

export const lrsOAuth2Instance = new LrsOauth2()
