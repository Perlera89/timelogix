// components
import { Layout, Button, Typography } from 'antd'
import Settings from '@/components/Settings'
import IconButton from '@/components/button/IconButton'
import Modal from '@/components/Modal'
import ClockIn from '@/components/timesheet/ClockIn'
import Result from '@/components/common/Result'
// icons
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPlayFill,
  RiStopFill
} from 'react-icons/ri'

const { Header } = Layout
const { Title } = Typography

const HeaderPage = ({
  clockin,
  error,
  path,
  startClock,
  time,
  setClockin,
  openResult,
  isModalOpen,
  isClockinValidated,
  eventHandlers,
  handleCollapsed,
  collapsed,
  user
}) => {
  return (
    <>
      <Header
        className="border-b-[1px] border-border-black"
        style={{
          padding: 0,
          background: '#191919'
        }}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-start">
            <Button
              type="text"
              className="flex items-center justify-center"
              icon={
                collapsed
                  ? (
                  <RiArrowRightSLine className="text-2xl" title="Show menu" />
                    )
                  : (
                  <RiArrowLeftSLine className="text-2xl" title="Hide menu" />
                    )
              }
              onClick={handleCollapsed}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64
              }}
            />
            <Title
              className="flex items-center text-ghost-white mt-3"
              level={4}
            >
              {path.slice(5)}
            </Title>
          </div>
          <div className="flex justify-end mr-4 gap-4">
            {startClock
              ? (
              <div className="flex items-center justify-center gap-2">
                <p className="">{time}</p>
                <IconButton
                  icon={
                    <RiStopFill
                      className="mx-4 text-red-500 text-2xl transition-colors"
                      title="Stop Clock"
                    />
                  }
                  size="default"
                  click={eventHandlers.handleClock}
                />
              </div>
                )
              : (
              <IconButton
                icon={
                  <RiPlayFill className="mx-2 text-green-500 text-2xl transition-colors animate-pulse transform scale-125 duration-1000 animate-3" />
                }
                size="default"
                click={eventHandlers.handleOpenModal}
              />
                )}
            <Settings title={user?.name} />
          </div>
        </div>
      </Header>
      <Modal
        title="Add Clock in"
        width={400}
        isModalOpen={isModalOpen}
        handleCancel={eventHandlers.handleCloseModal}
        handleSave={eventHandlers.handleSaveClockin}
        validate={!isClockinValidated}
      >
        <ClockIn
          setClockin={setClockin}
          updateValidation={eventHandlers.handleClockinValidation}
          updateClockin={!true}
        />
      </Modal>
      <Result
        title={error ? error.request.statusText : null}
        subtitle={error ? error.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={eventHandlers.handleCloseResult}
      />
    </>
  )
}

export default HeaderPage
