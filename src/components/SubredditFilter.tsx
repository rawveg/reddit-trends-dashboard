import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Subreddit {
  value: string;
  label: string;
  subscribers: number;
}

interface SubredditFilterProps {
  subreddits: Subreddit[];
  selectedSubreddits: string[];
  onSelectionChange: (selected: string[]) => void;
}

const SubredditFilter = ({ subreddits, selectedSubreddits, onSelectionChange }: SubredditFilterProps) => {
  const [open, setOpen] = useState(false);

  const toggleSubreddit = (subredditValue: string) => {
    const newSelection = selectedSubreddits.includes(subredditValue)
      ? selectedSubreddits.filter(s => s !== subredditValue)
      : [...selectedSubreddits, subredditValue];
    
    onSelectionChange(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedSubreddits.length === 0
            ? "Select subreddits..."
            : `${selectedSubreddits.length} subreddit${selectedSubreddits.length > 1 ? 's' : ''} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search subreddits..." />
          <CommandList>
            <CommandEmpty>No subreddit found.</CommandEmpty>
            <CommandGroup>
              {subreddits.map((subreddit) => (
                <CommandItem
                  key={subreddit.value}
                  value={subreddit.value}
                  onSelect={() => toggleSubreddit(subreddit.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSubreddits.includes(subreddit.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">r/{subreddit.label}</div>
                    <div className="text-xs text-gray-500">
                      {subreddit.subscribers.toLocaleString()} subscribers
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SubredditFilter;