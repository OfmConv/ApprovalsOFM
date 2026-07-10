import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { interfaceSelectionGroups } from "@/types/interface"

export function SelectGroups({ desc, label, items }: interfaceSelectionGroups) {


  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={desc} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((i) => (
            <SelectItem key={i} value={i}>{i}</SelectItem>
          ))}
        </SelectGroup>

      </SelectContent>
    </Select>
  )
}
