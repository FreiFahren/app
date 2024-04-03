import { Box, Row, Spinner, Text, View } from "native-base";

import { useLines, useReports, useStations } from "./api/queries";
import { FFMapView } from "./components/FFMapView";
import { ReportButton } from "./components/ReportButton";
import { ReportListButton } from "./components/ReportListButton";

const LoadingBar = () => (
  <Row bg="black" borderRadius={4} px={4} py={1} justifyContent="space-between">
    <Text color="white">Loading...</Text>
    <Spinner size={8} />
  </Row>
);

export const Main = () => {
  const { isLoading: isLoadingStations } = useStations();
  const { isLoading: isLoadingLines } = useLines();
  const { isLoading: isLoadingReports, data: reports } = useReports();

  if (isLoadingStations || isLoadingLines) return null;

  return (
    <View flex={1}>
      <FFMapView reports={reports ?? []} />
      <Box
        flex={1}
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        pointerEvents="box-none"
        justifyContent="flex-end"
        px={4}
        pb={8}
        safeArea
      >
        {isLoadingReports && <LoadingBar />}
        <ReportListButton reports={reports ?? []} alignSelf="flex-end" />
        <ReportButton alignSelf="flex-end" mt={2} />
      </Box>
    </View>
  );
};
