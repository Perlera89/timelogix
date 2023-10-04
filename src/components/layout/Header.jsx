"use client";
import { usePathname } from "next/navigation";

// components
import React, { useState, useEffect } from "react";
import { Layout, Button, Typography } from "antd";
import Settings from "@/components/Settings";
import IconButton from "@/components/button/IconButton";
import Modal from "@/components/Modal";
import ClockIn from "@/components/timesheet/ClockIn";

// icons
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPlayFill,
  RiStopFill,
} from "react-icons/ri";

const { Header } = Layout;
const { Text, Title } = Typography;

const HeaderPage = ({ handleCollapsed, collapsed }) => {
  // useStates
  const [startClock, setStartClock] = useState(false);
  const [time, setTime] = useState("00:00:00");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = usePathname();
  const path =
    currentPage.replace("/", "").charAt(0).toUpperCase() +
    currentPage.replace("/", "").slice(1);

  // handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setStartClock(true);
    handleCloseModal();
  };

  const handleClock = () => {
    setStartClock(!startClock);
  };

  useEffect(() => {
    let intervalId;

    if (startClock) {
      let seconds = 0;
      intervalId = setInterval(() => {
        seconds++;
        const formattedTime = formatTime(seconds);
        setTime(formattedTime);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [startClock]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <Header
        className="border-b-2 border-border-black"
        style={{
          padding: 0,
          background: "#191919",
        }}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-start">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <RiArrowRightSLine className="text-2xl" title="Show menu" />
                ) : (
                  <RiArrowLeftSLine className="text-2xl" title="Hide menu" />
                )
              }
              onClick={handleCollapsed}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Title className="flex items-center text-ghost-white" level={4}>
              {path}
            </Title>
          </div>
          <div className="flex justify-end mr-4 gap-4">
            {startClock ? (
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
                  click={handleClock}
                />
              </div>
            ) : (
              <IconButton
                icon={
                  <RiPlayFill className="mx-2 text-green-500 text-2xl transition-colors" />
                }
                size="default"
                click={handleOpenModal}
              />
            )}
            <Settings title="Denis Lopez" />
          </div>
        </div>
      </Header>
      <Modal
        title="Add Clock in"
        width={400}
        isModalOpen={isModalOpen}
        handleCancel={handleCloseModal}
        handleSave={handleSave}
      >
        <ClockIn />
      </Modal>
    </>
  );
};

export default HeaderPage;
