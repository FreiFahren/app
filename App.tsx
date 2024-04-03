import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { NativeBaseProvider, StatusBar, View } from "native-base";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "./src/api";
import { Main } from "./src/Main";
import { theme } from "./src/theme";

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle="light-content" />
          <GestureHandlerRootView style={StyleSheet.absoluteFill}>
            <BottomSheetModalProvider>
              <View flex={1} alignItems="center" justifyContent="center">
                <Main />
              </View>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

const enableMocking = async () => {
  await import("./msw.polyfills");
  const { server } = await import("./tests/mockserver");

  server.listen();
};

if (__DEV__) {
  enableMocking().catch(() => {
    // eslint-disable-next-line no-console
    console.error("Failed to enable mocking");
  });
}

// eslint-disable-next-line import/no-default-export
export default App;
