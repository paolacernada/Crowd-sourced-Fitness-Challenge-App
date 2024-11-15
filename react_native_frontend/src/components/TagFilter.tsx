import React, { useState, useEffect } from "react";
import { View } from "react-native";
import MultiSelect from "react-native-multiple-select";
import { getTags } from "../services/tagService";

interface TagFilterProps {
  selectedTags: number[];
  onSelectedTagsChange: (selectedTags: number[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onSelectedTagsChange,
}) => {
  const [availableTags, setAvailableTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <View>
      <MultiSelect
        items={availableTags.map((tag) => ({ id: tag.id, name: tag.name }))}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedTagsChange}
        selectedItems={selectedTags}
        selectText="Filter by Tags"
        searchInputPlaceholderText="Search Tags..."
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#000" }}
        submitButtonColor="#48d22b"
        submitButtonText="Apply"
      />
    </View>
  );
};

export default TagFilter;
