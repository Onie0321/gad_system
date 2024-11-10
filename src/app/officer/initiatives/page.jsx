"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Download,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Save,
  Upload,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadExcelFile } from "@/lib/appwrite";

const cellColors = [
  "border-red-400",
  "border-blue-400",
  "border-green-400",
  "border-yellow-400",
  "border-purple-400",
  "border-pink-400",
  "border-indigo-400",
  "border-teal-400",
];

export default function AdvancedFuturisticExcelTable() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recentImports, setRecentImports] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filters, setFilters] = useState({});
  const [fileName, setFileName] = useState("");
  const scrollAreaRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const headerRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name.split(".").slice(0, -1).join("."));
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        // Fetch the list of existing files in the storage bucket
        const existingFilesResponse = await storage.listFiles(
          appwriteConfig.exceluploadsCollectionId
        );
  
        // Check for duplicate file name
        const isDuplicateFile = existingFilesResponse.files.some(
          (file) => file.name === selectedFile.name
        );
  
        if (isDuplicateFile) {
          setError(`A file with the name "${selectedFile.name}" already exists. Please rename your file or choose another one.`);
          return; // Stop further execution if a duplicate is found
        }
  
        // Proceed with uploading the file if no duplicate is found
        const uploadResponse = await uploadExcelFile(selectedFile);
  
        // Parse and set the data from the uploaded file
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const bstr = evt.target?.result;
            const wb = read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const parsedData = utils.sheet_to_json(ws, { header: 1 });
  
            if (parsedData.length > 0) {
              setHeaders(parsedData[0]);
              const nonEmptyRows = parsedData.slice(1).filter(row =>
                row.some((cell) => cell !== "" && cell !== null)
              );
              setData(nonEmptyRows);
              calculateChartData(nonEmptyRows, parsedData[0]);
              setError(null);
  
              const newImport = {
                id: Date.now(),
                name: fileName,
                date: new Date().toLocaleString(),
                fileUrl: uploadResponse?.$id,
              };
  
              // Update the recent imports list
              setRecentImports((prev) => [newImport, ...prev.slice(0, 4)]);
            } else {
              setError("The uploaded file is empty.");
            }
          } catch (error) {
            setError("An error occurred while parsing the file. Please ensure it's a valid Excel file.");
          }
        };
        reader.readAsBinaryString(selectedFile);
        setSelectedFile(null);
      } catch (error) {
        setError("Failed to upload the file to Appwrite storage.");
      }
    }
  };  
  
  const calculateChartData = useCallback((data, headers) => {
    const newChartData = {};
    headers.forEach((header, index) => {
      if (typeof data[0][index] === "number") {
        // For numeric data, create a line chart
        newChartData[header] = {
          type: "line",
          data: data.map((row, i) => ({
            name: `Row ${i + 1}`,
            value: row[index],
          })),
        };
      } else {
        // For categorical data, create a pie chart
        const counts = {};
        data.forEach((row) => {
          const value = row[index];
          counts[value] = (counts[value] || 0) + 1;
        });
        newChartData[header] = {
          type: "pie",
          data: Object.entries(counts).map(([name, value]) => ({
            name,
            value,
          })),
        };
      }
    });
    setChartData(newChartData);
  }, []);

  const handleExport = () => {
    const ws = utils.json_to_sheet([headers, ...data]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, `${fileName || "exported_data"}.xlsx`);
  };

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const newData = [...data];
    newData[rowIndex][cellIndex] = value;
    setData(newData);
    calculateChartData(newData, headers);
  };

  const handleAddRow = () => {
    const newRow = headers.map(() => "");
    setData([newRow, ...data]);
    calculateChartData([newRow, ...data], headers);
  };

  const handleAddColumn = (newColumnName) => {
    setHeaders([...headers, newColumnName]);
    const newData = data.map((row) => [...row, ""]);
    setData(newData);
    calculateChartData(newData, [...headers, newColumnName]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    calculateChartData(newData, headers);
  };

  const handleUpdateRow = (rowIndex, updatedRow) => {
    const newData = [...data];
    newData[rowIndex] = updatedRow;
    setData(newData);
    calculateChartData(newData, headers);
  };

  const handleSaveCell = () => {
    setEditingCell(null);
    calculateChartData(data, headers);
  };

  const handleRefresh = () => {
    calculateChartData(data, headers);
  };

  const handleSave = () => {
    console.log("Saving data:", { headers, data });
  };

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    if (headerRef.current) {
      headerRef.current.style.transform = `translateY(${scrollAreaRef.current.scrollTop}px)`;
    }
  };

  const scrollTo = (direction) => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const scrollHeight = scrollArea.scrollHeight;
      const clientHeight = scrollArea.clientHeight;
      const currentScroll = scrollArea.scrollTop;
      const targetScroll =
        direction === "top" ? 0 : scrollHeight - clientHeight;

      const startTime = performance.now();
      const duration = 300;

      const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
          const newScrollPosition =
            currentScroll + (targetScroll - currentScroll) * easeProgress;
          scrollArea.scrollTop = newScrollPosition;
          requestAnimationFrame(animateScroll);
        } else {
          scrollArea.scrollTop = targetScroll;
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sortedAndFilteredData = [...data]
    .filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        const index = headers.indexOf(key);
        return (
          value === "" ||
          row[index].toString().toLowerCase().includes(value.toLowerCase())
        );
      });
    })
    .sort((a, b) => {
      if (sortConfig.key === null) return 0;
      const index = headers.indexOf(sortConfig.key);
      if (a[index] < b[index])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[index] > b[index])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  const handleFileNameChange = (e) => {
    const newFileName = e.target.value;
    setFileName(newFileName);
    setRecentImports((prev) =>
      prev.map((import_) =>
        import_.id === selectedFile?.lastModified
          ? { ...import_, name: newFileName }
          : import_
      )
    );
  };

  const handleUpdateRecentImport = (id, newName) => {
    setRecentImports((prev) =>
      prev.map((import_) =>
        import_.id === id ? { ...import_, name: newName } : import_
      )
    );
  };

  const handleDeleteRecentImport = (id) => {
    setRecentImports((prev) => prev.filter((import_) => import_.id !== id));
  };

  return (
    <div className="container mx-auto p-4 space-y-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-black text-center">
        Advanced Futuristic Excel Table
      </h1>

      <div className="flex items-center space-x-2 justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Upload className="mr-2 h-4 w-4" /> Import Excel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Import Excel File</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to import this Excel file? This action
                will replace the current data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
              className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFileUpload}>
                Import
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {headers.length > 0 && (
        <div className="relative border-2 border-purple-500 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">
              <Input
                value={fileName}
                onChange={handleFileNameChange}
                className="text-2xl font-bold bg-transparent border-none hover:bg-gray-100 focus:bg-white"
              />
            </h2>
          </div>
          <ScrollArea className="h-[400px] rounded-md" ref={scrollAreaRef}>
            <Table>
              <TableHeader
                ref={headerRef}
                className="sticky top-0 bg-gray-100 z-10"
              >
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`font-bold text-black border-2 ${
                        cellColors[index % cellColors.length]
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{header}</span>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(header)}
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Filter className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    Filter {header}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Enter a value to filter this column
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor={`filter-${header}`}>
                                      Value
                                    </Label>
                                    <Input
                                      id={`filter-${header}`}
                                      value={filters[header] || ""}
                                      className="col-span-2 h-8"
                                      onChange={(e) =>
                                        handleFilter(header, e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="font-bold text-black border-2 border-gray-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedAndFilteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    {headers.map((header, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={`text-black border-2 ${
                          cellColors[cellIndex % cellColors.length]
                        }`}
                      >
                        {editingCell?.row === rowIndex &&
                        editingCell?.cell === cellIndex ? (
                          <Input
                            value={
                              row[cellIndex] !== undefined ? row[cellIndex] : ""
                            }
                            onChange={(e) =>
                              handleCellEdit(
                                rowIndex,
                                cellIndex,
                                e.target.value
                              )
                            }
                            onBlur={handleSaveCell}
                            className="bg-transparent border-none hover:bg-gray-100 focus:bg-white"
                          />
                        ) : (
                          <span
                            onClick={() =>
                              setEditingCell({ row: rowIndex, cell: cellIndex })
                            }
                            className="cursor-pointer block w-full h-full"
                          >
                            {row[cellIndex]}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="border-2 border-gray-400">
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Update Row</AlertDialogTitle>
                              <AlertDialogDescription>
                                Edit the values for this row:
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              {headers.map((header, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-4 items-center gap-4"
                                >
                                  <Label
                                    htmlFor={`row-${rowIndex}-${header}`}
                                    className="text-right"
                                  >
                                    {header}
                                  </Label>
                                  <Input
                                    id={`row-${rowIndex}-${header}`}
                                    defaultValue={row[index]}
                                    className="col-span-3"
                                  />
                                </div>
                              ))}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  const updatedRow = headers.map(
                                    (_, index) =>
                                      document.getElementById(
                                        `row-${rowIndex}-${headers[index]}`
                                      ).value
                                  );
                                  handleUpdateRow(rowIndex, updatedRow);
                                }}
                              >
                                Update
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Row</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this row? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRow(rowIndex)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {data.length > 0 && (
            <div className="mt-4 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Export Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to export this data to an Excel
                      file?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExport}>
                      Export
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          {!isScrolling && (
            <div className="absolute right-2 top-2 flex flex-col space-y-2">
              <Button
                onClick={() => scrollTo("top")}
                size="sm"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => scrollTo("bottom")}
                size="sm"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {headers.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex space-x-2 justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Row
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Row</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to add a new row to the top of the
                    table?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddRow}>
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Column
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Column</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the name for the new column:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input id="new-column-name" placeholder="Enter column name" />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const newColumnName =
                        document.getElementById("new-column-name").value;
                      if (newColumnName) {
                        handleAddColumn(newColumnName);
                      }
                    }}
                  >
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={handleRefresh}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save the current data?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="border-2 border-purple-500 rounded-lg p-4 bg-white">
            <h2 className="text-xl font-bold mb-2 text-black">
              Data Visualization
            </h2>
            <Tabs defaultValue="charts" className="w-full">
              <TabsList>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="charts">
                <ScrollArea
                  className={`${
                    Object.entries(chartData).length > 4
                      ? "max-h-[400px] overflow-y-auto"
                      : ""
                  } rounded-md`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(chartData).map(([header, chartInfo]) => (
                      <Card key={header}>
                        <CardHeader>
                          <CardTitle>{header}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            {chartInfo.type === "line" ? (
                              <LineChart data={chartInfo.data}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#8884d8"
                                />
                              </LineChart>
                            ) : (
                              <PieChart>
                                <Pie
                                  data={chartInfo.data}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  label
                                />
                                <Tooltip />
                              </PieChart>
                            )}
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="summary">
                <ScrollArea
                  className={`${
                    Object.entries(chartData).length > 5
                      ? "max-h-[200px] overflow-y-auto"
                      : ""
                  } rounded-md`}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column</TableHead>
                        <TableHead>Summary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-900">
                      {Object.entries(chartData).map(([header, chartInfo]) => (
                        <TableRow key={header}>
                          <TableCell>{header}</TableCell>
                          <TableCell>
                            {chartInfo.type === "line"
                              ? `Numeric data with ${chartInfo.data.length} points`
                              : `${chartInfo.data.length} unique categories`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {recentImports.length > 0 && (
        <div className="mt-4 border-2 border-purple-500 rounded-lg p-4 bg-white">
          <h2 className="text-xl font-bold mb-2 text-black">Recent Imports</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">
                  File Name
                </TableHead>
                <TableHead className="font-bold text-black">
                  Import Date
                </TableHead>
                <TableHead className="font-bold text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentImports.map((import_) => (
                <TableRow key={import_.id}>
                  <TableCell className="text-black">{import_.name}</TableCell>
                  <TableCell className="text-black">{import_.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Update Import Name
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Edit the name for this import:
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Input
                            id={`import-${import_.id}`}
                            defaultValue={import_.name}
                            className="mt-2"
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const newName = document.getElementById(
                                  `import-${import_.id}`
                                ).value;
                                handleUpdateRecentImport(import_.id, newName);
                              }}
                            >
                              Update
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Import</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this import from
                              the recent list? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteRecentImport(import_.id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
