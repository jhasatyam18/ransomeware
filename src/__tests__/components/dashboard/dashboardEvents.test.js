import React from "react"
import {  cleanup, screen } from "@testing-library/react"
import DashboardEvents from "../../../components/Dashboard/DashboardEvents"
import { setupServer } from "msw/node"
import { API_FETCH_EVENTS } from "../../../constants/ApiConstants"
import renderWitRedux from "../../tetsUtils/RenderWithRedux"
import { withoutErrorResponse, withErrorResponse } from "../../tetsUtils/Server"
// server setups
let responsewithLevelWarning = [{id:1,topic:"Migration",description:"Migrated",level:"WARNING"}]
let responsewithLevelError = [{id:1,topic:"Migration",description:"Migrated",level:"ERROR"}]
let responsewithLevelCritical = [{id:1,topic:"Migration",description:"Migrated",level:"CRITICAL"}]
let responsewithLevelAll = [{id:1,topic:"Migration",description:"Migrated",level:"ALL"}]
let responsewithLevelNotKnown = [{id:1,topic:"Migration",description:"Migrated",level:"NOT"}]
const eventResponsewithLevelWarning = withoutErrorResponse(API_FETCH_EVENTS, responsewithLevelWarning)
const eventResponsewithLevelError = withoutErrorResponse(API_FETCH_EVENTS, responsewithLevelError)
const eventResponsewithLevelAll = withoutErrorResponse(API_FETCH_EVENTS, responsewithLevelAll)
const eventResponsewithLevelNotKnown = withoutErrorResponse(API_FETCH_EVENTS, responsewithLevelNotKnown)
const eventResponsewithLevelCritical = withoutErrorResponse(API_FETCH_EVENTS, responsewithLevelCritical)
const eventAPIErrorResponse = withErrorResponse(API_FETCH_EVENTS)
const handlers = [eventResponsewithLevelWarning,eventResponsewithLevelError,eventResponsewithLevelNotKnown, eventResponsewithLevelAll, eventAPIErrorResponse]
const server = new setupServer(...handlers)
describe("dashboardEvents.test.js : Dashboard Events Tests", () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  afterEach(cleanup)
  it("DashboardEvent should render", async () => {
    renderWitRedux(<DashboardEvents />)
    const text = await screen.findByText("Migrated")
    expect(text).toBeInTheDocument()
  })
  it("DashboardEvent: there must be a div with different classname when response.level is diffrent", async () => {
    renderWitRedux(<DashboardEvents />)
    let div = document.getElementsByClassName("bx app_warning bx bxs-error font-size-14")
    const text = await screen.findByText("Migrated")
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
  it("should render error components when server throws an error", async () => {
    server.use(eventAPIErrorResponse)
    renderWitRedux(<DashboardEvents />)
    let para = await screen.findByText("Events")
    expect(para).toBeInTheDocument()
  })
  it("Should render div with classname as danger when response.level is ERROR", async () => {
    server.use(eventResponsewithLevelError)
    renderWitRedux(<DashboardEvents />)
    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName("bx app_danger bxs-x-circle font-size-14")
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
  it("should render a div with clasname as danger when response.level is CRITICAL", async () => {
    server.use(eventResponsewithLevelCritical)
    renderWitRedux(<DashboardEvents />)
    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName("bx app_danger bxs-x-circle font-size-14")
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
  it("should render a div with clasname as primary when response.level is ALL", async () => {
    server.use(eventResponsewithLevelAll)
    renderWitRedux(<DashboardEvents />)
    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName("bx app_primary bxs-check-circle font-size-14")
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
  it("should render a div with clasname as success when response.level is not known", async () => {
    server.use(eventResponsewithLevelNotKnown)
    renderWitRedux(<DashboardEvents />)
    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName("bx app_success bxs-check-circle font-size-14")
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
})
