import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { sum } from "lodash";
import { Spinner, Stack, Text, View } from "native-base";
import {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  Ref,
  useRef,
} from "react";

import { type Report } from "../api/client";
import { useReports, useStations } from "../api/queries";
import { FFButton } from "./common/FFButton";
import { FFScrollSheet } from "./common/FFSheet";

type ReportItemProps = {
  report: Report;
};

const ReportItem = ({ report }: ReportItemProps) => {
  const { data: station } = useStations(
    (stations) => stations[report.stationId]
  );

  if (station === undefined) return null;

  return (
    <Stack space={2}>
      <View flexDir="row" alignItems="center">
        {station.lines.map((line) => (
          <View key={line} bg={`lines.${line}`} px={1} borderRadius={4} mr={1}>
            <Text color="white" bold>
              {line}
            </Text>
          </View>
        ))}
        <Text color="white" bold ml={1}>
          {station.name}
        </Text>
      </View>
      <Text color="fg">
        {report.timestamp.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Stack>
  );
};

const useReportsByLine = (reports: Report[] | undefined) => {
  const { data: stations } = useStations();

  if (reports === undefined || stations === undefined) return {};

  const byLine = reports.reduce((acc, report) => {
    const station = stations[report.stationId];

    return station.lines.reduce(
      (accInner, line) => ({
        ...accInner,
        [line]: {
          ...accInner[line],
          [report.stationId]: (accInner[line][report.stationId] ?? 0) + 1,
        },
      }),
      acc
    );
  }, {} as Record<string, Record<string, number>>);

  return byLine;
};

export const ReportListSheet = forwardRef(
  (_props: PropsWithChildren<{}>, ref: Ref<BottomSheetModalMethods>) => {
    const { data: reports } = useReports();
    const { data: stations } = useStations();

    const reportsByLine = useReportsByLine(reports);
    const sortedReportsByLine = Object.entries(reportsByLine).sort(
      ([_, reportsA], [__, reportsB]) =>
        sum(Object.values(reportsB)) - sum(Object.values(reportsA))
    );

    return (
      <FFScrollSheet ref={ref}>
        <Text fontSize="xl" color="white" bold>
          Aktuelle Meldungen
        </Text>
        {reports?.length === 0 ? (
          <Text color="fg">Keine aktuellen Meldungen</Text>
        ) : reports === undefined ? (
          <View flex={1}>
            <Spinner />
          </View>
        ) : (
          <View>
            <Text>Nach Linie</Text>
            <Stack space={4} pb={12}>
              {reports.map((report) => (
                <ReportItem
                  key={`${
                    report.stationId
                  }-${report.timestamp.getMilliseconds()}`}
                  report={report}
                />
              ))}
            </Stack>
          </View>
        )}
      </FFScrollSheet>
    );
  }
);

type ReportListButtonProps = {
  reports: Report[];
} & Partial<ComponentProps<typeof FFButton>>;

export const ReportListButton = ({
  reports,
  ...props
}: ReportListButtonProps) => {
  const sheetRef = useRef<BottomSheetModalMethods>(null);

  return (
    <>
      <FFButton onPress={() => sheetRef.current?.present()} {...props}>
        <Ionicons name="list-outline" size={40} color="white" />
      </FFButton>
      <ReportListSheet ref={sheetRef} />
    </>
  );
};
