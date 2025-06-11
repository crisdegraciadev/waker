import { Button } from "@/core/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/core/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover";
import { cn } from "@/core/lib/utils";
import { Check, CirclePlus } from "lucide-react";

type Props<T extends string> = {
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  filters: T[];
  setFilters: (val: T[]) => void;
};

export function FacetedFilter<T extends string>({ title, options, labels, setFilters, filters }: Props<T>) {
  function handleSelect(isSelected: boolean, option: T) {
    setFilters(isSelected ? filters.filter((o) => o !== option) : [...filters, option]);
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
                const isSelected = !!filters.find((o) => o === option);

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
