import { Button } from "@/core/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/core/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover";
import { cn } from "@/core/lib/utils";
import { Check, CirclePlus } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  options: readonly string[];
  labels: Record<string, string>;
};

export function FacetedFilter({ title, options, labels }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  function handleSelect(isSelected: boolean, option: string) {
    setSelectedOptions(isSelected ? selectedOptions.filter((o) => o !== option) : [...selectedOptions, option]);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="whitespace-nowrap font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 text-xs h-8 border-dashed"
        >
          <CirclePlus className="size-4 " /> {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty />
            <CommandGroup>
              {options.map((option) => {
                const isSelected = !!selectedOptions.find((o) => o === option);

                return (
                  <CommandItem key={option as string} onSelect={() => handleSelect(isSelected, option)}>
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input [&_svg]:invisible",
                      )}
                    >
                      <Check className="text-primary-foreground size-3.5" />
                    </div>

                    {labels[option]}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
