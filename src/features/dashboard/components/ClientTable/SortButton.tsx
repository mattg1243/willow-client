import {
  MenuContent,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { SortAscIcon, SortDescIcon } from "lucide-react";
import { VStack } from "@chakra-ui/react";

export type SortByOptions =
  | "fname"
  | "lname"
  | "balance"
  | "created_at"
  | "updated_at";
export type SortByOrder = "asc" | "desc";

type SortButtonProps = {
  sortBy: SortByOptions;
  onSortByChange: (options: SortByOptions) => void;
  order: SortByOrder;
  onOrderChange: (order: SortByOrder) => void;
};

export function SortButton({
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
}: SortButtonProps) {
  const SortIcon = () => (order === "asc" ? <SortAscIcon /> : <SortDescIcon />);

  const getSortTitle = (sortBy: SortByOptions) => {
    switch (sortBy) {
      case "fname":
        return "First name";
      case "lname":
        return "Last name";
      case "balance":
        return "Balance";
      case "created_at":
        return "Date created";
      case "updated_at":
        return "Recent";
    }
  };

  return (
    <>
      <VStack alignItems="start">
        <h5>Sort by</h5>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="outline">
              <SortIcon /> {getSortTitle(sortBy)}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuRadioItemGroup
              value={sortBy}
              onValueChange={(e) => onSortByChange(e.value as SortByOptions)}>
              <MenuRadioItem value="fname">First name</MenuRadioItem>
              <MenuRadioItem value="lname">Last name</MenuRadioItem>
              <MenuRadioItem value="created_at">Date created</MenuRadioItem>
              <MenuRadioItem value="updated_at">Recent</MenuRadioItem>
            </MenuRadioItemGroup>
            <MenuSeparator />
            <MenuRadioItemGroup
              value={order}
              onValueChange={(e) => onOrderChange(e.value as SortByOrder)}>
              <MenuRadioItem value="asc">Ascending</MenuRadioItem>
              <MenuRadioItem value="desc">Descending</MenuRadioItem>
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </>
  );
}
