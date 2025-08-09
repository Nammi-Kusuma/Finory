"use client"

import React, { useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, X } from 'lucide-react';
import { deleteTransactions } from '@/actions/accounts';
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';

const ITEMS_PER_PAGE = 25;

const recurringIntervals = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
}

const TransactionsTable = ({ transactions }) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [page, setPage] = useState(1);

  const { loading: deleteLoading, func: deleteFunc, data: deletedTransactions } = useFetch(deleteTransactions);

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete these transactions?")) return;

    await deleteFunc(selectedIds);
    setSelectedIds([]);
  }

  useEffect(() => {
    if(deletedTransactions && !deleteLoading) {
      toast.success("Transactions deleted successfully");
    } 
  }, [deletedTransactions]);

  const filterASorted = useMemo(() => {
    let res = [...transactions];

    if(searchTerm) {
      const search = searchTerm.toLowerCase();
      res = res.filter((transaction) => transaction.description?.toLowerCase().includes(search));
    }

    if(typeFilter) {
      res = res.filter((transaction) => transaction.type === typeFilter);
    }

    if(recurringFilter) {
      res = res.filter((transaction) => {
        if(recurringFilter === "recurring") {
          return transaction.recurringInterval;
        } else {
          return !transaction.recurringInterval;
        }
      });
    }

    res.sort((a, b) => {
      let comp = 0;

      switch(sortConfig.field) {
        case "date":
          comp = new Date(a.date) - new Date(b.date);
          break;
        case "category":
          comp = a.category.localeCompare(b.category);
          break;
        case "amount":
          comp = a.amount - b.amount;
          break;
        default:
          comp = 0;
          break;
      }

      return comp * (sortConfig.direction === "asc" ? 1 : -1);
    })

    return res;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  const handleSelect = (id) => {
    setSelectedIds(curr => {
      if (curr.includes(id)) {
        return curr.filter((item) => item !== id)
      } else {
        return [...curr, id]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(curr => {
      if (curr.length === filterASorted.length) {
        return []
      } else {
        return filterASorted.map((transaction) => transaction.id)
      }
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  }

  const totalPages = Math.ceil(
    filterASorted.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filterASorted.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filterASorted, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedIds([]);
  }

  return (
    <div className='space-y-4'>
      {deleteLoading && <BarLoader className='mt-4' width={"100%"} color="#9333ea" />}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (<div>
            <Button variant="destructive" onClick={handleDelete} size="sm">
              Delete ({selectedIds.length})
              <Trash className="mr-1 h-4 w-4" />
            </Button>
          </div>)}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="outline" onClick={handleClearFilters} size="sm">
              Clear
              <X className="mr-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={handleSelectAll} checked={selectedIds.length === filterASorted.length && filterASorted.length > 0} />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>
                Description
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className='flex items-center'>Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
                <div className='flex items-center justify-end'>Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (<TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No transactions.
              </TableCell>
            </TableRow>) :
              (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox onCheckedChange={() => handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)} disabled={paginatedTransactions.length === 0} />
                    </TableCell>
                    <TableCell className="font-medium">{format(new Date(transaction.date), "PP")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      <span style={{ background: categoryColors[transaction.category] }} className='px-2 py-1 rounded text-xs text-white'>
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right" style={{ color: transaction.type === "EXPENSE" ? "red" : "green" }}>
                      {transaction.type === "EXPENSE" ? "-" : ""}${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                              <RefreshCw className="w-4 h-4" />{recurringIntervals[transaction.recurringInterval]}</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='flex flex-col gap-1'>
                              <div className='font-medium'>
                                Next Date:
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {format(new Date(transaction.nextRecurringDate), "PP")}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) :
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-4 h-4" />One time</Badge>}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                          >Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"
                            onClick={() => deleteFunc([transaction.id])}
                          >Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )
            }
          </TableBody>
        </Table>
      </div>

      {transactions.length > 10 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
