import { useState, useEffect } from "react"
import PropTypes from "prop-types"

import DataTable from "datatables.net-react"
import DT from "datatables.net-dt"
import "datatables.net-responsive-dt"
import "datatables.net-select-dt"
import "datatables.net-buttons-dt"
import "datatables.net-buttons/js/buttons.html5"
import jszip from "jszip"
import pdfmake from "pdfmake"
import "pdfmake/build/vfs_fonts"
import "./DataTableWrapper.css"

const DataTableWrapper = ({ fetchUrl, insertUrl }) => {
  DataTable.use(DT)
  DT.Buttons.jszip(jszip)
  DT.Buttons.pdfMake(pdfmake)

  const [tableData, setTableData] = useState([]) // State to store fetched data
  const [columns, setColumns] = useState([]) // State to store table columns
  const [formData, setFormData] = useState({ firstname: "", surname: "", email: "" }) // Form data for modal
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility

  useEffect(() => {
    fetchData()
  }, [fetchUrl])

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch(fetchUrl)
      const data = await response.json()
      setTableData(data)

      if (data.length > 0) {
        const cols = Object.keys(data[0]).map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          data: key,
        }))
        setColumns(cols)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Open the modal for adding a new row
  const openModal = () => {
    setFormData({ firstname: "", surname: "", email: "" })
    setIsModalOpen(true)
  }

  // Close the modal
  const closeModal = () => {
    setFormData({ firstname: "", surname: "", email: "" })
    setIsModalOpen(false)
  }

  // Add a new row
  const handleAddRow = async () => {
    try {
      const newId =
        tableData.length > 0 ? Math.max(...tableData.map((row) => row.id)) + 1 : 1
      const newRow = { id: newId, ...formData }

      const response = await fetch(insertUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      })

      if (!response.ok) throw new Error("Failed to insert data")

      const addedRow = await response.json()
      setTableData([...tableData, addedRow])
      closeModal()
    } catch (error) {
      console.error("Error adding new row:", error)
    }
  }

  return (
    <div>
      <h2>Data Table with Add Row Modal</h2>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Row</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddRow()
              }}
            >
              <div className="form-group">
                <label>
                  First Name:
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Surname:
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Add
                </button>
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DataTable Component */}
      {columns.length > 0 && tableData.length > 0 ? (
        <DataTable
          data={tableData}
          columns={columns}
          options={{
            responsive: true,
            select: true,
            buttons: ["copy", "csv", "excel", "pdf"],
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}

      <button onClick={openModal} className="btn-add">
        Add New Row
      </button>
    </div>
  )
}

DataTableWrapper.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  insertUrl: PropTypes.string.isRequired, // URL for the API to insert a new row
}

export default DataTableWrapper
