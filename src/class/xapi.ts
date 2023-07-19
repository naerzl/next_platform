import XAPI, { Verb } from "@xapi/xapi"
export class LrsXapiVerbs extends XAPI.Verbs {
  static readonly AUTHORIZE: Verb = {
    id: "http://activitystrea.ms/schema/1.0/authorize",
    display: {
      "en-US": "authorize",
      es: "authorize",
    },
  }
}
