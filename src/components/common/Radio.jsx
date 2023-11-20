import { Radio } from 'antd'
const RadioPage = ({ defaultValue, options, handleChange }) => {
  <Radio.Group
    defaultValue={defaultValue}
    className="min-w-[125px]"
    options={options}
    onChange={handleChange}
    optionType="button"
    buttonStyle="solid"
  />
}

export default RadioPage
