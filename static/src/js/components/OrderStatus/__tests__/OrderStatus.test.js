import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { StaticRouter } from 'react-router'
import { retrievalStatusProps, retrievalStatusPropsTwo } from './mocks'
import { Well } from '../../Well/Well'
import { OrderStatus } from '../OrderStatus'
import configureStore from '../../../store/configureStore'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import * as getEnvironmentConfig from '../../../../../../sharedUtils/config'

const store = configureStore()

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = retrievalStatusProps

  const enzymeWrapper = mount(
    <Provider store={store}>
      <StaticRouter>
        <OrderStatus {...props} />
      </StaticRouter>
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    const orderStatus = enzymeWrapper.find(OrderStatus)
    expect(orderStatus).toBeDefined()
  })

  test('calls onFetchRetrieval when mounted', () => {
    const { props } = setup()
    expect(props.onFetchRetrieval).toHaveBeenCalledTimes(1)
    expect(props.onFetchRetrieval).toHaveBeenCalledWith(7, 'testToken')
  })

  test('calls onFetchRetrieval when new props are recieved', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.find(OrderStatus).instance().componentWillReceiveProps({
      ...retrievalStatusProps,
      ...retrievalStatusPropsTwo
    })
    expect(props.onFetchRetrieval).toHaveBeenCalledTimes(2)
    expect(props.onFetchRetrieval).toHaveBeenCalledWith(7, 'testToken')
  })

  describe('introduction', () => {
    beforeEach(() => {
      jest.spyOn(getEnvironmentConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'http://localhost' }))
    })

    test('displays the correct text', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).text()).toEqual('This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting http://localhost/downloads/7 or the Download Status and History page.')
    })

    test('download status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(0).props().href).toEqual('http://localhost/downloads/7')
    })

    test('status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(1).props().href).toEqual('http://localhost/downloads')
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      const { enzymeWrapper } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      expect(orderStatus.find('.order-status__collection-links-item').length).toEqual(1)
      expect(orderStatus.find('.order-status__collection-link').at(0).props().href).toEqual('http://linkurl.com/test')
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the search link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      const backToSearchLink = orderStatus.find('.order-status__footer-link-list').find(PortalLinkContainer).at(0)
      backToSearchLink.simulate('click')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?test=source_link')
    })
  })
})
