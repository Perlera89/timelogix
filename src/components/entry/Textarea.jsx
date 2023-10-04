import React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

const App = ({placeholder, maxLength}) => (
    <TextArea
      maxLength={maxLength || 50}
      style={{
        height: 120,
        resize: 'none',
      }}
      onChange={null}
      placeholder={placeholder || "Add a note"}
    />
);
export default App;