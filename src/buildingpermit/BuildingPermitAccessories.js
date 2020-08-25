import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Subtitle2,
  Spacer,
  Service,
  Error,
  FormPanel,
  Checkbox,
  ActionBar,
  Button,
  Label,
  Decimal,
  Integer
} from "rsi-react-web-components";

const components = {
  "decimal": Decimal,
  "integer": Integer,
  "boolean": Checkbox
}

const BuildingPermitAccessories = (props) => {
  const { partner, appno, appService, moveNextStep, stepCompleted } = props;

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [buildingIsAccessory, setBuildingIsAccessory] = useState(false);
  const [hasItems, setHasItems] = useState(false);
  const [accessoryList, setAccessoryList] = useState([]);
  const [accessoryTypes, setAccessoryTypes] = useState({});
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [infos, setInfos] = useState({});

  const loadAccessories = () => {
    appService.getAccessories({appid: appno}, (err, accessories) => {
      if (accessories && accessories.length > 0) {
        const infos = {};
        accessories.forEach(ac => {
          if( ac.app.occupancytypeid == ac.occupancytypeid ) {
            setBuildingIsAccessory(true);
            ac.infos.forEach(info => {
              infos[info.name.toLowerCase()] = info.value;
            });
          }
        });
        setAccessoryList(accessories);
        setInfos(infos);
        setHasItems(true);
      } else {
        const svc = Service.lookup("OboMiscListService", "obo");
        svc.getAccessoryOccupancyTypes((err, occupancyTypes) => {
          if (err) {
            setError(err);
          } else {
            const accessoryTypes = {};
            occupancyTypes.forEach(ot => {
              accessoryTypes[`${ot.objid.toLowerCase()}`] = false;
            });
            setOccupancyTypes(occupancyTypes);
            setAccessoryTypes(accessoryTypes);
            setHasItems(false);
          }
        });
      }
    });
  }

  useEffect(() => {
    loadAccessories();
  }, []);

  const saveAccessories = () => {
		const items = [];
    const deleted = [];
    for (const prop in accessoryTypes) {
      if (accessoryTypes[prop]) {
				items.push(prop);
			}
			else {
				deleted.push(prop);
			}
    }

		if( items.length > 0 ) {
			const p = {};
			p.appid = appno;
			p.items = items;
			p.deleted = deleted;
			appService.saveAccessories(p, (err, res) => {
        if (err) setError(err);
      });
		}
		else {
			if( deleted.length > 0 ) {
				var p = {};
				p.appid = appno;
				p.items = [];
				p.deleted = deleted;
				appService.saveAccessories(p, (err, res) => {
          if (err) setError(err);
        });
			}
		}
  }

  const submitAccessoryTypes = () => {
    if (Object.keys(accessoryTypes).length > 0) {
      saveAccessories();
      loadAccessories();
    } else {
      moveNextStep();
    }
  }

  const redoSelection = () => {
    const isRedo = confirm("Unchecking will remove the accessory information already encoded. Continue anyway?");
    if (isRedo) {
      const deleted = [];
      accessoryList.forEach(o => {
        deleted.push(`${o.occupancytypeid}`);
      });
      appService.saveAccessories({appid: appno, deleted});
      loadAccessories();
    }
  }

	const saveAccesoryInfos = () => {
		var p = {appid: appno};
		p.infos = [];
		for(const prop in infos) {
			p.infos.push( {name: prop, value: infos[prop] } );
		}
		appService.saveAccessoryInfos(p, (err, res) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep();
      }
    });
	}

  return (
    <Panel>
      <Subtitle>Accessories</Subtitle>
      <Spacer />
      <Error msg={error} />

      <Panel visibleWhen={hasItems === false}>
        <Subtitle2>Select accessory to add if applicable</Subtitle2>
        <FormPanel context={accessoryTypes} handler={setAccessoryTypes}>
          {occupancyTypes.map(ot =>
            <Checkbox key={ot.objid} caption={ot.title} name={`${ot.objid.toLowerCase()}`} />
          )}
        </FormPanel>
        <ActionBar>
          <Button caption="Next" action={submitAccessoryTypes} />
        </ActionBar>
      </Panel>

      <FormPanel visibleWhen={hasItems === true} context={infos} handler={setInfos}>
        {accessoryList.map(o => {
          return (
            <div key={o.objid}>
              <Label style={styles.infoTitle}>{o.type.title}</Label>
              {o.infos.map(info => {
                const InfoComponent = components[info.datatype];
                return (
                  <div style={styles.infoContainer}>
                    <label>{`${info.caption.toLowerCase()} (${info.unit.toLowerCase()})`}</label>
                    <InfoComponent
                      name={info.name.toLowerCase()}
                      fullWidth={false}
                      variant="outlined"
                      size="small"
                      width={150}
                      style={{flexBasis: 100}}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
        <ActionBar visibleWhen={!stepCompleted}>
          <Button caption="Redo" action={redoSelection} visibleWhen={buildingIsAccessory} />
          <Button caption="Next" action={saveAccesoryInfos} />
        </ActionBar>
      </FormPanel>
    </Panel>

  )
}

const styles = {
  infoTitle: {
    fontWeight: "bold",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
  },
}

export default BuildingPermitAccessories
