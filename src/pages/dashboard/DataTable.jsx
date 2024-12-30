import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker as DatePickerAntd } from 'antd';
import dayjs from 'dayjs';

import Dot from 'components/@extended/Dot';

const { RangePicker } = DatePickerAntd;
const STATUS_PROCESS = 0;
const STATUS_SUCCESS = 1;
const STATUS_REJECT = 2;
const STATU_DEFAULT = 3;

const statusList = {
  [STATUS_PROCESS]: 'В обработке',
  [STATUS_SUCCESS]: 'Утвержден',
  [STATUS_REJECT]: 'Отклонен',
  [STATU_DEFAULT]: 'Не известно',
};

const statusColor = {
  [STATUS_PROCESS]: 'warning',
  [STATUS_SUCCESS]: 'success',
  [STATUS_REJECT]: 'error',
  [STATU_DEFAULT]: 'primary',
}

const OrderStatus = ({ status }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Dot color={statusColor[status]} />
    <div>{statusList[status]}</div>
  </Stack>
);

const columns = [
  { 
    field: 'id',
    headerName: 'Номер',
    width: 150,
  },
  { 
    field: 'name',
    headerName: 'Наименование',
    width: 300,
  },
  { 
    field: 'fat', 
    headerName: 'Количество',
    type: 'number',
    width: 150,
  },
  { 
    field: 'createdDate',
    headerName: 'Дата регистрации',
    width: 160,
    type: 'date',
  },
  {
    field: 'status',
    headerName: 'Статус',
    width: 150,
    sortable: false,
    renderCell: (params) => <OrderStatus status={params.value} />
  }
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  fontSize: 14,
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: '#1d1d1d',
    ...theme.applyStyles('light', {
      backgroundColor: '#fafafa',
    }),
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderRightColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderBottomColor: '#f0f0f0',
    }),
  },
}));

const createData = (id, name, fat, createdDate, status) => ({ id, name, fat, createdDate: new Date(createdDate), status });

const defaultRows = [
  createData(84564564, 'Camera Lens', 40, '2024-09-12T11:00:00', 2),
  createData(98764564, 'Laptop', 300, '2024-09-12T11:00:00', 0),
  createData(98756325, 'Mobile', 355, '2024-09-22T11:00:00', 1),
  createData(98652366, 'Handset', 50, '2024-09-12T11:00:00', 1),
  createData(13286564, 'Computer Accessories', 100, '2024-09-12T11:00:00',  1),
  createData(86739658, 'TV', 99, '2024-09-12T11:00:00', 0),
  createData(13256498, 'Keyboard', 125, '2024-09-12T11:00:00', 2),
  createData(98753263, 'Mouse', 89, '2024-09-12T11:00:00', 2),
  createData(98753275, 'Desktop', 185, '2024-09-12T11:00:00', 1),
  createData(98753291, 'Chair', 100, '2024-09-12T11:00:00', 0)
];

const DataTable = () => {
  const [rows, setRows] = useState(defaultRows);
  const [filterFields, setfilterFields] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFilterFieldChange = (fieldName, value) => {
    setfilterFields({...filterFields, [fieldName]: value });
  }

  const handleFilter = () => {
    setLoading(true);
    const { name, startDate, endDate, status } = filterFields;
    let filteredRows = defaultRows;
    if (name) {
      filteredRows = filteredRows.filter((item) => item.name.includes(name));
    }
    if (status) {
      filteredRows = filteredRows.filter((item) => item.status.toString() === status);
    }
    if (startDate) {
      filteredRows = filteredRows.filter((item) => startDate <= dayjs(item.createdDate));
    }
    if (endDate) {
      filteredRows = filteredRows.filter((item) => endDate >= dayjs(item.createdDate));
    }
    setRows(filteredRows);
    setLoading(false);
  }

  return (
    <>
      <Grid container spacing={1} alignItems="flex-end" mb={4} mt={2} px={1}>
        <Grid item xs={12} md={8}>
          <TextField 
            type="text"
            name="name" 
            id="name" 
            fullWidth
            label="Наименование"
            onChange={(event) => handleFilterFieldChange('name', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Статус</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              label="Статус"
              onChange={(event) => handleFilterFieldChange('status', event.target.value)}
              defaultValue={''}
            >
              <MenuItem value=''>&nbsp;</MenuItem>
              {Object.keys(statusList).map((item) => (
                <MenuItem value={item} key={item}>{statusList[item]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md>
          <RangePicker
            format="DD.MM.YYYY"
            onChange={(value) => {
              handleFilterFieldChange('startDate', value && value[0] ? value[0] : null);
              handleFilterFieldChange('endDate', value && value[1] ? value[1] : null);
            }}
            placeholder={['C', 'По']}
            id={['startDate', 'endDate']}
            size='large'
            allowEmpty={[true, true]}
          />
        </Grid>
        <Grid item xs={12} md={2} textAlign='right'>
          <Button variant="contained" onClick={handleFilter}>Найти</Button>
        </Grid>
      </Grid>
    <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }} }}
        pageSizeOptions={[5, 10]}
        disableColumnMenu={true}
        loading={loading}
      />
    </Box>
    </>
  );
}

export default DataTable;