import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Empty } from "antd";

interface WeatherAlertsCardProps {
  alerts: AlertType[];
}

const WeatherAlerts: React.FC<WeatherAlertsCardProps> = ({ alerts }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {alerts?.length > 0 ? (
          alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.severity === "high" ? "destructive" : "default"}
            >
              <AlertTitle>{alert.city}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))
        ) : (
          <Empty description="No Alerts" />
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;
