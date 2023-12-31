'use client'
import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { Modal, Button } from 'antd'

// icons
import { MdModeEdit, MdClose } from 'react-icons/md'

const App = ({ title, isModalOpen, handleEdit, handleCancel, children }) => {
  const [disabled, setDisabled] = useState(true)

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  })

  const draggleRef = useRef(null)
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    })
  }
  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move'
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false)
            }
          }}
          onMouseOut={() => {
            setDisabled(true)
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {title}
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      closeIcon={false}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      footer={null}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '8px'
        }}
      >
        <div className="flex justify-end mr-2">
          <Button
            type="text"
            icon={
              <MdModeEdit
                title="Edit task"
                className="text-font-color text-lg"
              />
            }
            className="flex justify-center items-center rounded-full"
            onClick={handleEdit}
          />
          <Button
            type="text"
            icon={
              <MdClose
                title="Close task"
                className="text-font-color text-2xl"
              />
            }
            className="flex justify-center items-center rounded-full"
            onClick={handleCancel}
          />
        </div>
      </div>
    </Modal>
  )
}
export default App
