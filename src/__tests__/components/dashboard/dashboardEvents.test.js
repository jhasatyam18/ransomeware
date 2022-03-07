import React from "react"
import { render, cleanup, screen, act } from "@testing-library/react"
import DashboardEvents from "../../../components/Dashboard/DashboardEvents"
import { setupServer } from "msw/node"
import { API_FETCH_EVENTS } from "../../../constants/ApiConstants"
import renderWitRedux from "../../tetsUtils/reduxRender"
import { withoutErrorResponse, withErrorResponse } from "../../tetsUtils/server"

// server setups
let resp1 = [
  {
    id: 1,
    topic: "Migration",
    description: "Migrated",
    level: "WARNING",
    affectedObjectID: 1,
    type: "migration.completed",
    timeStamp: 1622527277,
    generator: "System",
  },
]

let resp2 = [
  {
    id: 1,
    topic: "Migration",
    description: "Migrated",
    level: "ERROR",
    affectedObjectID: 1,
    type: "migration.completed",
    timeStamp: 1622527277,
    generator: "System",
  },
]

let resp3 = [
  {
    id: 1,
    topic: "Migration",
    description: "Migrated",
    level: "CRITICAL",
    affectedObjectID: 1,
    type: "migration.completed",
    timeStamp: 1622527277,
    generator: "System",
  },
]

let resp4 = [
  {
    id: 1,
    topic: "Migration",
    description: "Migrated",
    level: "ALL",
    affectedObjectID: 1,
    type: "migration.completed",
    timeStamp: 1622527277,
    generator: "System",
  },
]

let resp5 = [
  {
    id: 1,
    topic: "Migration",
    description: "Migrated",
    level: "SS",
    affectedObjectID: 1,
    type: "migration.completed",
    timeStamp: 1622527277,
    generator: "System",
  },
]

const eventAPIResponse1 = withoutErrorResponse(API_FETCH_EVENTS, resp1)

const eventAPIResponse2 = withoutErrorResponse(API_FETCH_EVENTS, resp2)
const eventAPIResponse3 = withoutErrorResponse(API_FETCH_EVENTS, resp3)
const eventAPIResponse4 = withoutErrorResponse(API_FETCH_EVENTS, resp4)
const eventAPIResponse5 = withoutErrorResponse(API_FETCH_EVENTS, resp5)

const eventAPIErrorResponse = withErrorResponse(API_FETCH_EVENTS)

const handlers = [
  eventAPIResponse1,
  eventAPIResponse2,
  eventAPIResponse3,
  eventAPIResponse4,
  eventAPIResponse5,
  eventAPIErrorResponse,
]

const server = new setupServer(...handlers)

// Tests

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
    let div = document.getElementsByClassName(
      "bx app_warning bx bxs-error font-size-14"
    )
    const text = await screen.findByText("Migrated")

    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })

  xit("should render erroe components when server throws an error", async () => {
    server.use(eventAPIErrorResponse)
    renderWitRedux(<DashboardEvents />)
    let para = await screen.findByText("events")
    expect(para).toBeInTheDocument()
  })

  it("Should render div with classname as danger when response.level is ERROR", async () => {
    server.use(eventAPIResponse2)
    renderWitRedux(<DashboardEvents />)

    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName(
      "bx app_danger bxs-x-circle font-size-14"
    )
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })

  it("should render a div with clasname as danger when response.level is CRITICAL", async () => {
    server.use(eventAPIResponse3)
    renderWitRedux(<DashboardEvents />)

    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName(
      "bx app_danger bxs-x-circle font-size-14"
    )
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })

  it("should render a div with clasname as primary when response.level is ALL", async () => {
    server.use(eventAPIResponse4)
    renderWitRedux(<DashboardEvents />)

    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName(
      "bx app_primary bxs-check-circle font-size-14"
    )
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })

  it("should render a div with clasname as success when response.level is not known", async () => {
    server.use(eventAPIResponse5)
    renderWitRedux(<DashboardEvents />)

    const text = await screen.findByText("Migrated")
    let div = document.getElementsByClassName(
      "bx app_success bxs-check-circle font-size-14"
    )
    expect(text).toBeInTheDocument()
    expect(div.length).toBe(1)
  })
})
