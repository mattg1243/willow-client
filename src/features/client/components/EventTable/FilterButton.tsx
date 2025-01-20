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

export type FilterOptions = "Charge" | "Payment" | "All";

export type FilterButtonProps = {
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
};

export function FilterButton({ filter, setFilter }: FilterButtonProps) {
  return (
    <>
      <VStack alignSelf="end" textAlign="flex-end" alignItems="end">
        <h5>Filter</h5>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="outline">
              <FilterIcon /> {filter}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuRadioItemGroup
              value={filter}
              onValueChange={(e) => setFilter(e.value as FilterOptions)}>
              <MenuRadioItem value="Charge">Charge</MenuRadioItem>
              <MenuRadioItem value="Payment">Payment</MenuRadioItem>
              <MenuRadioItem value="All">All</MenuRadioItem>
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
    </>
  );
}
