import {
  MenuContent,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { VStack } from "@chakra-ui/react";

export type FilterButtonProps = {
  archived: boolean;
  setArchived: (archived: boolean) => void;
};

export function FilterButton({ archived, setArchived }: FilterButtonProps) {
  return (
    <>
      <VStack alignSelf="end" textAlign="flex-end" alignItems="end">
        <h5>Filter</h5>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="outline">
              <FilterIcon /> {archived ? "Archived" : "Active"}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuRadioItemGroup
              value={archived ? "archived" : "active"}
              onValueChange={(e) => setArchived(e.value)}>
              <MenuRadioItem value="active">Active</MenuRadioItem>
              <MenuRadioItem value="archived">Archived</MenuRadioItem>
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </>
  );
}
