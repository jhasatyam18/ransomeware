import { createPayload, getUrlPath } from "../../utils/ApiUtils"
describe("apiUtils.test.js : ApiUtils test ", () => {
  it("should return GET method when no type is provided", () => {
    expect(createPayload().method).toBe("GET")
    expect(createPayload().body).toBe(undefined)
  })
  it("Should return method name as post and body in stringfy format", () => {
    const payload = {username: "datamotive",password: "test",}
    expect(createPayload("POST", payload).method).toBe("POST")
    expect(createPayload("POST", payload).body).toBe(JSON.stringify(payload))
  })
  it("Should return the current url along with test provided", () => {
    expect(getUrlPath("dashboard")).toBe(`${window.location.origin}/dashboard`)
  })
})
