import React, { useState, useEffect } from 'react'
import styles from  "./BuildingPermitFinish.module.css";
import {
  Panel,
  Subtitle,
  Spacer,
  ViewButton
} from 'rsi-react-web-components'

const BuildingPermitFinish = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [app, setApp] = useState({})
  const [ancillaryPermits, setAncillaryPermits] = useState([])

  const resetStatus = () => {
    setError(null)
    setLoading(false)
  }

  const loadApplication = () => {
    setLoading(true)
    appService.getApplication({ appid: appno }, (err, app) => {
      if (err) {
        setError(err)
      } else {
        setApp(app)
        resetStatus()
      }
    })
  }

  const loadAncillaryPermits = () => {
    setLoading(true)
    appService.getAncillaryPermits(
      { appid: appno },
      (err, ancillaryPermits) => {
        if (err) {
          setError(err)
        } else {
          setAncillaryPermits(ancillaryPermits)
          resetStatus()
        }
      }
    )
  }

  useEffect(() => {
    loadApplication()
    loadAncillaryPermits()
  }, [])


  const viewPermit = (permit) => {

  }

  return (
    <Panel className={styles.bldgPermitFinish}>
      <Subtitle>Congratulations!</Subtitle>
      <p>You have completed the application. Please click and print the following:</p>
      <ol className={styles.bldgPermitFinish_info}>
        <li>Building Permit [Print 4 Copies] [Download Data]</li>
        <li>Ancillary Permits</li>
          <Panel visibleWhen={ancillaryPermits.length > 0} style={styles.ancillaryContainer} >
            {ancillaryPermits.map((permit) => (
              <div style={styles.permitRow} key={permit.objid}>
                <label>{permit.type.title}</label>
                <ViewButton
                  action={() => viewPermit(permit)}
                  iconStyle={{ color: 'green' }}
                />
                <a
                  href="http://192.168.1.9:85/reports/obo/electricalpermit?refid=OBOBPANC101b489f:17467153eef:-8000"
                  target="_blank"
                >
                  View Report
                </a>
              </div>
            ))}
          </Panel>
          <li>
            Please download and print the Building and Ancillary Permit forms, prepare the requirements
            listed below, and submit at the receiving window of our One-Stop Shop for Construction
            Permits (OSCP) at the Ground Floor, City of Engineering Office, Miguel Lopez del Legazpi
            Boulevard, Dapdap, Legazpi City.
          </li>
      </ol>
      <h4>Checklist of Requirements</h4>
      <p>[Download and Print]</p>
      <p>
      Four (4) copies of duly accomplished and notarized Application Form for Building
      Permit and the necessary Ancillary Permit Forms.
      </p>
      <Spacer />
      <p><strong>Proof of lot/property ownership</strong></p>
      <p>
        a. In case the applicant is the registered owner of the lot, one (1) certified true copy of
        latest Original Certificate of Title (OCT)/Transfer Certificate of Title (TCT), on file with
        the Registry of Deeds.
      </p>
      <p>
        b. In case the applicant is not the registered owner of the lot, in addition to the certified
        true copy of latest Original Certificate of Title (OCT)/Transfer of Certificate of Title (TCT),
        duly notarized copy of the Contract of Lease, Award Notice, Deed of Absolute Sale, Contract
        to Sell, Extra-Judicial Settlement or Authority from the registered owner.
      </p>
      <p>
      Certification from a duly licensed and registered Geodetic Engineer that the proposed Construction,
      renovation, alteration, repare or addition shall be within the property of the owner/applicant and will
      not encroach any adjoining property (incorporated in the first page of Architectural Design Plans)
      </p>
      <p>
      Four (4) sets of Survey Plans, Design Plans/Drawings, Specifications and other documents prepared,
      signed and sealed over the printed name of the respective duly licensed and registered design
      professionals, and approved by the owner/applicant
      </p>
      <ul>
          <li>Architectural Documents (Architect)</li>
          <li>Civil/Structural Documents (Civil/Structural Engineer)</li>
          <li>Electrical Documents(Professional Electrical Engineer)</li>
          <li>Mechanical Documents(Professional Mechanical Engineer)</li>
          <li>Sanitary Documents (Sanitary Engineer)</li>
          <li>Plumbing Documents (Master Plumber)</li>
          <li>Electronics Documents (Electronics Engineer)</li>
          <li>Geodetic Documents (Geodetic Engineer)</li>
          <li>Others</li>
      </ul>
      <p>
       Three (3) sets of Structural Analysis and Design, signed and sealed over the printed name of
       the duly licensed and registered Civil
      </p>

    </Panel>
  )
}

// const styles = {
//   ancillaryContainer: {
//     marginLeft: 20
//   },
//   permitRow: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 30,
//   }
// }

export default BuildingPermitFinish
