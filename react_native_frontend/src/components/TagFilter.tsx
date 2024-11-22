import React, { useState, useEffect } from "react";
import MultiSelect from "react-native-multiple-select";
import { getTags } from "../services/tagService";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";

interface TagFilterProps {
  selectedTags: number[];
  onSelectedTagsChange: (selectedTags: number[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onSelectedTagsChange,
}) => {
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTags();
      setAvailableTags(tags);
    };
    fetchTags();
  }, []);

  return (
    <MultiSelect
      items={availableTags.map((tag) => ({ id: tag.id, name: tag.name }))}
      uniqueKey="id"
      onSelectedItemsChange={onSelectedTagsChange}
      selectedItems={selectedTags}
      selectText="Filter by Tags"
      searchInputPlaceholderText="Search Tags..."
      tagRemoveIconColor={theme === "dark" ? "#b05600" : "#f48c42"}
      tagBorderColor={theme === "dark" ? "#b05600" : "#f48c42"}
      tagTextColor={theme === "dark" ? "#fff" : "#000"}
      selectedItemTextColor={theme === "dark" ? "#b05600" : "#f48c42"}
      selectedItemIconColor={theme === "dark" ? "#b05600" : "#f48c42"}
      itemTextColor={theme === "dark" ? "#fff" : "#000"}
      displayKey="name"
      searchInputStyle={{
        ...styles.input,
        ...(theme === "dark" ? styles.darkInput : styles.lightInput),
      }}
      styleDropdownMenuSubsection={{
        width: "100%",
        marginBottom: 20,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        borderColor: theme === "dark" ? "#666" : "#ccc",
      }}
      styleListContainer={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
      }}
      submitButtonText="Apply"
      submitButtonColor={
        theme === "dark"
          ? styles.darkButton.backgroundColor
          : styles.lightButton.backgroundColor
      }
      styleSubmitButton={{
        ...styles.button,
        backgroundColor:
          theme === "dark"
            ? styles.darkButton.backgroundColor
            : styles.lightButton.backgroundColor,
      }}
      styleTextSubmitButton={{
        ...styles.buttonText,
      }}
      styleTextDropdown={{
        ...styles.dropdownText,
        color: theme === "dark" ? "#fff" : "#000",
      }}
      styleTextDropdownSelected={{
        color: theme === "dark" ? "#b05600" : "#f48c42",
      }}
      styleSearchWrapper={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        borderRadius: 8,
      }}
      styleInputGroup={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        borderRadius: 8,
      }}
    />
  );
};

export default TagFilter;
