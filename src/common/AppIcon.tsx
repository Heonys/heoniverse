import { X, LucideProps } from "lucide-react";

type IconNames = keyof typeof IconMap;
const IconMap = {
  ["x-mark"]: X,
};

type Props = { iconName: IconNames } & LucideProps;

export const AppIcon = ({ iconName, ...props }: Props) => {
  const Icon = IconMap[iconName];
  return <Icon {...props} />;
};
