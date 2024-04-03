import { Button } from "native-base";
import { ComponentProps } from "react";

type FFButtonProps = ComponentProps<typeof Button>;

export const FFButton = (props: FFButtonProps) => (
  <Button backgroundColor="bg" borderRadius={9999} p={4} {...props} />
);
