import { useState } from 'react'
import data from './store/data.json';
import QRCode from "react-qr-code";

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState(data[0])
  const [showModal, setShowModal] = useState(false)
  const [vehicles] = useState(data)

  const alphabetically = (a, b) => a.reg < b.reg ? -1 : 1;
  const format = (value) => `${value.slice(0, 4)} ${value.slice(4)}`
  const matchSearchQuery = (vehicle) => vehicle.reg.includes(searchQuery)

  return (
    <>
      <nav className="bg-body-tertiary border-bottom navbar">
        <div className="container">
          <div className="align-items-center d-flex flex-grow-1">
            <span className="fw-bold mb-0 navbar-brand">
                <span className="me-2">Auditor</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                </svg>
            </span>
            <form className="flex-grow-1" role="search">
              <div class="input-group input-group-lg">
                <input 
                className="form-control" 
                type="search" 
                placeholder="Search... AB01XYZ"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value.toUpperCase())}
                />
              </div>
            </form>
          </div>
        </div>
      </nav>

      <div className="container">
        <table className="align-middle table">
          <tbody>
            {vehicles.filter(matchSearchQuery).sort(alphabetically).map((vehicle, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <span 
                      style={{fontSize: 24, paddingTop: 5, paddingRight: 10, paddingBottom: 5, paddingLeft: 10}} 
                      className="bg-warning font-monospace fw-bold rounded-1 text-nowrap">
                      {format(vehicle.reg)}
                    </span>
                  </td>
                  <td>
                    <span className="fw-medium">{vehicle.dsp}</span>
                  </td>
                  <td>
                    <span className="d-none d-sm-block fw-normal">{vehicle.vin}</span>
                  </td>
                  <td>
                  <button 
                    type="button" 
                    className="btn btn-light p-2" 
                    onClick={() => {
                      setSelected(vehicle)
                      setShowModal(true)
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-qr-code-scan" viewBox="0 0 16 16">
                        <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z"/>
                        <path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z"/>
                        <path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z"/>
                        <path d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z"/>
                        <path d="M12 9h2V8h-2z"/>
                      </svg>
                  </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <span 
                          style={{fontSize: 48, lineHeight: 1, paddingTop: 10, paddingRight: 15, paddingBottom: 10, paddingLeft: 15}} 
                          className="bg-light border border-3 font-monospace fw-bold rounded-3 text-nowrap">
                          {format(selected.reg)}
                        </span>
                        <button 
                            type="button" 
                            className="btn-close fs-3" 
                            aria-label="Close"
                            onClick={() => setShowModal(false)}/>
                    </div>
                    <div className="modal-body pb-1">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 512, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={selected.vin}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <span className="d-block fs-5 fw-medium my-2 text-black text-center">
                          {selected.vin}
                          </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App
