import { createElement } from 'react'
import './App.css'
import { Middleware } from './components/scripts/Middleware'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import routes from './routers/routes'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
function App() {  
// console.log(routes)
  const router = createBrowserRouter(
    routes.map((route) => ({
      ...route,
      element: route.is_protected ? <Middleware children={createElement(route.element)} type={route.middleware}/> : createElement(route.element),
      children: route.children?.map((child) => ({
          ...child,
          element: child.is_protected ? <Middleware children={createElement(route.element) }type={route.middleware}/> : createElement(child.element)
      }))
    }))  
  )

  return (
    <>
      
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <RouterProvider router={router}/>
          </PersistGate>
      </Provider>
    </>
  )
}
export default App 