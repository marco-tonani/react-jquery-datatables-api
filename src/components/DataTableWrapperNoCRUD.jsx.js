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

const DataTableWrapper = ({ fetchUrl }) => {
  DataTable.use(DT)
  DT.Buttons.jszip(jszip)
  DT.Buttons.pdfMake(pdfmake)

  const [tableData, setTableData] = useState([]) // State to store fetched data
  const [columns, setColumns] = useState([]) // State to store table columns

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl) // Fetch data from API
        const data = await response.json() // Parse JSON response

        // Set table data
        setTableData(data)

        // Dynamically set columns based on the data structure
        if (data.length > 0) {
          const sample = data[0] // Get the first item for column keys
          const cols = Object.keys(sample).map((key) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column title
            data: key,
          }))
          setColumns(cols)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [fetchUrl])

  return (
    <div>
      {columns.length > 0 && tableData.length > 0 ? (
        <DataTable
          data={tableData}
          columns={columns}
          options={{
            layout: {
              topStart: "buttons",
            },
            responsive: true,
            select: true,
          }}
          className="display"
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  )
}

DataTableWrapper.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
}

export default DataTableWrapper
