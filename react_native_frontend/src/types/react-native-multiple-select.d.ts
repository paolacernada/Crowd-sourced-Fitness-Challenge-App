declare module "react-native-multiple-select" {
  import { Component } from "react";
  import { FlatListProps, StyleProp, ViewStyle, TextStyle } from "react-native";

  interface MultiSelectProps extends FlatListProps<any> {
    items: any[];
    uniqueKey: string;
    onSelectedItemsChange: (selectedItems: any[]) => void;
    selectedItems: any[];
    selectText?: string;
    searchInputPlaceholderText?: string;
    altFontFamily?: string;
    tagRemoveIconColor?: string;
    tagBorderColor?: string;
    tagTextColor?: string;
    selectedItemTextColor?: string;
    selectedItemIconColor?: string;
    itemTextColor?: string;
    displayKey?: string;
    searchInputStyle?: StyleProp<TextStyle>;
    submitButtonColor?: string;
    submitButtonText?: string;
    styleDropdownMenu?: StyleProp<ViewStyle>;
    hideSubmitButton?: boolean;
  }

  export default class MultiSelect extends Component<MultiSelectProps> {}
}
