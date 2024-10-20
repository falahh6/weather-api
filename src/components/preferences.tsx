import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Switch, InputNumber, Checkbox, Button } from "antd";
import { Settings } from "lucide-react";

const PreferencesModal = ({
  tempUnit,
  setTempUnit,
}: {
  tempUnit: "C" | "F";
  setTempUnit: Dispatch<SetStateAction<"C" | "F">>;
}) => {
  // State to control the visibility of the modal
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Preferences state
  const [temperature, setTemperature] = useState<number>(35); // Temperature threshold
  const [highTempThreshold, setHighTempThreshold] = useState<number>(40); // High severity temperature threshold
  const [selectedWeatherConditions, setSelectedWeatherConditions] = useState<
    string[]
  >(["Stormy", "Extreme Heat"]); // Selected weather conditions

  // Weather conditions available for selection
  const weatherConditions = [
    "Stormy",
    "Extreme Heat",
    "Rainy",
    "Snowy",
    "Windy",
  ];

  // Handlers for preferences state
  const handleUnitChange = (checked: boolean) => {
    setTempUnit(checked ? "F" : "C"); // Switch to Fahrenheit if checked, otherwise Celsius
  };

  const handleTemperatureChange = (value: number | null) => {
    setTemperature(value ?? 35); // Set temperature threshold (default to 35 if null)
  };

  const handleHighTempThresholdChange = (value: number | null) => {
    setHighTempThreshold(value ?? 40); // Set high temperature threshold (default to 40 if null)
  };

  const handleWeatherConditionsChange = (checkedValues: string[]) => {
    setSelectedWeatherConditions(checkedValues); // Update selected weather conditions
  };

  // Modal visibility handlers
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close the modal when user clicks "OK"
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal when user clicks "Cancel"
  };

  return (
    <div>
      {/* Button to open preferences modal */}
      <Button type="default" onClick={showModal}>
        <Settings className="h-4 w-4" />
      </Button>

      {/* Preferences Modal */}
      <Modal
        title="User Preferences"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        footer={false}
      >
        {/* Switch for selecting units (Celsius or Fahrenheit) */}
        <div style={{ marginBottom: 16 }}>
          <span>Temperature Unit: </span>
          <span>
            <Switch
              checkedChildren="°F"
              unCheckedChildren="°C"
              checked={tempUnit === "F"}
              onChange={handleUnitChange}
            />
          </span>
        </div>

        {/* InputNumber for Temperature Threshold */}
        <div style={{ marginBottom: 16 }}>
          <span>Temperature Threshold: </span>
          <InputNumber
            min={-50}
            max={100}
            value={temperature}
            onChange={handleTemperatureChange}
            addonAfter={`°${tempUnit}`}
          />
        </div>

        {/* InputNumber for High Temperature Threshold */}
        <div style={{ marginBottom: 16 }}>
          <span>High Temperature Threshold: </span>
          <InputNumber
            min={-50}
            max={100}
            value={highTempThreshold}
            onChange={handleHighTempThresholdChange}
            addonAfter={`°${tempUnit}`}
          />
        </div>

        {/* Checkbox Group for Weather Condition Selection */}
        <div>
          <span>Weather Conditions: </span>
          <Checkbox.Group
            options={weatherConditions}
            value={selectedWeatherConditions}
            onChange={handleWeatherConditionsChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PreferencesModal;
