import Login from "./components/Login"
import Registration from "./components/Registration"
import Todoapp from "./components/Todoapp"
import { createBrowserRouter,RouterProvider } from "react-router"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/registration",
      element: <Registration/>,
    },
    {
      path: "/todo",
      element: <Todoapp/>,
    }
  ]);


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App 
