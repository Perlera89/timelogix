import { Input } from 'antd'
import Fuse from 'fuse.js'

const Search = ({ text, onSearch, options, update }) => {
  const { Search } = Input

  const handleSearch = (value) => {
    if (value) {
      const fuseOptions = {
        keys: ['name'],
        threshold: 0.3
      }

      const fuse = new Fuse(options, fuseOptions)

      const results = fuse.search(value)

      console.log('results')
      onSearch(results.map((result) => result.item))
    } else {
      update(true)
    }
  }

  return (
    <>
      <Search
        allowClear
        placeholder={text || 'Search'}
        className="md:mr-4 xl:w-[400px] w-full"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
      />
    </>
  )
}

export default Search
