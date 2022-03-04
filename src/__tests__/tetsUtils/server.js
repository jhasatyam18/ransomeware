
import { rest } from "msw"

export function withoutErrorResponse(URL,RESP){
  return rest.get(URL, (req, res, ctx) => {
        return res(
          ctx.json(
            RESP
          )
        )
      })
}
  
 export const withErrorResponse = (URL)=>{
 return rest.get(URL, (req, res, ctx) => {
    return res(ctx.status(403), ctx.json({ message: "ssh" }))
  })
 }

