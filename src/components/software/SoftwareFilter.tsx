
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface SoftwareFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchTerm: string;
  owner: string;
  dateRange: string;
}

export const SoftwareFilter = ({ onFilterChange }: SoftwareFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    owner: '',
    dateRange: ''
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { searchTerm: '', owner: '', dateRange: '' };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">篩選條件</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜尋軟體名稱或ID"
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Input
          placeholder="擁有者"
          value={filters.owner}
          onChange={(e) => updateFilter('owner', e.target.value)}
        />
        
        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="上架日期"
            value={filters.dateRange}
            onChange={(e) => updateFilter('dateRange', e.target.value)}
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={clearFilters}
            title="清除篩選"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
