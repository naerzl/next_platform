// 初始化oauth1.0的数据个事
export interface LrsOathRequestData_Data {
  oauth_callback?: string
  oauth_verifier?: string
  oauth_token?: string
}

// oauth1.0加密合适
export interface LrsOaurhRequestData {
  url: string
  method: string
  data?: LrsOathRequestData_Data
}

export interface XapiType {
  version?: string
  id?: string
  actor: {
    mbox?: string
    openid?: string
    account?: {
      homePage: string
      name: string
    }
    name?: string
    objectType: "Agent" | "Group"
    member?: any[]
  }
  verb: {
    id: string
    display?: {
      "en-US"?: string
      es?: string
    }
  }
  object: {
    id: string
    objectType?: "Activity"
    definition?: {
      name?: {
        "en-US": string
      }
      description?: {
        "en-US": string
      }
      type?: string
      moreInfo?: string
    }
  }
  timestamp?: Date
}
