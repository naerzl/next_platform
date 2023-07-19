import { LrsTypeFormate } from "./LrsFormDate.d"
class LrsFormData {
  handleDate(date: Date, formate?: LrsTypeFormate): string {
    const year = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const H = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    let str = ""
    switch (formate) {
      case LrsTypeFormate["YYYY-MM-DD HH:mm:ss"]:
        str = `${year}-${M}-${D} ${H}:${m}:${s}`
        break
      case LrsTypeFormate["年月日"]:
        str = `${year}年${M}月${D}日 ${H}时${m}分${s}秒`
        break
      default:
        str = `${year}-${M}-${D} ${H}:${m}:${s}`
        break
    }
    return str
  }
  convertModelToFormData(model: any, form?: FormData, namespace = ""): FormData {
    let formData = form || new FormData()
    for (let propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || model[propertyName] == undefined) continue
      let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName
      if (model[propertyName] instanceof Date) {
        formData.append(formKey, this.handleDate(model[propertyName]))
      } else if (model[propertyName] instanceof Array) {
        if (model[propertyName].length > 0) {
          model[propertyName].forEach((element: any, index: number) => {
            if (typeof element != "object") formData.append(`${formKey}`, `[${element}]`)
            else {
              const tempFormKey = `${formKey}[${index}]`
              this.convertModelToFormData(element, formData, tempFormKey)
            }
          })
        } else {
          formData.append(formKey, "[]")
        }
      } else if (
        typeof model[propertyName] === "object" &&
        !(model[propertyName] instanceof File)
      ) {
        this.convertModelToFormData(model[propertyName], formData, formKey)
      } else {
        formData.append(formKey, model[propertyName].toString())
      }
    }
    return formData
  }
}

export default LrsFormData
