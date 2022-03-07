import React from "react"
import { render, cleanup, screen, act ,fireEvent} from "@testing-library/react"
import DashboardAlertOverview from "../../../components/Dashboard/DashboardAlertOverview"
import { setupServer } from "msw/node"
import { API_DASHBOARD_UNACK_ALERTS } from '../../../constants/ApiConstants';
import renderWitRedux from "../../tetsUtils/RenderWithRedux"
import { withoutErrorResponse, withErrorResponse } from "../../tetsUtils/Server"
const response = {criticalAlerts:0,errorAlerts:12,majorAlerts:9}
const alertApiMockSuccessResponse= withoutErrorResponse(API_DASHBOARD_UNACK_ALERTS,response)
const alertApiMockErrorResponse= withErrorResponse(API_DASHBOARD_UNACK_ALERTS)
const handlers=[alertApiMockSuccessResponse,alertApiMockErrorResponse]
const server= new setupServer(...handlers)
describe('DashboardAlertOverview : Dashboard alrts tests',()=>{
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    afterEach(cleanup)
    it('should render without error',async()=>{
        renderWitRedux(<DashboardAlertOverview />)
        let text= await screen.findByText("Alerts")
        expect(text).toBeInTheDocument()
    })
    it('should display response messages on the screen',async()=>{
        renderWitRedux(<DashboardAlertOverview />)
        let text= await screen.findByText("12")
        let text2= await screen.findByText("9")
        expect(text).toBeInTheDocument()
        expect(text2).toBeInTheDocument()
    })
    it('should render Error components',async()=>{
        server.use(alertApiMockErrorResponse)
        renderWitRedux(<DashboardAlertOverview />)
        let text= await screen.findByText("Alerts")
        expect(text).toBeInTheDocument()
    })
})