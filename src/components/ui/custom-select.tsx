import { Select as ChakraSelect, ListCollection } from "@chakra-ui/react";
import { ValueChangeDetails } from "@zag-js/listbox";
import { useEffect } from "react";

export type CollectionItem<T> = {
  label: string;
  value: T;
};

export type SelectProps<T> = {
  options: ListCollection<CollectionItem<T>> | undefined;
  onChange: (details: ValueChangeDetails<CollectionItem<T>>) => void;
  value: string | undefined;
  label: string;
};

export function Select<T>(props: SelectProps<T>) {
  const { options, onChange, label, value } = props;

  useEffect(() => {
    console.log("Value in select: ", value);
  }, [value]);

  if (!options)
    return (
      <div>
        <label>{label}</label>
        <p>Loading options...</p>
      </div>
    );

  return (
    <ChakraSelect.Root onValueChange={onChange} collection={options}>
      <ChakraSelect.Label>{label}</ChakraSelect.Label>
      <ChakraSelect.Trigger>
        <ChakraSelect.ValueText />
      </ChakraSelect.Trigger>
      <ChakraSelect.Content>
        {options.items.map((item) => (
          <ChakraSelect.Item key={String(item.label)} item={item}>
            {item.label}
          </ChakraSelect.Item>
        ))}
      </ChakraSelect.Content>
    </ChakraSelect.Root>
  );
}
