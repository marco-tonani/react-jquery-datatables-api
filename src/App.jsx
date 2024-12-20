import DataTableWrapper from "./components/DataTableWrapper"
import "./App.css"

function App() {
  const fetchUrl = "https://json-server-ewpc.onrender.com/users"
  const insertUrl = "https://json-server-ewpc.onrender.com/users"
  return (
    <DataTableWrapper fetchUrl={fetchUrl} insertUrl={insertUrl} />
  )
}

export default App
