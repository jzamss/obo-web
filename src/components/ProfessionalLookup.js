import React, { useState } from 'react'
import {
  Lookup,
  Panel,
  FormPanel,
  Text,
  Button,
  Table,
  TableColumn,
  Service
} from 'rsi-react-web-components'

const svc = Service.lookup("OboProfessionalService", "obo");

const ROWS_PER_PAGE = 5;

const ProfessionalLookup = ({
  caption,
  onSelect,
  hideSearchText=false
}) => {
  const [showLookup, setShowLookup] = useState(false)
  const [query, setQuery] = useState({prc:{}});
  const [selectedItems, setSelectedItems] = useState();
  const [professionals, setProfessionals] = useState()

  const onSelectItems = (items) => {
    setSelectedItems(items);
  }

  const onAcceptLookup = () => {
    onSelect(selectedItems);
  }

  const fetchList = (params) => {
      if (svc) {
        const p = {...query, ...params};
        svc.getList(p, (err, list) => {
          setProfessionals(list);
        });
      }
  }

  const search = () => {
    fetchList({limit: ROWS_PER_PAGE, start: 0});
  }

  return (
    <div>
      <Lookup caption='Search Professional'
        query={query}
        setQuery={setQuery}
        searchFieldTitle="PRC No."
        searchField="prc.idno"
        onSelect={onAcceptLookup}
        fetchList={fetchList}
        hideSearchText={hideSearchText}
      >
        <FormPanel context={query} handler={setQuery}>
          <Text caption='PRC No.' name='prc.idno' width={200} fullWidth={false} variant='outlined' />
          <span>or</span>
          <Panel row>
            <Text caption='Last Name' name='lastname' variant='outlined' />
            <Text caption='First Name' name='firstname' variant='outlined' />
          </Panel>
          <Button caption='Search' action={search} />
        </FormPanel>
        <Table
          items={professionals}
          fetchList={fetchList}
          rowsPerPage={ROWS_PER_PAGE}
          showPagination={false}
          singleSelect={true}
          keyId="objid"
          onSelectItems={onSelectItems}
        >
          <TableColumn caption='PRC' expr='prc.ino' />
          <TableColumn caption='Name' expr={item => `${item.lastname}, ${item.firstname} ${item.middlename}`} />
          <TableColumn caption='Profession' expr='profession' />
        </Table>
      </Lookup>
    </div>
  )
}

export default ProfessionalLookup
