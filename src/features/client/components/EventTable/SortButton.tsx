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

export type SortByOptions = "created_at" | "amount";
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
      case "created_at":
        return "Date";
      case "amount":
        return "Amount";
    }
  };

  return (
    <>
      <VStack alignItems="start">
        <h5>Sort</h5>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="outline">
              <SortIcon />
              {getSortTitle(sortBy)}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuRadioItemGroup
              value={sortBy}
              onValueChange={(e) => {
                onSortByChange(e.value as SortByOptions);
              }}>
              <MenuRadioItem value="created_at">Date</MenuRadioItem>
              <MenuRadioItem value="amount">Amount</MenuRadioItem>
            </MenuRadioItemGroup>
            <MenuSeparator />
            <MenuRadioItemGroup
              value={order}
              onValueChange={(e) => {
                onOrderChange(e.value as SortByOrder);
              }}>
              <MenuRadioItem value="asc">Ascending</MenuRadioItem>
              <MenuRadioItem value="desc">Descending</MenuRadioItem>
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </>
  );
}
