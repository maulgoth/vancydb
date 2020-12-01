import { Dropdown, Input } from 'semantic-ui-react'

const options = [
  { key: 'lv', text: 'Land Value', value: 'lv' },
  { key: 'tv', text: 'Tax Levy', value: 'tv' },
  { key: 'iv', text: 'Improvement Value', value: 'iv' },
]

/**
 * Component used to perform search against the oracle db.
 * 
 */
const SearchBar = () => {
    return ( <Input fluid inverted icon='search'   action={
        <Dropdown inverted button basic floating options={options} defaultValue='lv' />
      }
      placeholder='Search...' />);
}

export default SearchBar;