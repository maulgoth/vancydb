import { Dropdown, Input } from 'semantic-ui-react'

const options = [
  { key: 'page', text: 'This Page', value: 'page' },
  { key: 'org', text: 'This Organization', value: 'org' },
  { key: 'site', text: 'Entire Site', value: 'site' },
]

/**
 * Component used to perform search against the oracle db.
 * 
 */
const SearchBar = () => {
    return ( <Input fluid inverted icon='search'   action={
        <Dropdown inverted button basic floating options={options} defaultValue='page' />
      }
      placeholder='Search...' />);
}

export default SearchBar;