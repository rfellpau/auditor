import { useState, useRef } from 'react'
import expected from './store/expected.json';
import missing from './store/missing.json';
import QRCode from 'react-qr-code';

const dateStringFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}

function App() {
  const [displayModal, setDisplayModal] = useState(false)
  const [modalState, setModalState] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [state, setState] = useState(missing)
  
  const alert = useRef(null)

  const alphabetically = (a, b) => a.reg < b.reg ? -1 : 1;
  const findById = (id) => state.payload.find(item => item.id === id)
  const formatReg = (reg) => `${reg.substring(0, 4)} ${reg.substring(4)}`
  const matchSearchQuery = (item) => item.reg.includes(searchQuery)

  const setSelectedOption = (event) => {
    switch(event.target.value) {
      case 'expected':
        setState(expected)
        break
      case 'missing':
        setState(missing)
    }
  }

  return (
    <>
      <div className="alert alert-dismissible alert-primary mb-0 px-0 rounded-0" role="alert" ref={alert}>
        <div className="container">
          <strong>Updated:</strong> {new Date(state.meta.timestamp * 1000).toLocaleDateString('en-GB', dateStringFormat)}
          <button 
          type="button" 
          className="btn-close"
          onClick={() => alert.current.remove()}/>
        </div>
      </div>

      <nav className="bg-body-tertiary border-bottom navbar">
        <div className="container">
          <div className="align-items-center d-flex flex-grow-1">

            <span className="fw-bold mb-0 navbar-brand">
                <span className="me-2">Auditor</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                </svg>
            </span>

            <div className="input-group input-group-lg">
              <input 
                className="form-control" 
                type="search" 
                placeholder="Search... AB01XYZ"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value.toUpperCase())}/>
            </div>

          </div>
        </div>
      </nav>

      <div className="container">
        <select 
          className="form-select mt-2 mb-1" 
          defaultValue="missing"
          onChange={setSelectedOption}>
          <option disabled>Select an option...</option>
          <option value="expected">Expected Audits ({expected.payload.length})</option>
          <option value="missing">Missing Audits ({missing.payload.length})</option>
        </select>

        <table className="align-middle table">
          <tbody>
            {state.payload
            .filter(matchSearchQuery)
            .sort(alphabetically)
            .map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <span 
                    style={{fontSize: 24, paddingTop: 5, paddingRight: 10, paddingBottom: 5, paddingLeft: 10}} 
                    className="bg-warning font-monospace fw-bold rounded-1 text-nowrap">
                    {formatReg(item.reg)}
                  </span>
                </td>
                <td>
                  <span className="fw-medium">{item.dsp}</span>
                </td>
                <td>
                  <span className="d-none d-sm-block fw-normal">{item.vin}</span>
                </td>
                <td>
                <button 
                  type="button" 
                  className="btn btn-light p-2"
                  onClick={() => {
                    setModalState(findById(item.id))
                    setDisplayModal(true)
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

        {displayModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>  
          <div className="modal-dialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <span 
                        style={{fontSize: 48, lineHeight: 1, paddingTop: 10, paddingRight: 15, paddingBottom: 10, paddingLeft: 15}} 
                        className="bg-light border border-3 font-monospace fw-bold rounded-3 text-nowrap">
                        {formatReg(modalState.reg)}
                      </span>
                      <button 
                          type="button" 
                          className="btn-close fs-3" 
                          onClick={() => setDisplayModal(false)}/>
                  </div>
                  <div className="modal-body pb-1">
                      <div style={{ height: "auto", margin: "0 auto", maxWidth: 512, width: "100%" }}>
                          <QRCode
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={modalState.vin}
                          viewBox={`0 0 256 256`}/>
                      </div>
                      <span className="d-block fs-5 fw-medium my-2 text-black text-center">
                        {modalState.vin}
                      </span>
                  </div>
              </div>
          </div>
        </div>
        )}
      </div>
    </>
  )
}

export default App
