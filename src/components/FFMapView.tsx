import { FontAwesome6 } from "@expo/vector-icons";
import { pick } from "lodash";
import { Text, View } from "native-base";
import { Dimensions } from "react-native";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";

import { Report } from "../api";
import { useStations } from "../api/queries";
import { config } from "../config";
import { theme } from "../theme";
import { FFLineTag } from "./common/FFLineTag";

const MAP_REGION = {
  longitude: 13.40587,
  latitude: 52.51346,
  longitudeDelta: 0.1,
  latitudeDelta: 0.1,
};

type ReportMarkerProps = {
  report: Report;
};

const ReportMarker = ({
  report: { stationId, timestamp },
}: ReportMarkerProps) => {
  const { data: station } = useStations((stations) => stations[stationId]);

  if (station === undefined) return null;

  return (
    <Marker
      coordinate={station.coordinates}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -15 }}
    >
      <View shadow="2">
        <FontAwesome6
          name="location-pin"
          size={40}
          color={theme.colors.danger}
        />
      </View>
      <Callout
        tooltip
        style={{
          flex: -1,
          width: 200,
          alignItems: "center",
        }}
      >
        <View p={2} bg="bg" borderRadius={10}>
          <View flexDir="row" alignItems="center" bg="bg">
            {station.lines.map((line) => (
              <FFLineTag key={line} line={line} />
            ))}
            <Text color="white" bold ml={1}>
              {station.name}
            </Text>
          </View>
          <Text color="fg" mt={1}>
            {new Date(timestamp).toLocaleString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
};

type FFMapViewProps = {
  reports: Report[];
};

export const FFMapView = ({ reports }: FFMapViewProps) => {
  const size = pick(Dimensions.get("window"), ["width", "height"]);

  return (
    <MapView style={size} region={MAP_REGION} userInterfaceStyle="dark">
      <UrlTile urlTemplate={config.MAP_URL} maximumZ={8} />
      {reports.map((report) => (
        <ReportMarker report={report} key={report.stationId} />
      ))}
    </MapView>
  );
};
